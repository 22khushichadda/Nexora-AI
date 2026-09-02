"""add user authentication

Revision ID: f2e3d4c5b6a7
Revises: e1f2a3b4c5d6
Create Date: 2026-09-02 21:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f2e3d4c5b6a7'
down_revision: Union[str, Sequence[str], None] = 'e1f2a3b4c5d6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    op.add_column('workspace_members', sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True))
    op.add_column('documents', sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True))
    op.add_column('conversations', sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True))
    op.add_column('bookmarks', sa.Column('user_id', sa.Integer(), sa.ForeignKey('users.id'), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('bookmarks', 'user_id')
    op.drop_column('conversations', 'user_id')
    op.drop_column('documents', 'user_id')
    op.drop_column('workspace_members', 'user_id')
    op.drop_index(op.f('ix_users_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
