import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private http = inject(HttpClient);
  private url = 'http://localhost:3000';

  constructor() { }

  getTaskByName(){

  }
}
