import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorMapComponent } from './moderator-map.component';

describe('ModeratorMapComponent', () => {
  let component: ModeratorMapComponent;
  let fixture: ComponentFixture<ModeratorMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
