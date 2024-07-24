import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { Task } from '../taskservice/taskinterface';
import { TaskService } from '../taskservice/taskservice';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    DragDropModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
  ],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css',
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  get unassignedTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'UNASINGED');
  }

  get inProgressTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'InProgress');
  }

  get testTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'Tests');
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((task) => task.status === 'Completed');
  }

  constructor(private taskService: TaskService, public dialog: MatDialog) {}

  ngOnInit() {
    this.taskService.tasks$.subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.loadTasks();
  }
  loadTasks() {
    this.taskService.getTasks().subscribe((data) => {
      this.tasks = data;
      console.log(data);
    });
  }

  openEditDialog(task: any): void {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '350px',
      data: {
        taskName: task.taskName,
        description: task.description,
        taskStatus: task.status,
        taskUpdatedAt: task.updatedAt,
        taskCreatedAt: task.createdAt,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskService.editTask(task.taskId, result).subscribe(() => {});
      }
    });
  }

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.taskId !== taskId);
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.tasks, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const task = event.container.data[event.currentIndex];
      task.status = this.getStatusFromDropList(event.container.id);
      this.taskService.updateTask(task).subscribe();
    }
  }
  private getStatusFromDropList(dropListId: string): string {
    switch (dropListId) {
      case 'unassigned':
        return 'UNASINGED';
      case 'inProgress':
        return 'InProgress';
      case 'test':
        return 'Tests';
      case 'completed':
        return 'Completed';
      default:
        return 'UNASSIGNED';
    }
  }
}
