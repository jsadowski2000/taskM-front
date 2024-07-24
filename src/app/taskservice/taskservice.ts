import {  Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {jwtDecode }from 'jwt-decode';
import { Task } from './taskinterface';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5099/task';
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  private getUserIdFromToken(): string {
    const token = this.cookieService.get('jwt');
    const decodedToken: any = jwtDecode(token);
    return decodedToken.UserId;
  }

  getTasks(): Observable<Task[]> {
   
    const userId = this.getUserIdFromToken();
    
    return this.http.get<Task[]>(`${this.apiUrl}/${userId}`);
  }

  updateTask(task: Task): Observable<void> {

    const userId = this.getUserIdFromToken();

    return this.http.patch<void>(`${this.apiUrl}/${userId}/${task.taskId}`, {
      status: task.status
    }).pipe(
      tap(() => this.refreshTasks())
    );
  }

  addTask(task: { taskName: string; description: string }): Observable<Task> {

    const userId = this.getUserIdFromToken();

    return this.http.post<Task>(`${this.apiUrl}/${userId}`, task).pipe(
      tap(() => this.refreshTasks())
    );
  }

  deleteTask(taskId: string): Observable<void> {

    const userId = this.getUserIdFromToken();
    return this.http.delete<void>(`${this.apiUrl}/${userId}/${taskId}`).pipe(
      tap(() => this.refreshTasks())
    );;
  }


  editTask(taskId: string, task: { taskName: string, description: string }): Observable<Task> {

    const userId = this.getUserIdFromToken(); 

    return this.http.patch<Task>(`${this.apiUrl}/${userId}/${taskId}`, task).pipe(
      tap(() => this.refreshTasks()) 
    );
  }

  private refreshTasks() {
    const userId = this.getUserIdFromToken();
    this.http.get<Task[]>(`${this.apiUrl}/${userId}`).subscribe(tasks => {
      this.tasksSubject.next(tasks);
    });
  }  
}

