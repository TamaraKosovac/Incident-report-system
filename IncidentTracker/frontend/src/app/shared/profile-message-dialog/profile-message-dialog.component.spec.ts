import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileMessageDialogComponent } from './profile-message-dialog.component';

describe('ProfileMessageDialogComponent', () => {
  let component: ProfileMessageDialogComponent;
  let fixture: ComponentFixture<ProfileMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileMessageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
