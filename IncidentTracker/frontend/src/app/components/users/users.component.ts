import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { UserFormComponent } from './user-form/user-form.component';
import { ProfileMessageDialogComponent } from '../../shared/profile-message-dialog/profile-message-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = ['icon', 'username', 'email', 'role', 'actions'];
  dataSource: any[] = [];
  searchTerm: string = '';

  constructor(
    private userService: UserService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (res) => this.dataSource = res,
      error: (err) => console.error(err)
    });
  }

  onEdit(user: any) {
    console.log("EDIT:", user);
  }

  onDelete(id: number) {
    if (!confirm("Delete this user?")) return;

    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
        this.dialog.open(ProfileMessageDialogComponent, {
          width: '400px',
          data: {
            icon: 'delete',
            title: 'User Deleted',
            message: 'The user has been successfully deleted.'
          }
        });
      },
      error: (err) => console.error(err)
    });
  }

  get filteredUsers() {
    if (!this.searchTerm.trim()) {
      return this.dataSource;
    }

    const term = this.searchTerm.toLowerCase().trim();

    return this.dataSource.filter(u =>
      u.username.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term)
    );
  }

  onAddNew() {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '480px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'refresh') {
        this.loadUsers();
        this.dialog.open(ProfileMessageDialogComponent, {
          width: '400px',
          data: {
            icon: 'check_circle',
            title: 'Employee Created',
            message: 'The employee has been successfully added.'
          }
        });
      }
    });
  }
}