import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
