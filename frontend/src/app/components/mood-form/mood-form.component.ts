import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MoodCreateRequest } from '../../models/mood.model';


@Component({
  selector: 'app-mood-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mood-form.component.html',
  styleUrls: ['./mood-form.component.css']
})
export class MoodFormComponent {
  @Output() moodSubmitted = new EventEmitter<MoodCreateRequest>();

  readonly categories: string[] = [
    'Trabajo',
    'Personal',
    'Salud',
    'Social',
    'Familia',
    'Ejercicio',
    'Estudio',
    'Ocio',
    'Relaciones',
    'Finanzas'
  ];

  onSubmit(mood: string, note: string, category: string): void {
    if (!mood.trim()) {
      alert('Por favor, ingresa un mood');
      return;
    }

    const request: MoodCreateRequest = {
      mood: mood.trim(),
      note: note.trim(),
      category: category
    };

    this.moodSubmitted.emit(request);
  }
}
