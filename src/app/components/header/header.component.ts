import { Component, inject, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NewTaskComponent } from "../new-task/new-task.component";
import { DeleteBoardComponent } from "../delete-board/delete-board.component";
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';



@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NewTaskComponent, DeleteBoardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  buttonAdd: string = '';
  title: string = '';
  board = signal<Board>({
    name: '',
    columns: []
  })
  isNewTaskModalOpen: boolean = false;
  isOptionsMenuOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  board_service = inject(BoardService);

  Breakpoints = Breakpoints;
  readonly breakpoint$ = this.breakpointObserver
    .observe(['(min-width: 1024px)', '(min-width: 768px)', '(max-width: 768px)'])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );

  constructor(private breakpointObserver: BreakpointObserver,
              private route: ActivatedRoute
  ){
  }

  ngOnInit() {
    this.breakpoint$.subscribe(() =>
    this.breakpointChanged()
    );
    this.board_service.currentBoard$.subscribe(board => {
      this.board.set(board)
      if (board.name.length != 0) {
        this.title = board.name;
      }
      else{
        this.title = 'Platform Launch'
      }
    });
  }

  private breakpointChanged(){
    if (this.breakpointObserver.isMatched('(min-width: 768px)')) {
      this.buttonAdd = '+ Add New Task';
    }
    else if(this.breakpointObserver.isMatched('(max-width:768px)')){
      this.buttonAdd = '';
    }
  }

  openNewTaskModal(){
    this.isNewTaskModalOpen = !this.isNewTaskModalOpen;
  }

  openOptionsMenu(){
    this.isOptionsMenuOpen = !this.isOptionsMenuOpen;
  }

  openDeleteBoardModal(){
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }
}
