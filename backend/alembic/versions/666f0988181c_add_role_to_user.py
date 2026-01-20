"""Add role to user

Revision ID: 666f0988181c
Revises: d3992ed037d7
Create Date: 2026-01-11 12:07:04.537353

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '666f0988181c'
down_revision: Union[str, Sequence[str], None] = 'd3992ed037d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('users', sa.Column('role', sa.String(), server_default='user', nullable=True), schema='dev')


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('users', 'role', schema='dev')
