from typing import Optional, List
from xxlimited import Str
from pydantic import BaseModel, Field
from datetime import datetime


class contactUsSchema(BaseModel):
    full_name: str
    email: str
    have_account: bool
    description: str
