import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyIncidentsComponent } from './my-incidents.component';

describe('MyIncidentsComponent', () => {
  let component: MyIncidentsComponent;
  let fixture: ComponentFixture<MyIncidentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyIncidentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyIncidentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
