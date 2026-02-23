export interface MoodEntry {
  id: number;
  mood: string;
  note: string;
  category: string;
  timestamp: string;
  date_formatted: string;
  day_of_week: string;
  is_weekend: boolean;
  age_in_seconds?: number;
}

export interface MoodCreateRequest {
  mood: string;
  note: string;
  category: string;
}

export interface MoodCreateResponse {
  status: string;
  entry: MoodEntry;
}

export interface MoodListResponse {
  moods: MoodEntry[];
  count: number;
}

export interface CalendarMonthResponse {
  year: number;
  month: number;
  total_days: number;
  days: Record<number, MoodEntry[]>;
}

export interface CalendarDay {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  moods: MoodEntry[];
}
