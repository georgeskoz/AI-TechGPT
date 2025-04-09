import { useState, useCallback, useEffect } from 'react';
import { sendMessage, fetchMessages, type Message } from '@/lib/openai';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export function useChat(username: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Function to send a message
  const sendChatMessage = useCallback(async (content: string) => {
    if (!content.trim() || !username) return;

    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await sendMessage({
        username,
        content,
        isUser: true
      });

      // Add both user message and AI response to the messages list
      setState(prev => {
        const newMessages = [...prev.messages];
        
        // Add user message
        newMessages.push(response.userMessage);
        
        // Add AI message if it exists
        if (response.aiMessage) {
          newMessages.push(response.aiMessage);
        }
        
        return {
          messages: newMessages,
          isLoading: false,
          error: response.error || null
        };
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  }, [username]);

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!username) return;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    try {
      const messages = await fetchMessages(username);
      setState(prev => ({
        ...prev,
        messages,
        isLoading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load chat history'
      }));
    }
  }, [username]);

  // Clear error message
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    sendMessage: sendChatMessage,
    loadChatHistory,
    clearError
  };
}
