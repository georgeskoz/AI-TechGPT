import { useRef, useEffect } from 'react';
import { Message } from '@/lib/openai';
import { Clipboard } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  username: string;
}

export default function ChatArea({ messages, isLoading, username }: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return 'Just now';
    
    // If timestamp is a string, convert it to Date
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Response copied to clipboard",
        duration: 2000,
      });
    }).catch(err => {
      console.error('Could not copy text: ', err);
    });
  };

  // Helper function to format text with code blocks
  const formatContentWithCodeBlocks = (content: string) => {
    // Split by code block markers
    const parts = content.split(/```([\s\S]*?)```/);
    
    return parts.map((part, index) => {
      // Every odd index is a code block
      if (index % 2 === 1) {
        return (
          <div className="bg-gray-800 rounded-md p-3 mt-2 mb-2" key={index}>
            <pre className="code-block text-gray-100 text-sm">
              <code>{part}</code>
            </pre>
          </div>
        );
      }
      
      // Handle inline code
      const inlineParts = part.split(/`(.*?)`/);
      
      return (
        <div key={index}>
          {inlineParts.map((inlinePart, inlineIndex) => {
            // Every odd index is inline code
            if (inlineIndex % 2 === 1) {
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" key={inlineIndex}>
                  {inlinePart}
                </code>
              );
            }
            
            // Regular text, replace newlines with <br />
            return (
              <span key={inlineIndex} 
                dangerouslySetInnerHTML={{ 
                  __html: inlinePart.replace(/\n/g, '<br />') 
                }} 
              />
            );
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <div id="chat-messages" className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm max-w-3xl">
              <div className="flex items-center mb-1">
                <span className="text-sm font-semibold text-gray-800">TechGPT</span>
                <span className="text-xs text-gray-500 ml-2">Just now</span>
              </div>
              <div className="text-gray-700">
                <p>Welcome to TechGPT! I'm here to help with all your technical questions and problems. Whether you're dealing with coding issues, hardware problems, or need guidance on technology decisions, I'm here to assist.</p>
                <p className="mt-2">How can I help you today?</p>
              </div>
            </div>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message, index) => (
          <div key={index} className={`flex items-start ${message.isUser ? 'justify-end' : ''}`}>
            {!message.isUser && (
              <div className="flex-shrink-0 mr-2">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
            
            <div className={`rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-white'} p-4 shadow-sm max-w-3xl`}>
              <div className={`flex items-center ${message.isUser ? 'justify-end' : ''} mb-1`}>
                {message.isUser && (
                  <span className="text-xs text-blue-100 mr-2">{formatTimestamp(message.timestamp)}</span>
                )}
                <span className={`text-sm font-semibold ${message.isUser ? '' : 'text-gray-800'}`}>
                  {message.isUser ? 'You' : 'TechGPT'}
                </span>
                {!message.isUser && (
                  <span className="text-xs text-gray-500 ml-2">{formatTimestamp(message.timestamp)}</span>
                )}
              </div>
              
              <div className={message.isUser ? '' : 'text-gray-700'}>
                {message.isUser ? (
                  <p>{message.content}</p>
                ) : (
                  formatContentWithCodeBlocks(message.content)
                )}
              </div>
              
              {!message.isUser && (
                <div className="mt-2 flex justify-end">
                  <button 
                    className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1 transition"
                    onClick={() => copyToClipboard(message.content)}
                  >
                    <Clipboard className="h-4 w-4" />
                    <span>Copy response</span>
                  </button>
                </div>
              )}
            </div>
            
            {message.isUser && (
              <div className="flex-shrink-0 ml-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium">
                  {username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center mb-1">
                <span className="text-sm font-semibold text-gray-800">TechGPT</span>
                <span className="text-xs text-gray-500 ml-2">Now</span>
              </div>
              <div className="typing-indicator text-gray-500">
                <span>●</span><span>●</span><span>●</span>
              </div>
            </div>
          </div>
        )}
        
        {/* This div allows us to scroll to the bottom */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
