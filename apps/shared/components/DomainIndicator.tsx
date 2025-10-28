import { Badge } from '@/components/ui/badge';
import { Code, Cpu, Database, Monitor, Network, Shield, Wrench, Lock, Headphones } from 'lucide-react';

interface DomainIndicatorProps {
  domain: string | null;
  className?: string;
}

const domainIcons: Record<string, JSX.Element> = {
  'Web Development': <Code className="h-3 w-3" />,
  'Hardware Issues': <Cpu className="h-3 w-3" />,
  'Network Troubleshooting': <Network className="h-3 w-3" />,
  'Database Help': <Database className="h-3 w-3" />,
  'Mobile Devices': <Monitor className="h-3 w-3" />,
  'Security Questions': <Shield className="h-3 w-3" />,
  'Cyber security': <Lock className="h-3 w-3" />,
  'Online Remote Support': <Headphones className="h-3 w-3" />,
  'Order a technician onsite': <Wrench className="h-3 w-3" />,
};

const domainColors: Record<string, string> = {
  'Web Development': 'bg-blue-100 text-blue-800 border-blue-200',
  'Hardware Issues': 'bg-red-100 text-red-800 border-red-200',
  'Network Troubleshooting': 'bg-green-100 text-green-800 border-green-200',
  'Database Help': 'bg-purple-100 text-purple-800 border-purple-200',
  'Mobile Devices': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Security Questions': 'bg-orange-100 text-orange-800 border-orange-200',
  'Cyber security': 'bg-gray-100 text-gray-800 border-gray-200',
  'Online Remote Support': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'Order a technician onsite': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function DomainIndicator({ domain, className = "" }: DomainIndicatorProps) {
  if (!domain || !domainIcons[domain]) {
    return null;
  }

  const icon = domainIcons[domain];
  const colorClass = domainColors[domain] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <Badge 
      variant="outline" 
      className={`inline-flex items-center gap-1 text-xs ${colorClass} ${className}`}
    >
      {icon}
      {domain}
    </Badge>
  );
}