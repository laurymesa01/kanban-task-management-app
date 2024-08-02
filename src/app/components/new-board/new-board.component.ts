import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { BoardService } from '../../services/board.service';
@Component({
  selector: 'app-new-board',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-board.component.html',
  styleUrl: './new-board.component.scss'
})
export class NewBoardComponent implements OnInit{

  @Input() isNewBoardModalOpen: boolean = true;

  board_service = inject(BoardService);

  boardFormGroup: FormGroup = this._formBuilder.group({
    name: new FormControl("", [Validators.required, Validators.minLength(1)]),
    columns: this._formBuilder.array([])
  })

  constructor(private _formBuilder: FormBuilder){
    const column = this._formBuilder.group({
      name: new FormControl("Todo"),
      tasks: new FormControl([]),
    });
    const column2 = this._formBuilder.group({
      name: new FormControl("Doing"),
      tasks: new FormControl([]),
    });
    this.columns().push(column);
    this.columns().push(column2);
  }

  ngOnInit(){
  }

  columns():FormArray{
    return this.boardFormGroup.get('columns') as FormArray;
  }

  addColumn(){
    const column = this._formBuilder.group({
      name: new FormControl(""),
      tasks: new FormControl([]),
    })
    this.columns().push(column)
  }

  deleteColumn(index: number){
    this.columns().removeAt(index);
  }

  createBoard(){
    if (this.boardFormGroup.valid) {
      this.board_service.createNewBoard(this.boardFormGroup.value).subscribe({
        next: () => {
          this.isNewBoardModalOpen = !this.isNewBoardModalOpen;
        }
      })
    }
  }

}
