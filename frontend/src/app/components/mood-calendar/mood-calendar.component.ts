import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoodEntry, CalendarDay } from '../../models/mood.model';

const DAYS_OF_WEEK = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

@Component({
  selector: 'app-mood-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mood-calendar.component.html',
  styleUrls: ['./mood-calendar.component.css']
})
export class MoodCalendarComponent implements OnChanges {
  @Input() moods: MoodEntry[] = [];
  @Input() year: number = new Date().getFullYear();
  @Input() month: number = new Date().getMonth() + 1;
  @Input() totalDays: number = 0;

  calendarWeeks: CalendarDay[][] = [];
  daysOfWeek = DAYS_OF_WEEK;
  monthName: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['moods'] || changes['year'] || changes['month'] || changes['totalDays']) {
      this.buildCalendarGrid();
      this.monthName = MONTH_NAMES[this.month - 1];
    }
  }

  private buildCalendarGrid(): void {
    const firstDay = new Date(this.year, this.month - 1, 1);
    const dayOfWeekStart = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const todayYear = today.getFullYear();

    const allDays: CalendarDay[] = [];

    // Días del mes anterior
    const prevMonthDays = dayOfWeekStart;
    const prevMonth = this.month === 1 ? 12 : this.month - 1;
    const prevMonthYear = this.month === 1 ? this.year - 1 : this.year;
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth, 0).getDate();

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      allDays.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: false,
        moods: []
      });
    }

    // Días del mes actual
    for (let day = 1; day <= this.totalDays; day++) {
      const dayOfWeek = (dayOfWeekStart + day - 1) % 7;
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6;
      const isToday = day === todayDate && this.month === todayMonth && this.year === todayYear;

      const dayMoods = this.getMoodsForDay(day);

      allDays.push({
        day,
        isCurrentMonth: true,
        isToday,
        isWeekend,
        moods: dayMoods
      });
    }

    // Días del siguiente mes
    const remainingDays = 42 - allDays.length;
    for (let day = 1; day <= remainingDays; day++) {
      allDays.push({
        day,
        isCurrentMonth: false,
        isToday: false,
        isWeekend: false,
        moods: []
      });
    }

    // Agrupar en semanas
    this.calendarWeeks = [];
    for (let i = 0; i < allDays.length; i += 7) {
      this.calendarWeeks.push(allDays.slice(i, i + 7));
    }
  }

  private getMoodsForDay(day: number): MoodEntry[] {
    return this.moods.filter(mood => {
      const moodDate = new Date(mood.timestamp);
      const moodYear = moodDate.getUTCFullYear();
      const moodMonth = moodDate.getUTCMonth() + 1;
      const moodDay = moodDate.getUTCDate();
      
      return moodDay === day &&
             moodMonth === this.month &&
             moodYear === this.year;
    });
  }

  getDisplayMood(day: CalendarDay): string {
    if (day.moods.length === 0) {
      return '';
    }
    return day.moods[day.moods.length - 1].mood;
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['mood-calendar__day'];

    if (day.isToday) {
      classes.push('mood-calendar__day--today');
    }
    if (day.moods.length > 0) {
      classes.push('mood-calendar__day--has-mood');
    }
    if (!day.isCurrentMonth) {
      classes.push('mood-calendar__day--outside');
    }
    if (day.isWeekend) {
      classes.push('mood-calendar__day--weekend');
    }

    return classes.join(' ');
  }
}
