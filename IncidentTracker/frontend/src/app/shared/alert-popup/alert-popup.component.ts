import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert-popup',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public alerts: any[]) {}

  ngOnInit(): void {}
}