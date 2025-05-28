import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterclientComponent } from './footerclient.component';

describe('FooterclientComponent', () => {
  let component: FooterclientComponent;
  let fixture: ComponentFixture<FooterclientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterclientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooterclientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
