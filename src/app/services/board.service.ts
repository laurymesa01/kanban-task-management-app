import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Board } from '../models/board.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private http = inject(HttpClient);
  private url = 'http://localhost:3000';

  private name = new BehaviorSubject<string>('');
  public currentName$ = this.name.asObservable();


  constructor() { }

  getBoards(){
    return this.http.get<Board[]>(`${this.url}/boards`);
  }

  getBoardByName(name: string){
    const params = new HttpParams().set('name', name);
    return this.http.get<Board[]>(`${this.url}/boards`, { params });
  }

  deleteBoard(){
    return this.http.delete(this.url);
  }

  getBoardName(name: string){
    this.name.next(name);
  }

  // sendBoardName(){
  //   return this.currentName$;
  // }
}
