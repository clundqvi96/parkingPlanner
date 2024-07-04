import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.employee.name);
        console.log('Login successful:', response.employee.name);
        this.router.navigate(['booking']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
