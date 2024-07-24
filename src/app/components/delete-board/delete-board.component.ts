import { Component, Input, inject } from '@angular/core';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.scss'
})
export class DeleteBoardComponent {

  @Input() isDeleteModalOpen: boolean = false;

  private board_service = inject(BoardService);

  closeDeleteModal(){
    this.isDeleteModalOpen = !this.isDeleteModalOpen;
  }

  deleteBoard(){

  }

}
