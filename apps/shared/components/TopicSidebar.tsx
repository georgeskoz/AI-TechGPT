import { Check, Code, Cpu, Database, Monitor, Network, Shield, Wrench, Lock, Headphones, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface TopicSidebarProps {
  onSelectTopic: (topic: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

const topics = [
  { 
    name: 'Web Development', 
    icon: <Code className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Frontend Development', 'Backend Development', 'Full Stack', 'Learning Resources', 'Frameworks & Libraries', 'API Integration', 'Deployment Issues']
  },
  { 
    name: 'Hardware Issues', 
    icon: <Cpu className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Computer Won\'t Start', 'Overheating Problems', 'Memory Issues', 'Hard Drive Problems', 'Graphics Card Issues', 'Power Supply Problems', 'Peripheral Devices']
  },
  { 
    name: 'Network Troubleshooting', 
    icon: <Network className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['WiFi Connection', 'Ethernet Problems', 'Slow Internet', 'Router Configuration', 'Port Forwarding', 'DNS Issues', 'Firewall Settings']
  },
  { 
    name: 'Database Help', 
    icon: <Database className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['SQL Queries', 'Database Design', 'Performance Optimization', 'Backup & Recovery', 'Connection Issues', 'Data Migration', 'Security Settings']
  },
  { 
    name: 'Mobile Devices', 
    icon: <Monitor className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['iOS Issues', 'Android Problems', 'App Installation', 'Battery Problems', 'Screen Issues', 'Storage Management', 'Sync Problems']
  },
  { 
    name: 'Security Questions', 
    icon: <Shield className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Password Management', 'Two-Factor Authentication', 'Antivirus Setup', 'Phishing Protection', 'Data Encryption', 'Privacy Settings', 'Secure Browsing']
  },
  { 
    name: 'Cyber security', 
    icon: <Lock className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Malware Removal', 'Ransomware Protection', 'Security Audits', 'Penetration Testing', 'Incident Response', 'Compliance Issues', 'Security Training']
  },
  { 
    name: 'Online Remote Support', 
    icon: <Headphones className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Screen Sharing Setup', 'Remote Desktop', 'File Transfer', 'Troubleshooting Session', 'Software Installation', 'System Updates', 'Configuration Help']
  },
  { 
    name: 'Order a technician onsite', 
    icon: <Wrench className="h-4 w-4 mr-2 text-blue-500" />,
    subtopics: ['Emergency Repair', 'Scheduled Maintenance', 'Hardware Installation', 'Network Setup', 'Data Recovery', 'System Upgrade', 'Consultation Service']
  },
];

export default function TopicSidebar({ onSelectTopic, isMobile = false, onClose }: TopicSidebarProps) {
  const [expandedTopics, setExpandedTopics] = useState<number[]>([]);

  const toggleTopic = (index: number) => {
    setExpandedTopics(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleSubtopicClick = (mainTopic: string, subtopic: string) => {
    onSelectTopic(`${mainTopic}: ${subtopic}`);
    if (isMobile && onClose) onClose();
  };

  // For desktop sidebar
  if (!isMobile) {
    return (
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Technical Topics</h2>
          <div className="space-y-1">
            {topics.map((topic, index) => (
              <div key={index} className="space-y-1">
                <button
                  onClick={() => toggleTopic(index)}
                  className="w-full text-left p-2 rounded hover:bg-blue-50 text-sm font-medium text-gray-700 transition flex items-center justify-between"
                >
                  <div className="flex items-center">
                    {topic.icon}
                    {topic.name}
                  </div>
                  {expandedTopics.includes(index) ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  )}
                </button>
                {expandedTopics.includes(index) && (
                  <div className="ml-6 space-y-1">
                    {topic.subtopics.map((subtopic, subIndex) => (
                      <button
                        key={subIndex}
                        onClick={() => handleSubtopicClick(topic.name, subtopic)}
                        className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs text-gray-600 transition"
                      >
                        {subtopic}
                      </button>
                    ))}
                  </div>
                )}
              </div>
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
      <div className="space-y-1">
        {topics.map((topic, index) => (
          <div key={index} className="space-y-1">
            <button
              onClick={() => toggleTopic(index)}
              className="w-full text-left p-3 rounded hover:bg-blue-50 text-sm font-medium text-gray-700 transition flex items-center justify-between"
            >
              <div className="flex items-center">
                {topic.icon}
                {topic.name}
              </div>
              {expandedTopics.includes(index) ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500" />
              )}
            </button>
            {expandedTopics.includes(index) && (
              <div className="ml-6 space-y-1">
                {topic.subtopics.map((subtopic, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => handleSubtopicClick(topic.name, subtopic)}
                    className="w-full text-left p-2 rounded hover:bg-gray-50 text-xs text-gray-600 transition"
                  >
                    {subtopic}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
