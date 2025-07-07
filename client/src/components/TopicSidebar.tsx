import { Check, Code, Cpu, Database, Monitor, Network, Shield, Wrench } from 'lucide-react';

interface TopicSidebarProps {
  onSelectTopic: (topic: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const topics = [
  { name: 'Web Development', icon: <Code className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Hardware Issues', icon: <Cpu className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Network Troubleshooting', icon: <Network className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Database Help', icon: <Database className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Mobile Devices', icon: <Monitor className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Security Questions', icon: <Shield className="h-4 w-4 mr-2 text-blue-500" /> },
  { name: 'Order a technician onsite', icon: <Wrench className="h-4 w-4 mr-2 text-blue-500" /> },
];

export default function TopicSidebar({ onSelectTopic, isMobile = false, onClose }: TopicSidebarProps) {
  // For desktop sidebar
  if (!isMobile) {
    return (
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Technical Topics</h2>
          <div className="space-y-2">
            {topics.map((topic, index) => (
              <button
                key={index}
                onClick={() => onSelectTopic(topic.name)}
                className="w-full text-left p-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700 transition"
              >
                <div className="flex items-center">
                  {topic.icon}
                  {topic.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  // For mobile sidebar
  return (
    <div className="md:hidden fixed inset-0 bg-white z-10 p-4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Technical Topics</h2>
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-2">
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => {
              onSelectTopic(topic.name);
              if (onClose) onClose();
            }}
            className="w-full text-left p-3 rounded hover:bg-blue-50 text-sm font-medium text-gray-700 transition"
          >
            <div className="flex items-center">
              {topic.icon}
              {topic.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
