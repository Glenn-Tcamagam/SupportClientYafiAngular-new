import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvoiemailComponent } from './envoiemail.component';

describe('EnvoiemailComponent', () => {
  let component: EnvoiemailComponent;
  let fixture: ComponentFixture<EnvoiemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvoiemailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvoiemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
