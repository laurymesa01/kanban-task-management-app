import { Component, Input, OnInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { BoardService } from '../../services/board.service';
import { Board } from '../../models/board.model';
@Component({
  selector: 'app-new-board',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-board.component.html',
  styleUrl: './new-board.component.scss'
})
export class NewBoardComponent implements OnInit{

  @Input() isNewBoardModalOpen: boolean = true;
  @Input() isEditBoardModalOpen: boolean = true;
  @Input() board!: Board;

  board_service = inject(BoardService);

  boardFormGroup: FormGroup = this._formBuilder.group({
    name: new FormControl("", [Validators.required, Validators.minLength(1)]),
    columns: this._formBuilder.array([])
  })

  constructor(private _formBuilder: FormBuilder){
  }

  ngOnInit(){
    console.log(this.board);
    if (this.board) {
      this.boardFormGroup.patchValue({
        name: this.board.name
      })
      this.setColumns();
    }
    else{
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

  setColumns(){
    let control = <FormArray>this.boardFormGroup.get('columns');
    this.board.columns.forEach(c => {
      control.push(this._formBuilder.group(c))
    })
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
