import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordadminComponent } from './passwordadmin.component';

describe('PasswordadminComponent', () => {
  let component: PasswordadminComponent;
  let fixture: ComponentFixture<PasswordadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
