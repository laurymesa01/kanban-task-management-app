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

  private board = new BehaviorSubject<Board>({
    name: '',
    columns: []
  });
  public currentBoard$ = this.board.asObservable();


  constructor() { }

  getBoards(){
    return this.http.get<Board[]>(`${this.url}/boards`);
  }

  getBoardByName(name: string){
    const params = new HttpParams().set('name', name);
    return this.http.get<Board[]>(`${this.url}/boards`, { params });
  }

  createNewBoard(board: Board){
    return this.http.post(`${this.url}/boards`, board);
  }

  deleteBoard(id: number){
    return this.http.delete(`${this.url}/boards/${id}`);
  }

  sendBoard(board: Board){
    this.board.next(board);
  }

  // sendBoardName(){
  //   return this.currentName$;
  // }
}
