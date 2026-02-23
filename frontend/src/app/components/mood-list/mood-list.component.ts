import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoodEntry } from '../../models/mood.model';


@Component({
  selector: 'app-mood-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mood-list.component.html',
  styleUrls: ['./mood-list.component.css']
})
export class MoodListComponent {
  @Input() moods: MoodEntry[] = [];
  @Output() refreshRequested = new EventEmitter<void>();

  onRefresh(): void {
    this.refreshRequested.emit();
  }
}
