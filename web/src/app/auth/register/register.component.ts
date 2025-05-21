import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'project_owner';
  errorMessage = '';
  currentYear = new Date().getFullYear();
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.authService.register(this.email, this.password, this.role).subscribe({
      next: (res) => {
        console.log('Registered successfully');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = `Erreur lors de l'inscription`;
        console.error('Error while logging in', err);
      },
      complete: () => console.log('Register flow terminated')
    });
  }
}