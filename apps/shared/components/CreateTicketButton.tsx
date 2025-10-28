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
import { Ticket, MessageSquare, Clock, AlertTriangle, User, UserPlus, Wrench, ArrowRight } from 'lucide-react';
import { Message } from '@/lib/openai';
import { useLocation } from 'wouter';

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
  const [showNextSteps, setShowNextSteps] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<any>(null);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

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
        setCreatedTicket(ticket);
        
        // Check if user is authenticated (has account)
        const isUserAuthenticated = localStorage.getItem('currentUser') !== null;
        
        if (isUserAuthenticated) {
          // User is logged in - show success message and offer support tools
          toast({
            title: "Support Ticket Created",
            description: `Ticket ${ticket.ticketNumber} created successfully! Continue to support tools for immediate help.`,
          });
          setShowNextSteps(true);
        } else {
          // User not logged in - show success and offer registration
          toast({
            title: "Support Ticket Created",
            description: `Ticket ${ticket.ticketNumber} created! Join our platform to find specialized service providers.`,
          });
          setShowNextSteps(true);
        }
        
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

  // Check if user is authenticated
  const isUserAuthenticated = localStorage.getItem('currentUser') !== null;

  const handleContinueToSupport = () => {
    setIsOpen(false);
    setShowNextSteps(false);
    setLocation('/issues');
  };

  const handleFindServiceProvider = () => {
    setIsOpen(false);
    setShowNextSteps(false);
    setLocation('/technician-matching');
  };

  const handleSignUp = () => {
    setIsOpen(false);
    setShowNextSteps(false);
    // Navigate to registration flow
    setLocation('/register');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setShowNextSteps(false);
        setCreatedTicket(null);
      }
    }}>
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
        {!showNextSteps ? (
          <>
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
          </>
        ) : (
          // Next Steps UI after ticket creation
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {isUserAuthenticated ? (
                  <>
                    <Ticket className="h-5 w-5 text-green-600" />
                    Ticket Created Successfully!
                  </>
                ) : (
                  <>
                    <Ticket className="h-5 w-5 text-green-600" />
                    Ticket Created - What's Next?
                  </>
                )}
              </DialogTitle>
              <p className="text-sm text-gray-600">
                {createdTicket && (
                  <>Ticket #{createdTicket.ticketNumber} has been created. </>
                )}
                {isUserAuthenticated 
                  ? "Continue to support tools for immediate assistance."
                  : "Join our platform to find specialized service providers for your issue."
                }
              </p>
            </DialogHeader>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Ticket className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-green-900 mb-1">
                    Support Ticket Created Successfully
                  </h3>
                  <p className="text-sm text-green-700 mb-3">
                    Your chat conversation has been escalated to ticket #{createdTicket?.ticketNumber}. 
                    A support agent will review your case and provide updates.
                  </p>
                  <div className="bg-green-100 p-2 rounded text-xs text-green-800">
                    💡 <strong>Pro tip:</strong> You'll receive email notifications about ticket progress, 
                    but you can get immediate help through the options below.
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Options */}
            <div className="space-y-4">
              <div className="text-sm font-medium text-gray-900 mb-3">
                What would you like to do next?
              </div>

              {isUserAuthenticated ? (
                // Authenticated user options
                <div className="grid gap-3">
                  <Button 
                    onClick={handleContinueToSupport}
                    className="flex items-center justify-between p-4 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Continue to Support Tools</div>
                        <div className="text-xs opacity-90">Access diagnostic tools and immediate help</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleFindServiceProvider}
                    className="flex items-center justify-between p-4 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Find a Service Provider</div>
                        <div className="text-xs opacity-70">Connect with expert technicians for hands-on help</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                // Non-authenticated user options
                <div className="grid gap-3">
                  <Button 
                    onClick={handleSignUp}
                    className="flex items-center justify-between p-4 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <UserPlus className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Join Our Platform</div>
                        <div className="text-xs opacity-90">Sign up to access expert service providers</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={handleFindServiceProvider}
                    className="flex items-center justify-between p-4 h-auto"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-medium">Browse Service Providers</div>
                        <div className="text-xs opacity-70">See available technicians (registration required to book)</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Additional Information */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-2">While you wait for ticket response:</p>
                  <ul className="text-blue-700 space-y-1 text-xs">
                    <li>• Continue chatting here for basic troubleshooting</li>
                    <li>• Use our diagnostic tools for self-service solutions</li>
                    <li>• Connect with verified technicians for immediate assistance</li>
                    {!isUserAuthenticated && (
                      <li>• <strong>Sign up</strong> to unlock premium support features</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setShowNextSteps(false);
                    setCreatedTicket(null);
                  }}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsOpen(false);
                    setShowNextSteps(false);
                    setCreatedTicket(null);
                    // Continue chatting
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Continue Chatting
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}