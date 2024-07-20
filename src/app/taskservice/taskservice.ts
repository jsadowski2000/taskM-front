import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {jwtDecode }from 'jwt-decode';
import { Task } from './taskinterface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5099/task';

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
   
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('Not Found Token');
    }

    const decodedToken: any = jwtDecode(token);
    console.log(decodedToken);
    const userId = decodedToken.UserId; 
    
    return this.http.get<Task[]>(`${this.apiUrl}/${userId}`);
  }
}

