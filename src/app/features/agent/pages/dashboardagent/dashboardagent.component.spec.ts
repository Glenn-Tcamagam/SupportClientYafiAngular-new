import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardagentComponent } from './dashboardagent.component';

describe('DashboardagentComponent', () => {
  let component: DashboardagentComponent;
  let fixture: ComponentFixture<DashboardagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
