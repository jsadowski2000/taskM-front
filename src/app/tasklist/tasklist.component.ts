import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../taskservice/taskinterface';
import { TaskService } from '../taskservice/taskservice';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [NavbarComponent,CommonModule, DragDropModule,],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getTasks().subscribe((data: any) => {
      this.tasks = data;
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if(event.previousContainer === event.container) {
    moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
  } else{
    transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex

      )
  }
}
}
