"""initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2026-05-11 00:00:00
"""

from alembic import op
import sqlalchemy as sa


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


estado_lote_enum = sa.Enum(
    "disponible",
    "vendido",
    "reservado",
    "no_disponible",
    "acuerdo_privado",
    name="estadolote",
)
modality_enum = sa.Enum("contado", "pesos_12", "usd_12", "usd_36", name="modality")
currency_enum = sa.Enum("ars", "usd", name="currency")


def upgrade() -> None:
    bind = op.get_bind()
    estado_lote_enum.create(bind, checkfirst=True)
    modality_enum.create(bind, checkfirst=True)
    currency_enum.create(bind, checkfirst=True)

    op.create_table(
        "clientes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_clientes_email"), "clientes", ["email"], unique=True)
    op.create_index(op.f("ix_clientes_id"), "clientes", ["id"], unique=False)

    op.create_table(
        "lotes",
        sa.Column("numero_lote", sa.String(length=50), nullable=False),
        sa.Column("manzana", sa.String(length=100), nullable=False),
        sa.Column("estado", estado_lote_enum, nullable=False),
        sa.Column("comercializable", sa.Boolean(), nullable=False),
        sa.Column("frente_m", sa.Float(), nullable=False),
        sa.Column("fondo_m", sa.Float(), nullable=False),
        sa.Column("area_m2", sa.Float(), nullable=False),
        sa.Column("plano_imagen_url", sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint("numero_lote"),
    )
    op.create_index(op.f("ix_lotes_manzana"), "lotes", ["manzana"], unique=False)
    op.create_index(op.f("ix_lotes_numero_lote"), "lotes", ["numero_lote"], unique=False)

    op.create_table(
        "lote_imagenes",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("lote_numero", sa.String(length=50), nullable=False),
        sa.Column("image_url", sa.String(length=255), nullable=False),
        sa.Column("orden", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["lote_numero"], ["lotes.numero_lote"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_lote_imagenes_lote_numero"), "lote_imagenes", ["lote_numero"], unique=False)

    op.create_table(
        "simulaciones_financiamiento",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("cliente_id", sa.Integer(), nullable=True),
        sa.Column("lote_numero", sa.String(), nullable=True),
        sa.Column("modalidad", modality_enum, nullable=False),
        sa.Column("moneda_base", currency_enum, nullable=False),
        sa.Column("precio_lista", sa.Float(), nullable=False),
        sa.Column("entrega_inicial", sa.Float(), nullable=False),
        sa.Column("monto_financiado", sa.Float(), nullable=False),
        sa.Column("cuotas", sa.Integer(), nullable=False),
        sa.Column("valor_cuota", sa.Float(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["cliente_id"], ["clientes.id"]),
        sa.ForeignKeyConstraint(["lote_numero"], ["lotes.numero_lote"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_simulaciones_financiamiento_cliente_id"), "simulaciones_financiamiento", ["cliente_id"], unique=False)
    op.create_index(op.f("ix_simulaciones_financiamiento_created_at"), "simulaciones_financiamiento", ["created_at"], unique=False)
    op.create_index(op.f("ix_simulaciones_financiamiento_id"), "simulaciones_financiamiento", ["id"], unique=False)
    op.create_index(op.f("ix_simulaciones_financiamiento_lote_numero"), "simulaciones_financiamiento", ["lote_numero"], unique=False)
    op.create_index(op.f("ix_simulaciones_financiamiento_modalidad"), "simulaciones_financiamiento", ["modalidad"], unique=False)
    op.create_index(op.f("ix_simulaciones_financiamiento_moneda_base"), "simulaciones_financiamiento", ["moneda_base"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_simulaciones_financiamiento_moneda_base"), table_name="simulaciones_financiamiento")
    op.drop_index(op.f("ix_simulaciones_financiamiento_modalidad"), table_name="simulaciones_financiamiento")
    op.drop_index(op.f("ix_simulaciones_financiamiento_lote_numero"), table_name="simulaciones_financiamiento")
    op.drop_index(op.f("ix_simulaciones_financiamiento_id"), table_name="simulaciones_financiamiento")
    op.drop_index(op.f("ix_simulaciones_financiamiento_created_at"), table_name="simulaciones_financiamiento")
    op.drop_index(op.f("ix_simulaciones_financiamiento_cliente_id"), table_name="simulaciones_financiamiento")
    op.drop_table("simulaciones_financiamiento")

    op.drop_index(op.f("ix_lote_imagenes_lote_numero"), table_name="lote_imagenes")
    op.drop_table("lote_imagenes")

    op.drop_index(op.f("ix_lotes_numero_lote"), table_name="lotes")
    op.drop_index(op.f("ix_lotes_manzana"), table_name="lotes")
    op.drop_table("lotes")

    op.drop_index(op.f("ix_clientes_id"), table_name="clientes")
    op.drop_index(op.f("ix_clientes_email"), table_name="clientes")
    op.drop_table("clientes")

    bind = op.get_bind()
    currency_enum.drop(bind, checkfirst=True)
    modality_enum.drop(bind, checkfirst=True)
    estado_lote_enum.drop(bind, checkfirst=True)
