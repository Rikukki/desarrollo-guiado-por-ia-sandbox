import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { 
  MoodEntry, 
  MoodCreateRequest, 
  MoodCreateResponse, 
  MoodListResponse,
  CalendarMonthResponse
} from '../models/mood.model';


@Injectable({
  providedIn: 'root'
})
export class MoodService {
  private readonly apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  addMood(request: MoodCreateRequest): Observable<MoodEntry> {
    return this.http
      .post<MoodCreateResponse>(`${this.apiUrl}/add`, request)
      .pipe(
        map(response => response.entry)
      );
  }

  listMoods(): Observable<MoodEntry[]> {
    return this.http
      .get<MoodListResponse>(`${this.apiUrl}/list`)
      .pipe(
        map(response => response.moods)
      );
  }

  getCalendar(year: number, month: number): Observable<CalendarMonthResponse> {
    return this.http.get<CalendarMonthResponse>(
      `${this.apiUrl}/calendar?year=${year}&month=${month}`
    );
  }
}
