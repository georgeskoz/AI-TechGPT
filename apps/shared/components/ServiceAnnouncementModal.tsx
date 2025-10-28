import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Globe, X } from 'lucide-react';

interface ServiceAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ServiceAnnouncementModal({ isOpen, onClose }: ServiceAnnouncementModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            Service Availability Notice
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Onsite Services</h4>
                <p className="text-sm text-blue-800">
                  Currently limited to the <strong>Ottawa–Gatineau region</strong>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 mb-1">Online Services</h4>
                <p className="text-sm text-green-800">
                  Available across <strong>Canada and the United States</strong>
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            Thank you for your understanding.
          </p>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose} className="w-full">
            Got it, thanks!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}