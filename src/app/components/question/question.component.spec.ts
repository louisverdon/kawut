import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { QuestionComponent } from './question.component';
import { Question } from '../../models/game.models';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  const mockMultipleChoiceQuestion: Question = {
    id: 'q1',
    text: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    isNumeric: false
  };

  const mockNumericQuestion: Question = {
    id: 'q2',
    text: 'What is 2 + 2?',
    isNumeric: true
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuestionComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display multiple choice options for non-numeric questions', () => {
    component.question = mockMultipleChoiceQuestion;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const options = compiled.querySelectorAll('.option-btn');
    expect(options.length).toBe(4);
    expect(options[0].textContent).toContain('London');
    expect(options[1].textContent).toContain('Berlin');
    expect(options[2].textContent).toContain('Paris');
    expect(options[3].textContent).toContain('Madrid');
  });

  it('should display numeric input for numeric questions', () => {
    component.question = mockNumericQuestion;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('input[type="number"]');
    const submitButton = compiled.querySelector('.submit-btn');
    expect(input).toBeTruthy();
    expect(submitButton).toBeTruthy();
  });

  it('should emit selected answer for multiple choice questions', () => {
    component.question = mockMultipleChoiceQuestion;
    fixture.detectChanges();

    spyOn(component.answerSelected, 'emit');
    const compiled = fixture.nativeElement;
    const options = compiled.querySelectorAll('.option-btn');
    options[2].click();

    expect(component.selectedAnswer).toBe('Paris');
    expect(component.answerSelected.emit).toHaveBeenCalledWith('Paris');
  });

  it('should emit numeric answer when submitted', () => {
    component.question = mockNumericQuestion;
    fixture.detectChanges();

    spyOn(component.answerSelected, 'emit');
    component.numericAnswer = 4;
    component.submitNumericAnswer();

    expect(component.answerSelected.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit numeric answer when null', () => {
    component.question = mockNumericQuestion;
    fixture.detectChanges();

    spyOn(component.answerSelected, 'emit');
    component.numericAnswer = null;
    component.submitNumericAnswer();

    expect(component.answerSelected.emit).not.toHaveBeenCalled();
  });
}); 