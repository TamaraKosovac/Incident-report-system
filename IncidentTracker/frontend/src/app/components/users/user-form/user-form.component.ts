import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  model: any = {
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'ADMIN'
  };

  isEdit = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<UserFormComponent>,
    private userService: UserService
  ) {
    if (data?.user) {
      this.isEdit = true;
      this.model = { ...data.user, password: '' }; 
    }
  }

  save() {
    if (this.isEdit) {
      this.userService.updateUser(this.model.id, this.model).subscribe({
        next: () => this.dialogRef.close('refresh'),
        error: (err) => console.error(err)
      });
    } else {
      this.userService.createUser(this.model).subscribe({
        next: () => this.dialogRef.close('refresh'),
        error: (err) => console.error(err)
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}