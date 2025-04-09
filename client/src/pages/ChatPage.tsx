import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useChat } from '@/hooks/useChat';
import TechGPTHeader from '@/components/TechGPTHeader';
import TopicSidebar from '@/components/TopicSidebar';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import UsernameModal from '@/components/UsernameModal';
import ErrorToast from '@/components/ErrorToast';

export default function ChatPage() {
  // State for username and storage
  const [username, setUsername] = useLocalStorage<string>('techgpt_username', '');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showMobileTopics, setShowMobileTopics] = useState(false);
  
  // Chat functionality with OpenAI
  const { messages, isLoading, error, sendMessage, clearError } = useChat(username);
  
  // Check if username exists on mount
  useEffect(() => {
    if (!username) {
      setShowUsernameModal(true);
    }
  }, [username]);
  
  // Handle saving username
  const handleSaveUsername = (newUsername: string) => {
    setUsername(newUsername);
    setShowUsernameModal(false);
    
    // Send a welcome message
    sendMessage(`Hello, I'm ${newUsername}. I'm looking for technical help.`);
  };
  
  // Handle topic selection
  const handleSelectTopic = (topic: string) => {
    sendMessage(`I need help with ${topic}`);
  };
  
  // Toggle mobile topics panel
  const toggleMobileTopics = () => {
    setShowMobileTopics(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* App Header */}
      <TechGPTHeader username={username || 'User'} />
      
      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Topic Suggestions Sidebar (hidden on mobile) */}
        <TopicSidebar onSelectTopic={handleSelectTopic} />
        
        {/* Chat Messages Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
          <ChatArea 
            messages={messages} 
            isLoading={isLoading} 
            username={username || 'User'} 
          />
          
          {/* Chat Input - Always at the bottom */}
          <div className="sticky bottom-0 w-full z-10">
            <ChatInput 
              onSendMessage={sendMessage} 
              isLoading={isLoading} 
              onToggleTopics={toggleMobileTopics} 
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Topic Suggestions */}
      {showMobileTopics && (
        <TopicSidebar 
          isMobile={true} 
          onSelectTopic={handleSelectTopic} 
          onClose={() => setShowMobileTopics(false)} 
        />
      )}
      
      {/* Username Modal */}
      <UsernameModal 
        isOpen={showUsernameModal} 
        onSave={handleSaveUsername} 
      />
      
      {/* Error Toast */}
      {error && (
        <ErrorToast message={error} onClose={clearError} />
      )}
    </div>
  );
}
