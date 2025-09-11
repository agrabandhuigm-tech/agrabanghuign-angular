import { TestBed } from '@angular/core/testing';

import { ChatbotFaqService } from './chatbot-faq.service';

describe('ChatbotFaqService', () => {
  let service: ChatbotFaqService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotFaqService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
