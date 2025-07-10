import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { UserPlus, Users, Wrench, ArrowRight, CheckCircle, Star, Shield } from 'lucide-react';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  location: z.string().min(2, 'Please enter your location'),
  userType: z.enum(['customer', 'technician']),
  bio: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true, 'You must agree to the terms and conditions'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      fullName: '',
      phone: '',
      location: '',
      userType: 'customer',
      bio: '',
      agreeToTerms: false,
    },
  });

  const selectedUserType = form.watch('userType');

  const handleRegister = async (data: RegisterForm) => {
    try {
      setIsSubmitting(true);

      const userData = {
        email: data.email,
        password: 'temp_' + Math.random().toString(36).slice(2), // Temporary password
        firstName: data.fullName.split(' ')[0] || data.fullName,
        lastName: data.fullName.split(' ').slice(1).join(' ') || '',
        phone: data.phone,
        address: data.location,
        city: '',
        state: '',
        zipCode: '',
        preferredContactMethod: 'email',
        username: data.username,
        bio: data.bio || '',
        userType: data.userType,
      };

      const response = await apiRequest('POST', '/api/auth/register', userData);
      
      if (response.ok) {
        const user = await response.json();
        
        // Store user data in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('username', user.username);
        
        toast({
          title: "Registration Successful!",
          description: `Welcome to TechGPT, ${user.fullName}! Your account has been created.`,
        });

        // Redirect based on user type
        if (data.userType === 'technician') {
          setLocation('/technician-dashboard');
        } else {
          setLocation('/dashboard');
        }
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Join TechGPT Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your account to access expert technical support and connect with verified service providers
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Users className="h-5 w-5" />
                For Customers
              </CardTitle>
              <CardDescription className="text-blue-700">
                Get expert help for your technical issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                AI-powered technical support chat
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Connect with verified technicians
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Track support tickets and history
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                On-site and remote support options
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <Wrench className="h-5 w-5" />
                For Technicians
              </CardTitle>
              <CardDescription className="text-green-700">
                Earn money helping customers with technical issues
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Flexible work opportunities
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Competitive hourly rates ($25-200+)
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Remote, phone, and on-site services
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Professional verification system
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registration Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Create Your Account
            </CardTitle>
            <CardDescription>
              Fill in the details below to join our technical support platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-6">
                {/* Account Type Selection */}
                <FormField
                  control={form.control}
                  name="userType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">I want to join as:</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer">
                            <div className="flex items-center gap-3 py-2">
                              <Users className="h-5 w-5 text-blue-600" />
                              <div>
                                <div className="font-medium">Customer</div>
                                <div className="text-sm text-gray-500">Get technical support and help</div>
                              </div>
                            </div>
                          </SelectItem>
                          <SelectItem value="technician">
                            <div className="flex items-center gap-3 py-2">
                              <Wrench className="h-5 w-5 text-green-600" />
                              <div>
                                <div className="font-medium">Service Provider/Technician</div>
                                <div className="text-sm text-gray-500">Earn money helping customers</div>
                              </div>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Basic Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Choose a username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="City, State/Province, Country" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Bio field for technicians */}
                {selectedUserType === 'technician' && (
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Professional Bio (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell customers about your technical expertise, certifications, and experience..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Terms Agreement */}
                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          I agree to the{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            Terms of Service
                          </a>{' '}
                          and{' '}
                          <a href="#" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </a>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Trust Indicators */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-green-600" />
                      <span>Secure Registration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Verified Platform</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span>Instant Access</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Creating Account...'
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-5 w-5" />
                      Create My Account
                      <ArrowRight className="h-5 w-5" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <button
              onClick={() => setLocation('/auth-test')}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}