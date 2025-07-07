import { apiRequest } from './queryClient';

// Message interface
export interface Message {
  id?: number;
  username: string;
  content: string;
  isUser: boolean;
  domain?: string;
  timestamp?: Date;
}

// API response interface for message creation
export interface MessageResponse {
  userMessage: Message;
  aiMessage?: Message;
  error?: string;
}

// Function to send a message and get AI response
export async function sendMessage(message: Omit<Message, 'id' | 'timestamp'>): Promise<MessageResponse> {
  try {
    const response = await apiRequest('POST', '/api/messages', message);
    return await response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message. Please try again.');
  }
}

// Function to fetch message history
export async function fetchMessages(username: string): Promise<Message[]> {
  try {
    const response = await apiRequest('GET', `/api/messages?username=${encodeURIComponent(username)}`, undefined);
    return await response.json();
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw new Error('Failed to fetch message history.');
  }
}
