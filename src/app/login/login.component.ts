import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Adjust the path as necessary

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // make the variables from the html input fields
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (response) => {
        // set the session data here
        localStorage.setItem('token', response.employee.name);

        console.log('Login successful:', response.employee.name);

        // redirect to the booking page
        this.router.navigate(['booking']);
      },
      error: (error) => {
        // Handle login error here
        console.error('Login failed:', error);
      }
    });
  }
}
