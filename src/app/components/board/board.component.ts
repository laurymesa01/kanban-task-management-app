import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';
import { UpperCasePipe, CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { TaskComponent } from '../task/task.component';



@Component({
  selector: 'app-board',
  standalone: true,
  imports: [UpperCasePipe, CommonModule, TaskComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})
export class BoardComponent implements OnInit{

  @Input() name: string = '';

  board = signal<Board>({
    name: '',
    columns: []
  })
  private board_service = inject(BoardService);
  counter: number = 0;
  isModalTaskOpen: boolean = false;
  taskName: string = '';
  columnName: string = '';

  constructor(private route: ActivatedRoute){ }

  ngOnInit(){
    this.route.params.pipe(
      switchMap( ( {name} ) => {
        if (!name) {
          return this.board_service.getBoardByName('Platform Launch')
        }
        else{
          return this.board_service.getBoardByName(name)
        }
      })
    )
    .subscribe({
      next: (board: Board[]) => {
        this.board.set(board[0])
      }
    })
  }

  getColorForTasks(name: string){
    let color = '';
    switch (name) {
      case 'Todo':
        color = '#49C4E5';
        break;
      case 'Doing':
        color = '#8471F2';
        break;
      case 'Done':
        color = '#67E2AE';
        break;
      default:
        break;
    }
    return color;
  }

  toggleModalTasks(title: string, columnName: string){
    this.isModalTaskOpen = !this.isModalTaskOpen;
    this.taskName = title;
    this.columnName = columnName;
  }
}
