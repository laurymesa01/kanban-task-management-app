import { Component, Input, OnInit, signal } from '@angular/core';
import { Board, Status, Task } from '../../models/board.model';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})
export class TaskComponent implements OnInit{

  @Input() board!: Board;
  @Input() taskTitle: string = '';
  @Input() columnName: string = '';


  task = signal<Task>({
    title: '',
    description: '',
    status: Status.Doing,
    subtasks: []
  })
  subtasksCompleted: number = 0;
  isMenuOpen: boolean = false;
  isDropdownOpen: boolean = false;


  ngOnInit() {
    this.getTaskByName();
    this.getAmountOfSubtasksCompleted();
  }

  getTaskByName(){
    const column =  this.board.columns.filter(column => column.name === this.columnName)
    this.task.set(column[0].tasks.filter(task => task.title === this.taskTitle)[0]) ;
  }

  getAmountOfSubtasksCompleted(){
    this.task().subtasks.map(subtask => {
      if (subtask.isCompleted) {
        this.subtasksCompleted ++;
      }
    })
  }

  toggleMenu(){
    this.isMenuOpen = !this.isMenuOpen;
  }

  openDropdown(){
    this.isDropdownOpen = !this.isDropdownOpen;
  }

}
