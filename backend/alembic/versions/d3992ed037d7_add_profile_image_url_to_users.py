"""Add profile_image_url to users

Revision ID: d3992ed037d7
Revises: b2339f9bcce8
Create Date: 2026-01-11 11:08:22.281786

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3992ed037d7'
down_revision: Union[str, Sequence[str], None] = 'b2339f9bcce8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('profile_image_url', sa.String(), nullable=True), schema='dev')

def downgrade() -> None:
    op.drop_column('users', 'profile_image_url', schema='dev')
