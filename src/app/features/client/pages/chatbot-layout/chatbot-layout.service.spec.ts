import { TestBed } from '@angular/core/testing';

import { ChatbotLayoutService } from './chatbot-layout.service';

describe('ChatbotLayoutService', () => {
  let service: ChatbotLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
