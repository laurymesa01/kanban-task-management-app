import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Board } from '../models/board.model';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private http = inject(HttpClient);
  private url = 'http://localhost:3000';

  constructor() { }

  getBoards(){
    return this.http.get<Board[]>(`${this.url}/boards`);
  }

  getBoardByName(name: string){
    const params = new HttpParams().set('name', name);
    return this.http.get<Board[]>(`${this.url}`, { params });
  }
}
