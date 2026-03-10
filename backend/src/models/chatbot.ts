export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  metadata?: {
    type?: 'user' | 'bot';
    intent?: string;
    confidence?: number;
  };
}

export interface ChatConversation {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  archived?: boolean;
}

export interface ChatRequest {
  message: string;
  conversationId?: string;
}

export interface ChatResponse {
  response: string;
  messageId: string;
  timestamp: Date;
  suggestions?: string[];
}
