import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setToken(response.token);

        const role = this.authService.getRole(); 

        if (role === 'MODERATOR') {
          this.router.navigate(['/moderator-map']);
        } else if (role === 'USER') {
          this.router.navigate(['/report']);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/admin']); 
        } else {
          this.router.navigate(['/']); 
        }
      },
      error: () => {
        this.errorMessage = 'Wrong username or password!';
      }
    });
  }
}