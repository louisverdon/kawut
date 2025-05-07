import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Question } from '../../models/game.models';

@Component({
  selector: 'app-question',
  template: `
    <div class="question-container">
      <h2 class="question-text">{{ question.text }}</h2>

      <div *ngIf="!question.isNumeric" class="options-grid">
        <button
          *ngFor="let option of question.options"
          class="option-btn"
          [class.selected]="selectedAnswer === option"
          (click)="selectAnswer(option)"
        >
          {{ option }}
        </button>
      </div>

      <div *ngIf="question.isNumeric" class="numeric-input">
        <input
          type="number"
          [(ngModel)]="numericAnswer"
          placeholder="Enter your answer"
          (keyup.enter)="submitNumericAnswer()"
        >
        <button
          class="submit-btn"
          [disabled]="!numericAnswer"
          (click)="submitNumericAnswer()"
        >
          Submit
        </button>
      </div>
    </div>
  `,
  styles: [`
    .question-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .question-text {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .option-btn {
      padding: 1rem;
      font-size: 1.2rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      background-color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-btn:hover {
      border-color: #2196F3;
      background-color: #f5f9ff;
    }

    .option-btn.selected {
      border-color: #2196F3;
      background-color: #2196F3;
      color: white;
    }

    .numeric-input {
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-bottom: 2rem;
    }

    input[type="number"] {
      padding: 0.75rem;
      font-size: 1.2rem;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      width: 200px;
    }

    input[type="number"]:focus {
      outline: none;
      border-color: #2196F3;
    }

    .submit-btn {
      padding: 0.75rem 1.5rem;
      font-size: 1.2rem;
      border: none;
      border-radius: 8px;
      background-color: #2196F3;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .submit-btn:hover {
      background-color: #1976D2;
    }

    .submit-btn:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class QuestionComponent {
  @Input() question!: Question;
  @Output() answerSelected = new EventEmitter<string | number>();

  selectedAnswer: string | null = null;
  numericAnswer: number | null = null;

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
    this.answerSelected.emit(answer);
  }

  submitNumericAnswer() {
    if (this.numericAnswer !== null) {
      this.answerSelected.emit(this.numericAnswer);
    }
  }
} 