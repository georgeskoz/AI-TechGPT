import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tag, List } from 'lucide-react';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useChat } from '@/hooks/useChat';
import Navigation from '@/components/Navigation';
import TechGPTHeader from '@/components/TechGPTHeader';
import TopicSidebar from '@/components/TopicSidebar';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import UsernameModal from '@/components/UsernameModal';
import ErrorToast from '@/components/ErrorToast';
import DomainSelector from '@/components/DomainSelector';
import SupportOptionsWidget from '@/components/SupportOptionsWidget';
import DiagnosticChecklist from '@/components/DiagnosticChecklist';

export default function ChatPage() {
  // State for username and storage
  const [username, setUsername] = useLocalStorage<string>('techgpt_username', '');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showMobileTopics, setShowMobileTopics] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [showDiagnosticChecklist, setShowDiagnosticChecklist] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');
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

  const handleSupportOptionSelected = (option: string) => {
    switch (option) {
      case 'ai_chat':
        // Continue in current chat
        break;
      case 'triage':
        setLocation('/triage');
        break;
      case 'live_chat':
        setLocation('/live-support');
        break;
      case 'phone_support':
        setLocation('/phone-support');
        break;
      case 'onsite_support':
        setLocation('/marketplace');
        break;
    }
  };

  const handleSendMessage = (message: string) => {
    // Track the last user message for diagnostic checklist
    setLastUserMessage(message);
    // Include domain information when sending message
    sendMessage(message);
  };
  
  // Toggle mobile topics panel
  const toggleMobileTopics = () => {
    setShowMobileTopics(prev => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Navigation title="AI Chat Support" backTo="/customer-home" />
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
          
          {/* Diagnostic Checklist */}
          {showDiagnosticChecklist && lastUserMessage && (
            <div className="bg-white border-t border-gray-200 p-4">
              <DiagnosticChecklist 
                issue={lastUserMessage}
                category={selectedDomain || undefined}
                onComplete={() => setShowDiagnosticChecklist(false)}
              />
            </div>
          )}

          {/* Support Options Widget - Show after AI has provided initial help */}
          {messages.length >= 2 && !showDiagnosticChecklist && (
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="mb-3">
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  Still need help? Get additional support:
                </h3>
                <p className="text-xs text-gray-600">
                  Try our diagnostic checklist or connect with human experts
                </p>
              </div>
              
              {/* Diagnostic Checklist Button */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-blue-900">
                      🔍 Try Our AI Diagnostic Checklist
                    </h4>
                    <p className="text-xs text-blue-700 mt-1">
                      Get a personalized step-by-step troubleshooting guide for your issue
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowDiagnosticChecklist(true)}
                    size="sm"
                    className="ml-3"
                  >
                    Generate Checklist
                  </Button>
                </div>
              </div>
              
              <SupportOptionsWidget 
                category={selectedDomain || undefined}
                onOptionSelected={handleSupportOptionSelected}
              />
            </div>
          )}
          
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
