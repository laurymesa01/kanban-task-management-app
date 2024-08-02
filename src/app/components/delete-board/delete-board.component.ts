import { Component, Input, OnInit, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.scss'
})
export class DeleteBoardComponent implements OnInit{

  @Input() isDeleteModalOpen: boolean = false;
  @Input() board!: Board;

  title: string = '';
  private board_service = inject(BoardService);

  ngOnInit(){
    this.title = this.board.name;
  }

  closeDeleteModal(){
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  deleteBoard(){
    if(this.board.id){
      this.board_service.deleteBoard(this.board.id).subscribe({
        next : () => {
          this.isDeleteModalOpen = !this.isDeleteModalOpen;
        }
      })
    }
  }

}
