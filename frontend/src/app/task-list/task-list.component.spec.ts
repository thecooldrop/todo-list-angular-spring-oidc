import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListComponent } from './task-list.component';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list item per task', () => {
    fixture.componentInstance.tasks = ["First Task", "Second Task", "Third Task"];
    fixture.detectChanges();
    const nativeElement = fixture.nativeElement as HTMLElement;
    const taskListItems = nativeElement.querySelectorAll('li');
    expect(taskListItems.length).toBe(component.tasks.length);
  });



});
