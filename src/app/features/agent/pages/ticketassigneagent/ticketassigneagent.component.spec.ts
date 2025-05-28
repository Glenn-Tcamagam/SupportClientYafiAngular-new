import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketassigneagentComponent } from './ticketassigneagent.component';

describe('TicketassigneagentComponent', () => {
  let component: TicketassigneagentComponent;
  let fixture: ComponentFixture<TicketassigneagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketassigneagentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketassigneagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
