import base64
import hashlib
import hmac
import json
from datetime import UTC, datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings

bearer_scheme = HTTPBearer(auto_error=False)


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("utf-8").rstrip("=")


def _b64url_decode(raw: str) -> bytes:
    pad = "=" * ((4 - len(raw) % 4) % 4)
    return base64.urlsafe_b64decode(f"{raw}{pad}".encode("utf-8"))


def create_admin_token() -> str:
    expires_at = datetime.now(UTC) + timedelta(minutes=settings.auth_token_ttl_minutes)
    payload = {"sub": settings.admin_username, "exp": int(expires_at.timestamp())}
    payload_json = json.dumps(payload, separators=(",", ":"), sort_keys=True).encode("utf-8")
    payload_b64 = _b64url_encode(payload_json)
    signature = hmac.new(
        settings.auth_secret.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256,
    ).digest()
    return f"{payload_b64}.{_b64url_encode(signature)}"


def verify_admin_token(token: str) -> bool:
    try:
        payload_b64, signature_b64 = token.split(".", 1)
        expected_sig = hmac.new(
            settings.auth_secret.encode("utf-8"),
            payload_b64.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        provided_sig = _b64url_decode(signature_b64)
        if not hmac.compare_digest(expected_sig, provided_sig):
            return False

        payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
        if payload.get("sub") != settings.admin_username:
            return False
        exp = int(payload.get("exp", 0))
        return datetime.now(UTC).timestamp() <= exp
    except Exception:
        return False


def require_admin(credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme)) -> None:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No autorizado")
    if not verify_admin_token(credentials.credentials):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sesion invalida o vencida")
