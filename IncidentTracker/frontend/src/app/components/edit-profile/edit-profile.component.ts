import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ProfileMessageDialogComponent } from '../../shared/profile-message-dialog/profile-message-dialog.component';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {

  model: any = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''  
  };

  hide = true;

  message = '';
  errorMessage = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        this.model = {
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: ''
        };
      },
      error: () => {
        this.dialog.open(ProfileMessageDialogComponent, {
          data: {
            icon: 'error',
            title: 'Error',
            message: 'Failed to load user profile.'
          }
        });
      }
    });
  }

  updateProfile() {
    this.userService.updateProfile(this.model).subscribe({
      next: () => {
        this.dialog.open(ProfileMessageDialogComponent, {
          data: {
            icon: 'check_circle',
            title: 'Success',
            message: 'Profile updated successfully!'
          }
        });
      },
      error: () => {
        this.dialog.open(ProfileMessageDialogComponent, {
          data: {
            icon: 'error',
            title: 'Error',
            message: 'Failed to update the profile.'
          }
        });
      }
    });
  }
}