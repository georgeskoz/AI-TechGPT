import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DomainIndicator from './DomainIndicator';

interface DomainSelectorProps {
  selectedDomain: string | null;
  onDomainChange: (domain: string | null) => void;
}

const domains = [
  'Web Development',
  'Hardware Issues',
  'Network Troubleshooting',
  'Database Help',
  'Mobile Devices',
  'Security Questions',
  'Cyber security',
  'Online Remote Support',
  'Order a technician onsite'
];

export default function DomainSelector({ selectedDomain, onDomainChange }: DomainSelectorProps) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-sm text-gray-600">Active domain:</span>
      
      {selectedDomain ? (
        <div className="flex items-center gap-1">
          <DomainIndicator domain={selectedDomain} />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDomainChange(null)}
            className="h-6 w-6 p-0 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Select domain
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {domains.map((domain) => (
              <DropdownMenuItem 
                key={domain} 
                onClick={() => onDomainChange(domain)}
                className="cursor-pointer"
              >
                <DomainIndicator domain={domain} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}