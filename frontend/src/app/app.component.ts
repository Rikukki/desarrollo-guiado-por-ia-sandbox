import { Component, OnInit } from '@angular/core';

import { MoodService } from './services/mood.service';
import { MoodFormComponent } from './components/mood-form/mood-form.component';
import { MoodListComponent } from './components/mood-list/mood-list.component';
import { MoodCalendarComponent } from './components/mood-calendar/mood-calendar.component';
import { MoodEntry, MoodCreateRequest } from './models/mood.model';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MoodFormComponent, MoodListComponent, MoodCalendarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  moods: MoodEntry[] = [];
  calendarMoods: MoodEntry[] = [];
  calendarYear: number = new Date().getFullYear();
  calendarMonth: number = new Date().getMonth() + 1;
  calendarTotalDays: number = 0;

  constructor(private moodService: MoodService) {}

  ngOnInit(): void {
    this.loadMoods();
    this.loadCalendar();
  }

  onMoodSubmitted(request: MoodCreateRequest): void {
    this.moodService.addMood(request).subscribe({
      next: (entry: MoodEntry) => {
        console.log('Mood guardado:', entry);
        this.loadMoods();
        this.loadCalendar();
      },
      error: (error: unknown) => {
        console.error('Error al guardar mood:', error);
        alert('ERROR AL GUARDAR!');
      }
    });
  }

  onRefreshRequested(): void {
    this.loadMoods();
  }

  private loadMoods(): void {
    this.moodService.listMoods().subscribe({
      next: (moods: MoodEntry[]) => {
        this.moods = moods;
        console.log('Moods cargados:', this.moods);
      },
      error: (error: unknown) => {
        console.error('Error al cargar moods:', error);
        this.moods = [];
      }
    });
  }

  private loadCalendar(): void {
    this.moodService.getCalendar(this.calendarYear, this.calendarMonth).subscribe({
      next: (response) => {
        this.calendarTotalDays = response.total_days;
        const moodsList: MoodEntry[] = [];
        Object.values(response.days).forEach(moods => {
          moodsList.push(...moods);
        });
        this.calendarMoods = moodsList;
        console.log('Calendario cargado:', response);
      },
      error: (error: unknown) => {
        console.error('Error al cargar calendario:', error);
        this.calendarMoods = [];
        this.calendarTotalDays = 0;
      }
    });
  }
}
