import { db } from '../config/firebase.js';
import { ChatMessage, ChatConversation, ChatResponse } from '../models/chatbot.js';
import { AppError } from '../middleware/errorHandler.js';
import { v4 as uuidv4 } from 'uuid';

export class ChatbotService {
  async createConversation(userId: string): Promise<ChatConversation> {
    const conversationId = uuidv4();
    const conversation: ChatConversation = {
      id: conversationId,
      userId,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection('conversations').doc(conversationId).set(conversation);
    return conversation;
  }

  async getConversation(conversationId: string): Promise<ChatConversation | null> {
    const doc = await db.collection('conversations').doc(conversationId).get();
    return doc.exists ? (doc.data() as ChatConversation) : null;
  }

  async getUserConversations(userId: string): Promise<ChatConversation[]> {
    const snapshot = await db
      .collection('conversations')
      .where('userId', '==', userId)
      .where('archived', '!=', true)
      .orderBy('updatedAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => doc.data() as ChatConversation);
  }

  async addMessage(conversationId: string, message: ChatMessage): Promise<ChatConversation> {
    const conversation = await this.getConversation(conversationId);

    if (!conversation) {
      throw new AppError(404, 'Conversation not found');
    }

    const updatedMessages = [...conversation.messages, message];

    await db.collection('conversations').doc(conversationId).update({
      messages: updatedMessages,
      updatedAt: new Date(),
    });

    return {
      ...conversation,
      messages: updatedMessages,
      updatedAt: new Date(),
    };
  }

  async saveMessage(userId: string, conversationId: string, userMessage: string, botResponse: string): Promise<ChatResponse> {
    const messageId = uuidv4();
    const timestamp = new Date();

    const message: ChatMessage = {
      id: messageId,
      userId,
      message: userMessage,
      response: botResponse,
      timestamp,
    };

    let conversation = await this.getConversation(conversationId);

    if (!conversation) {
      conversation = await this.createConversation(userId);
    }

    await this.addMessage(conversation.id, message);

    return {
      response: botResponse,
      messageId,
      timestamp,
    };
  }

  async archiveConversation(conversationId: string): Promise<ChatConversation> {
    const conversation = await this.getConversation(conversationId);

    if (!conversation) {
      throw new AppError(404, 'Conversation not found');
    }

    await db.collection('conversations').doc(conversationId).update({
      archived: true,
      updatedAt: new Date(),
    });

    return {
      ...conversation,
      archived: true,
      updatedAt: new Date(),
    };
  }

  async generateChatbotResponse(userMessage: string): Promise<string> {
    // This is a placeholder for chatbot logic
    // In production, integrate with your preferred NLP/AI service
    const responses: Record<string, string[]> = {
      greeting: [
        'Hello! Welcome to Pavithra Travels. How can I help you today?',
        'Hi there! Looking for your next adventure?',
      ],
      booking: [
        'I can help you with booking a trip! Which destination interests you?',
        'Sure! Would you like to explore our temple tours, family trips, or adventure packages?',
      ],
      default: [
        'That\'s interesting! Would you like to know more about our destinations?',
        'Let me help you find the perfect trip.',
      ],
    };

    const lowerMessage = userMessage.toLowerCase();
    let category = 'default';

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      category = 'greeting';
    } else if (lowerMessage.includes('book') || lowerMessage.includes('trip')) {
      category = 'booking';
    }

    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
  }
}

export const chatbotService = new ChatbotService();
