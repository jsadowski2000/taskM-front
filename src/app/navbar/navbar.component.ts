import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog } from '@angular/material/dialog';
import { TaskService } from '../taskservice/taskservice';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule,
    MatButtonModule,TaskDialogComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router, private cookieService: CookieService, private dialog: MatDialog,private taskService: TaskService, private http: HttpClient){}

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '250px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result).subscribe(task => {
          console.log('Task added:', task);
        });
      }
    });
  }

  async logout(): Promise<void> {

    return this.http.post<void>(`http://localhost:5099/auth/token/revoke`, {})
    .pipe(
      tap(() =>{ this.cookieService.deleteAll(); this.router.navigateByUrl('/')})
    ).toPromise();
  }

}
