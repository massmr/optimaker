import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-type-selection',
  imports: [ CommonModule ],
  templateUrl: './user-type-selection.component.html',
  styleUrl: './user-type-selection.component.css'
})
export class UserTypeSelectionComponent {
 constructor(private router: Router) {}

  selectStudent() {
    this.router.navigate(['/auth/login']);
  }

  selectProjectOwner() {
    this.router.navigate(['/auth/register']);
  }
}
