import { Component, inject, signal } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';
import { UpperCasePipe } from "@angular/common";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkWithHref, RouterLinkActive } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [UpperCasePipe, RouterLink, RouterLinkWithHref, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  boards = signal<Board[]>([]);
  boards_service = inject(BoardService);
  isShownSidebar: boolean = true;

  ngOnInit(){
    this.boards_service.getBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards)
      }
    })
  }

  toggleSidebar(){
    this.isShownSidebar = !this.isShownSidebar;
  }

}
