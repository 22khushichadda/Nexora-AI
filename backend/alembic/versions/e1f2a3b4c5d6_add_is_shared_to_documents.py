"""add is_shared to documents

Revision ID: e1f2a3b4c5d6
Revises: 0f448c2e4999
Create Date: 2026-09-02 20:29:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e1f2a3b4c5d6'
down_revision: Union[str, Sequence[str], None] = '0f448c2e4999'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('documents', sa.Column('is_shared', sa.Boolean(), server_default='true', nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('documents', 'is_shared')
