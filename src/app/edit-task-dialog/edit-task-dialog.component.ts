import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './edit-task-dialog.component.html',
  styleUrl: './edit-task-dialog.component.css',
})
export class EditTaskDialogComponent {
  editTaskForm: FormGroup;
  createdAt: Date | null;
  updatedAt: Date | null;
  noChangesDetected: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {

    this.editTaskForm = this.fb.group({
      taskName: [data.taskName, Validators.required],
      description: [data.description, Validators.required],
    });
    this.createdAt = data.taskCreatedAt ? new Date(data.taskCreatedAt) : null;
    this.updatedAt = data.taskUpdatedAt ? new Date(data.taskUpdatedAt) : null;
  }

  onSave(): void {
    if (this.editTaskForm.valid) {
      const formValue = this.editTaskForm.value;
      if (formValue.taskName === this.data.taskName && formValue.description === this.data.description) {
        this.noChangesDetected = true;
        return;
      }
      this.dialogRef.close(this.editTaskForm.value);
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }
}
