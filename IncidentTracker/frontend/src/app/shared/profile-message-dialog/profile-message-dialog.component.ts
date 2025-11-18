import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-message-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './profile-message-dialog.component.html',
  styleUrls: ['./profile-message-dialog.component.css']
})
export class ProfileMessageDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ProfileMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { icon: string; title: string; message: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}