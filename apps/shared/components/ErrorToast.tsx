import { XCircle, X } from 'lucide-react';

interface ErrorToastProps {
  message: string;
  onClose: () => void;
}

export default function ErrorToast({ message, onClose }: ErrorToastProps) {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
      <XCircle className="h-5 w-5 text-red-500" />
      <div>{message}</div>
      <button 
        onClick={onClose}
        className="ml-auto text-red-500 hover:text-red-700"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
