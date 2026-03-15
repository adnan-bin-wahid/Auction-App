import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { RegisterRequest } from '../shared/models/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-form">
        <h2>Create Account</h2>

        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label for="name">Full Name:</label>
            <input
              type="text"
              id="name"
              [(ngModel)]="name"
              name="name"
              placeholder="John Doe"
              required
            />
          </div>

          <div class="form-group">
            <label for="email">Email:</label>
            <input
              type="email"
              id="email"
              [(ngModel)]="email"
              name="email"
              placeholder="john@example.com"
              required
            />
          </div>

          <div class="form-group">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div class="form-group checkbox-group">
            <input type="checkbox" id="isAdmin" [(ngModel)]="isAdmin" name="isAdmin" />
            <label for="isAdmin">Register as Admin</label>
          </div>

          <button type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Creating Account...' : 'Register' }}
          </button>
        </form>

        <p class="login-link">Already have an account? <a routerLink="/login">Login here</a></p>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .register-form {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 100%;
        max-width: 400px;
      }

      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 1.5rem;
      }

      .error-message {
        background: #fee;
        color: #c33;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
        text-align: center;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .checkbox-group input[type='checkbox'] {
        width: auto;
      }

      .checkbox-group label {
        margin-bottom: 0;
      }

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
      }

      input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      input:focus {
        outline: none;
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      button {
        width: 100%;
        padding: 0.75rem;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s;
      }

      button:hover:not(:disabled) {
        background: #5568d3;
      }

      button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      .login-link {
        text-align: center;
        margin-top: 1rem;
        color: #666;
      }

      .login-link a {
        color: #667eea;
        text-decoration: none;
      }

      .login-link a:hover {
        text-decoration: underline;
      }
    `,
  ],
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  isAdmin = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    const request: RegisterRequest = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.isAdmin ? 'Admin' : 'User',
    };

    this.authService.register(request).subscribe({
      next: (user: any) => {
        this.authService.setCurrentUser(user);
        this.router.navigate(['/auctions']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        this.isLoading = false;
      },
    });
  }
}
