import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  buttonAdd: string = '';

  Breakpoints = Breakpoints;
  readonly breakpoint$ = this.breakpointObserver
    .observe(['(min-width: 1024px)', '(min-width: 768px)', '(max-width: 768px)'])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );

  constructor(private breakpointObserver: BreakpointObserver){}

  ngOnInit() {
    this.breakpoint$.subscribe(() =>
    this.breakpointChanged()
    );
  }

  private breakpointChanged(){
    if (this.breakpointObserver.isMatched('(min-width: 768px)')) {
      this.buttonAdd = '+ Add New Task';
    }
    else if(this.breakpointObserver.isMatched('(max-width:768px)')){
      this.buttonAdd = '';
    }
  }

}
