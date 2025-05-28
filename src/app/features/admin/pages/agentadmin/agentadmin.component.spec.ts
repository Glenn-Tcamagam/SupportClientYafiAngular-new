import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentadminComponent } from './agentadmin.component';

describe('AgentadminComponent', () => {
  let component: AgentadminComponent;
  let fixture: ComponentFixture<AgentadminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentadminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgentadminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
