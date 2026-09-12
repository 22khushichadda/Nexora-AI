"""unique workspace members and duplicate cleanup

Revision ID: a1b2c3d4e5f6
Revises: f2e3d4c5b6a7
Create Date: 2026-09-12 20:50:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = 'f2e3d4c5b6a7'
branch_labels = None
depends_on = None


def upgrade() -> None:
    bind = op.get_bind()

    # 1. Delete duplicate non-Owner membership rows when an Owner row exists for the same workspace
    bind.execute(sa.text("""
        DELETE FROM workspace_members
        WHERE id IN (
            SELECT m1.id
            FROM workspace_members m1
            JOIN workspace_members m2 ON m1.workspace_id = m2.workspace_id 
                                     AND m1.id != m2.id
            WHERE LOWER(m2.role) = 'owner' 
              AND LOWER(m1.role) != 'owner'
              AND (LOWER(m1.email) = LOWER(m2.email) OR (m1.user_id IS NOT NULL AND m1.user_id = m2.user_id))
        )
    """))

    # 2. Delete remaining duplicate rows keeping the record with the highest priority role and smallest ID
    bind.execute(sa.text("""
        DELETE FROM workspace_members
        WHERE id IN (
            SELECT id FROM (
                SELECT id,
                       ROW_NUMBER() OVER (
                           PARTITION BY user_id, workspace_id 
                           ORDER BY CASE WHEN LOWER(role) = 'owner' THEN 1 WHEN LOWER(role) = 'admin' THEN 2 ELSE 3 END, id ASC
                       ) as rnum
                FROM workspace_members
                WHERE user_id IS NOT NULL
            ) t
            WHERE t.rnum > 1
        )
    """))

    # 3. Add database-level UNIQUE constraint on (user_id, workspace_id)
    op.create_unique_constraint(
        "uq_user_workspace_member",
        "workspace_members",
        ["user_id", "workspace_id"]
    )


def downgrade() -> None:
    op.drop_constraint(
        "uq_user_workspace_member",
        "workspace_members",
        type_="unique"
    )
