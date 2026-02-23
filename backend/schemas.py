"""Pydantic schemas for request/response validation."""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Dict


class MoodCreateRequest(BaseModel):
    """Schema for creating a new mood entry."""

    mood: str = Field(..., min_length=1, description="Current mood status")
    note: str = Field(default="", description="Optional note about the mood")
    category: str = Field(
        default="", description="Optional category for the mood"
    )


class MoodResponse(BaseModel):
    """Schema for mood entry response."""

    id: int
    mood: str
    note: str
    category: str
    timestamp: str
    date_formatted: str
    day_of_week: str
    is_weekend: bool
    age_in_seconds: float | None = None


class MoodCreateResponse(BaseModel):
    """Schema for mood creation response."""

    status: str
    entry: MoodResponse


class MoodListResponse(BaseModel):
    """Schema for mood list response."""

    moods: List[MoodResponse]
    count: int


class CalendarMonthResponse(BaseModel):
    """Schema for calendar month response."""

    year: int = Field(..., ge=2000, le=2100)
    month: int = Field(..., ge=1, le=12)
    total_days: int = Field(..., ge=28, le=31)
    days: Dict[int, List[MoodResponse]]
