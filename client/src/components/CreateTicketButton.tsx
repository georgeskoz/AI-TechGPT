import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Ticket, MessageSquare, Clock, AlertTriangle } from 'lucide-react';
import { Message } from '@/lib/openai';

interface CreateTicketButtonProps {
  messages: Message[];
  username: string;
  className?: string;
}

const createTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type CreateTicketForm = z.infer<typeof createTicketSchema>;

export default function CreateTicketButton({ messages, username, className }: CreateTicketButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateTicketForm>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      subject: '',
      description: '',
      category: '',
      priority: 'medium' as const,
    },
  });

  const handleCreateTicket = async (data: CreateTicketForm) => {
    try {
      setIsSubmitting(true);

      // Prepare chat conversation data
      const chatConversation = {
        username,
        messages: messages.map(msg => ({
          content: msg.content,
          isUser: msg.isUser,
          timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
          domain: msg.domain,
        })),
      };

      // Generate ticket number
      const ticketNumber = `TCK-${Date.now().toString().slice(-8).toUpperCase()}`;

      const ticketData = {
        ticketNumber,
        subject: data.subject,
        description: data.description,
        category: data.category,
        priority: data.priority,
        source: 'chat',
        chatConversation,
        tags: [data.category, 'chat-escalation'],
      };

      const response = await apiRequest('POST', '/api/support-tickets', ticketData);
      
      if (response.ok) {
        const ticket = await response.json();
        toast({
          title: "Support Ticket Created",
          description: `Ticket ${ticket.ticketNumber} has been created successfully. You'll receive updates via email.`,
        });
        setIsOpen(false);
        form.reset();
      } else {
        throw new Error('Failed to create ticket');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestSubject = () => {
    // Auto-generate subject based on recent messages
    const recentUserMessages = messages
      .filter(msg => msg.isUser)
      .slice(-3)
      .map(msg => msg.content);
    
    if (recentUserMessages.length > 0) {
      const lastMessage = recentUserMessages[recentUserMessages.length - 1];
      const words = lastMessage.split(' ').slice(0, 8).join(' ');
      form.setValue('subject', `Help with: ${words}${lastMessage.length > 50 ? '...' : ''}`);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  };

  const categoryIcons = {
    technical: '🔧',
    billing: '💳',
    account: '👤',
    general: '💬',
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 ${className}`}
          disabled={messages.length === 0}
        >
          <Ticket className="h-4 w-4" />
          Create Support Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Create Support Ticket from Chat
          </DialogTitle>
          <p className="text-sm text-gray-600">
            Escalate your chat conversation to a formal support ticket for tracking and priority handling.
          </p>
        </DialogHeader>

        {/* Chat Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-sm">Chat Summary</span>
            <Badge variant="secondary">{messages.length} messages</Badge>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Started: {messages[0]?.timestamp ? new Date(messages[0].timestamp).toLocaleString() : 'Recently'}
            </div>
            <div className="max-h-24 overflow-y-auto">
              <span className="font-medium">Recent topic:</span>{' '}
              {messages
                .filter(msg => msg.isUser)
                .slice(-1)[0]?.content.slice(0, 100)}
              {messages.filter(msg => msg.isUser).slice(-1)[0]?.content.length > 100 && '...'}
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateTicket)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Brief description of your issue"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={suggestSubject}
                      className="whitespace-nowrap"
                    >
                      Auto-fill
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="technical">
                          🔧 Technical Support
                        </SelectItem>
                        <SelectItem value="billing">
                          💳 Billing & Payments
                        </SelectItem>
                        <SelectItem value="account">
                          👤 Account Issues
                        </SelectItem>
                        <SelectItem value="general">
                          💬 General Support
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-100 text-green-800">Low</Badge>
                            <span className="text-sm">General inquiry</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
                            <span className="text-sm">Normal issue</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-orange-100 text-orange-800">High</Badge>
                            <span className="text-sm">Important issue</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                            <span className="text-sm">Critical issue</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Details</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide any additional context, steps to reproduce, or specific requirements..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900">What happens next?</p>
                  <ul className="text-blue-700 mt-1 space-y-1">
                    <li>• Your complete chat conversation will be attached to the ticket</li>
                    <li>• A support agent will review your case within 24 hours</li>
                    <li>• You'll receive email updates on ticket progress</li>
                    <li>• You can continue chatting while the ticket is being processed</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating Ticket...' : 'Create Support Ticket'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}