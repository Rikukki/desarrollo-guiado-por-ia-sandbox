"""Database models for mood tracking application."""

from datetime import datetime
from typing import List


class MoodEntry:
    """Represents a mood entry in the database."""

    def __init__(
        self,
        mood_id: int,
        mood: str,
        note: str,
        category: str,
        timestamp: datetime,
    ):
        self.id = mood_id
        self.mood = mood
        self.note = note
        self.category = category
        self.timestamp = timestamp
        self.date_formatted = timestamp.strftime("%Y-%m-%d %H:%M:%S")
        self.day_of_week = timestamp.strftime("%A")
        self.is_weekend = timestamp.weekday() >= 5

    def to_dict(self) -> dict:
        """Convert mood entry to dictionary representation."""
        return {
            "id": self.id,
            "mood": self.mood,
            "note": self.note,
            "category": self.category,
            "timestamp": self.timestamp.isoformat(),
            "date_formatted": self.date_formatted,
            "day_of_week": self.day_of_week,
            "is_weekend": self.is_weekend,
        }


class MoodDatabase:
    """In-memory database for mood entries."""

    def __init__(self):
        self._entries: List[MoodEntry] = []

    def add_entry(self, entry: MoodEntry) -> MoodEntry:
        """Add a new mood entry to the database."""
        self._entries.append(entry)
        return entry

    def get_all_entries(self) -> List[MoodEntry]:
        """Retrieve all mood entries."""
        return self._entries

    def get_next_id(self) -> int:
        """Get the next available ID."""
        return len(self._entries) + 1

    def get_entries_by_month(
        self, year: int, month: int
    ) -> List[MoodEntry]:
        """
        Filter mood entries by year and month.

        Args:
            year: Year to filter by (2000-2100).
            month: Month to filter by (1-12).

        Returns:
            List of MoodEntry sorted by timestamp ascending.
        """
        filtered_entries = [
            entry
            for entry in self._entries
            if entry.timestamp.year == year
            and entry.timestamp.month == month
        ]
        return sorted(
            filtered_entries, key=lambda x: x.timestamp
        )
