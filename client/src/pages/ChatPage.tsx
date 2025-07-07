import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tag, List } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useChat } from '@/hooks/useChat';
import TechGPTHeader from '@/components/TechGPTHeader';
import TopicSidebar from '@/components/TopicSidebar';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import UsernameModal from '@/components/UsernameModal';
import ErrorToast from '@/components/ErrorToast';
import DomainSelector from '@/components/DomainSelector';

export default function ChatPage() {
  // State for username and storage
  const [username, setUsername] = useLocalStorage<string>('techgpt_username', '');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showMobileTopics, setShowMobileTopics] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  
  // Chat functionality with OpenAI
  const { messages, isLoading, error, typingMessage, isTyping, sendMessage, clearError } = useChat(username);
  
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
    // Set domain when a topic is selected
    if (topic.includes(':')) {
      const domain = topic.split(':')[0].trim();
      setSelectedDomain(domain);
    }
    sendMessage(`I need help with ${topic}`);
  };

  const handleSendMessage = (message: string) => {
    // Include domain information when sending message
    sendMessage(message);
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
          {/* Domain Selector */}
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <DomainSelector 
              selectedDomain={selectedDomain} 
              onDomainChange={setSelectedDomain} 
            />
          </div>
          
          <ChatArea 
            messages={messages} 
            isLoading={isLoading} 
            username={username || 'User'} 
            typingMessage={typingMessage}
            isTyping={isTyping}
          />
          
          {/* Chat Input - Always at the bottom */}
          <div className="sticky bottom-0 w-full z-10">
            <ChatInput 
              onSendMessage={handleSendMessage} 
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
      
      {/* Floating Action Button for Issue Categorization */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setLocation('/issues')}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
          title="Categorize Technical Issues"
        >
          <Tag className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
