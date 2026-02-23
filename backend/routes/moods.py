"""Routes for mood tracking endpoints."""

import calendar
from fastapi import APIRouter, Query
from datetime import datetime

from schemas import (
    MoodCreateRequest,
    MoodCreateResponse,
    MoodListResponse,
    MoodResponse,
    CalendarMonthResponse,
)
from models import MoodEntry, MoodDatabase


router = APIRouter()
mood_db = MoodDatabase()


@router.post("/add", response_model=MoodCreateResponse)
def add_mood(data: MoodCreateRequest) -> MoodCreateResponse:
    """
    Create a new mood entry.

    Args:
        data: Mood creation request containing mood, note, and category.

    Returns:
        MoodCreateResponse with status and created entry details.
    """
    mood_entry = MoodEntry(
        mood_id=mood_db.get_next_id(),
        mood=data.mood,
        note=data.note,
        category=data.category,
        timestamp=datetime.now(),
    )

    mood_db.add_entry(mood_entry)

    entry_dict = mood_entry.to_dict()
    return MoodCreateResponse(
        status="added", entry=MoodResponse(**entry_dict)
    )


@router.get("/list", response_model=MoodListResponse)
def list_moods() -> MoodListResponse:
    """
    Retrieve all mood entries sorted by timestamp (newest first).

    Returns:
        MoodListResponse with list of moods and total count.
    """
    entries = mood_db.get_all_entries()
    sorted_entries = sorted(
        entries, key=lambda x: x.timestamp, reverse=True
    )

    mood_responses = []
    for entry in sorted_entries:
        entry_dict = entry.to_dict()
        age_in_seconds = (
            datetime.now() - entry.timestamp
        ).total_seconds()
        mood_responses.append(
            MoodResponse(**entry_dict, age_in_seconds=age_in_seconds)
        )

    return MoodListResponse(moods=mood_responses, count=len(mood_responses))


@router.get("/calendar", response_model=CalendarMonthResponse)
def get_calendar(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
) -> CalendarMonthResponse:
    """
    Retrieve mood entries grouped by day for a specific month.

    Args:
        year: Year to query (2000-2100).
        month: Month to query (1-12).

    Returns:
        CalendarMonthResponse with entries grouped by day.
    """
    total_days = calendar.monthrange(year, month)[1]
    entries = mood_db.get_entries_by_month(year, month)

    days_dict = {}
    for entry in entries:
        day = entry.timestamp.day
        if day not in days_dict:
            days_dict[day] = []

        entry_dict = entry.to_dict()
        age_in_seconds = (
            datetime.now() - entry.timestamp
        ).total_seconds()
        mood_response = MoodResponse(
            **entry_dict, age_in_seconds=age_in_seconds
        )
        days_dict[day].append(mood_response)

    return CalendarMonthResponse(
        year=year, month=month, total_days=total_days, days=days_dict
    )
