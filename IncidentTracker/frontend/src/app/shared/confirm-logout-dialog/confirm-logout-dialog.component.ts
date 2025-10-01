import { Component, inject } from '@angular/core'; 
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-confirm-logout-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './confirm-logout-dialog.component.html',
  styleUrls: ['./confirm-logout-dialog.component.css']
})
export class ConfirmLogoutDialogComponent {
  private ref = inject(MatDialogRef<ConfirmLogoutDialogComponent>);
  close(result: boolean) { 
    this.ref.close(result); 
  }
}