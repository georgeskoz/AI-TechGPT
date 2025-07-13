import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SimpleChatPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, `User: ${input}`]);
      setInput('');
      
      // Simple AI response
      setTimeout(() => {
        setMessages(prev => [...prev, `AI: Thanks for your message: "${input}"`]);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
            TechGPT - AI Technical Support
          </h1>
          
          <div className="mb-6 h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                <p>Welcome to TechGPT! Ask me any technical question.</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div key={index} className="mb-2 p-2 rounded">
                  <p className={message.startsWith('User:') ? 'text-blue-600' : 'text-green-600'}>
                    {message}
                  </p>
                </div>
              ))
            )}
          </div>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your technical question here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}