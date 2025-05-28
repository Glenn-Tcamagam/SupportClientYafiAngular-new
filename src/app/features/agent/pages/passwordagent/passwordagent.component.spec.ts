import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordagentComponent } from './passwordagent.component';

describe('PasswordagentComponent', () => {
  let component: PasswordagentComponent;
  let fixture: ComponentFixture<PasswordagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
