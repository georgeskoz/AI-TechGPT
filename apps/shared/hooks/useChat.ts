import { useState, useCallback, useEffect, useRef } from 'react';
import { sendMessage, fetchMessages, type Message } from '@/lib/openai';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  typingMessage: string | null;
  isTyping: boolean;
}

export function useChat(username: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    typingMessage: null,
    isTyping: false,
  });
  
  // Reference to the current typing animation timeout
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timeouts and intervals on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  // Simulate typing effect for AI response
  const simulateTyping = useCallback((finalMessage: string) => {
    // Clear any existing typing animations
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    // Start with empty message
    setState(prev => ({
      ...prev,
      isTyping: true,
      typingMessage: "",
      isLoading: true
    }));

    // Determine typing speed based on message length
    // Longer messages have slightly faster char-by-char typing for better UX
    const baseDelay = Math.max(10, Math.min(50, 100 - finalMessage.length / 20));
    let currentPosition = 0;
    
    // Character by character typing simulation
    typingIntervalRef.current = setInterval(() => {
      // Increment position
      currentPosition++;
      
      if (currentPosition <= finalMessage.length) {
        // Update with partial message
        setState(prev => ({
          ...prev,
          typingMessage: finalMessage.substring(0, currentPosition)
        }));
      } else {
        // Complete message, clear interval, and add to messages
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
        
        setState(prev => {
          // Create AI message object
          const aiMessage: Message = {
            username,
            content: finalMessage,
            isUser: false,
            timestamp: new Date()
          };
          
          return {
            ...prev,
            messages: [...prev.messages, aiMessage],
            isLoading: false,
            typingMessage: null,
            isTyping: false
          };
        });
      }
    }, baseDelay);
  }, [username]);

  // Function to send a message
  const sendChatMessage = useCallback(async (content: string) => {
    if (!content.trim() || !username) return;

    // Set loading state and add user message immediately
    setState(prev => {
      const userMessage: Message = {
        username,
        content,
        isUser: true,
        timestamp: new Date()
      };
      
      return {
        ...prev,
        messages: [...prev.messages, userMessage],
        isLoading: true,
        error: null,
        isTyping: true
      };
    });

    try {
      const response = await sendMessage({
        username,
        content,
        isUser: true
      });
      
      if (response.aiMessage) {
        // Instead of immediately adding the AI message, simulate typing
        simulateTyping(response.aiMessage.content);
      } else {
        // If no AI message, just stop loading
        setState(prev => ({
          ...prev,
          isLoading: false,
          isTyping: false,
          error: response.error || null
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isTyping: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }));
    }
  }, [username, simulateTyping]);

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    if (!username) return;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      isTyping: false,
      typingMessage: null
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
    typingMessage: state.typingMessage,
    isTyping: state.isTyping,
    sendMessage: sendChatMessage,
    loadChatHistory,
    clearError
  };
}
