import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule, FormArray, FormArrayName } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Board } from '../../models/board.model';
@Component({
  selector: 'app-new-board',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './new-board.component.html',
  styleUrl: './new-board.component.scss'
})
export class NewBoardComponent implements OnInit{


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

}
