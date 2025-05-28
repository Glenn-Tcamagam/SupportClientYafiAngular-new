import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotLayoutComponent } from './chatbot-layout.component';

describe('ChatbotLayoutComponent', () => {
  let component: ChatbotLayoutComponent;
  let fixture: ComponentFixture<ChatbotLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatbotLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
