from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Literal


# Task schemas
class TaskCreate(BaseModel):

    title: str = Field(
        ...,
        min_length=3,
        max_length=100
    )

    description: Optional[str] = None

    status: Literal[
        "Pending",
        "In Progress",
        "Completed"
    ] = "Pending"

    priority: Literal[
        "Low",
        "Medium",
        "High"
    ] = "Medium"


class TaskResponse(BaseModel):

    id: int
    title: str
    description: Optional[str] = None
    status: str
    priority: str

    model_config = ConfigDict(from_attributes=True)


# User registration schema
class UserCreate(BaseModel):

    username: str = Field(
        ...,
        min_length=3,
        max_length=50
    )

    email: str

    password: str = Field(
        ...,
        min_length=8
    )


# User response schema
class UserResponse(BaseModel):

    id: int
    username: str
    email: str

    model_config = ConfigDict(from_attributes=True)


# JWT token schema
class Token(BaseModel):

    access_token: str
    token_type: str
