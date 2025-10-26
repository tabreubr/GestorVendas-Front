import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.html',
  styleUrls: ['./login-form.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  erroLogin: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.erroLogin = 'E-mail ou senha inválidos.';
      console.error(error);
    }
  }
}
