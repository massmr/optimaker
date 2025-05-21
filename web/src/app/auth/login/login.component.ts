import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  currentYear = new Date().getFullYear();
  
  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.errorMessage = '';
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Logged in successfully');
        localStorage.setItem('token', res.token);
        //this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = 'Email ou mot de passe incorrect.';
        console.error('Error while logging in', err);
      },
      complete: () => console.log('Login flow terminated')
    });
  }
}