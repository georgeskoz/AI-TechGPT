import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UpdateProfile } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SimpleNavigation from "@/components/SimpleNavigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building2, 
  CreditCard, 
  Edit, 
  Save, 
  X,
  Shield,
  Upload,
  Camera
} from "lucide-react";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const EditModal = ({ isOpen, onClose, title, children }: EditModalProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>Update your information below</DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);

// Personal Info Edit Schema (excluding name and email)
const personalInfoEditSchema = z.object({
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

// Address Edit Schema
const addressEditSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  apartment: z.string().optional().or(z.literal("")),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  zipCode: z.string().min(1, { message: "Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

// Business Info Edit Schema
const businessInfoEditSchema = z.object({
  businessInfo: z.object({
    businessName: z.string().optional().or(z.literal("")),
    businessType: z.string().optional().or(z.literal("")),
    industry: z.string().optional().or(z.literal("")),
    taxId: z.string().optional().or(z.literal("")),
    website: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
  }),
});

// Payment Info Edit Schema
const paymentInfoEditSchema = z.object({
  paymentMethods: z.array(z.string()).optional(),
  paymentMethodSetup: z.boolean().optional(),
  paymentDetails: z.object({
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    paypalEmail: z.string().optional(),
    applePayEnabled: z.boolean().optional(),
    googlePayEnabled: z.boolean().optional(),
  }).optional(),
});

export default function ProfileSummary() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // Clean username parameter
  const cleanUsername = username?.replace(/^"(.*)"$/, '$1') || username;
  
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/users", cleanUsername],
    queryFn: async () => {
      const res = await fetch(`/api/users/${encodeURIComponent(cleanUsername)}`);
      if (!res.ok) {
        if (res.status === 404) {
          return null; // User doesn't exist
        }
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
    retry: false, // Don't retry on 404 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Personal Info Form
  const personalForm = useForm<z.infer<typeof personalInfoEditSchema>>({
    resolver: zodResolver(personalInfoEditSchema),
    defaultValues: {
      phone: user?.phone || "",
      bio: user?.bio || "",
      avatar: user?.avatar || "",
    },
  });

  // Address Form
  const addressForm = useForm<z.infer<typeof addressEditSchema>>({
    resolver: zodResolver(addressEditSchema),
    defaultValues: {
      street: user?.street || "",
      apartment: user?.apartment || "",
      city: user?.city || "",
      state: user?.state || "",
      zipCode: user?.zipCode || "",
      country: user?.country || "Canada",
    },
  });

  // Business Form
  const businessForm = useForm<z.infer<typeof businessInfoEditSchema>>({
    resolver: zodResolver(businessInfoEditSchema),
    defaultValues: {
      businessInfo: {
        businessName: user?.businessInfo?.businessName || "",
        businessType: user?.businessInfo?.businessType || "",
        industry: user?.businessInfo?.industry || "",
        taxId: user?.businessInfo?.taxId || "",
        website: user?.businessInfo?.website || "",
        description: user?.businessInfo?.description || "",
      },
    },
  });

  // Payment Form
  const paymentForm = useForm<z.infer<typeof paymentInfoEditSchema>>({
    resolver: zodResolver(paymentInfoEditSchema),
    defaultValues: {
      paymentMethods: user?.paymentMethods || [],
      paymentMethodSetup: user?.paymentMethodSetup || false,
      paymentDetails: {
        cardLast4: user?.paymentDetails?.cardLast4 || "",
        cardBrand: user?.paymentDetails?.cardBrand || "",
        paypalEmail: user?.paymentDetails?.paypalEmail || "",
        applePayEnabled: user?.paymentDetails?.applePayEnabled || false,
        googlePayEnabled: user?.paymentDetails?.googlePayEnabled || false,
      },
    },
  });

  // Update mutations
  const updatePersonalMutation = useMutation({
    mutationFn: async (values: z.infer<typeof personalInfoEditSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update personal information",
        variant: "destructive",
      });
    },
  });

  const updateAddressMutation = useMutation({
    mutationFn: async (values: z.infer<typeof addressEditSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Address information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update address information",
        variant: "destructive",
      });
    },
  });

  const updateBusinessMutation = useMutation({
    mutationFn: async (values: z.infer<typeof businessInfoEditSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update business information",
        variant: "destructive",
      });
    },
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async (values: z.infer<typeof paymentInfoEditSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
      setEditingSection(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment information",
        variant: "destructive",
      });
    },
  });

  // Reset forms when user data changes
  useEffect(() => {
    if (user) {
      personalForm.reset({
        phone: user.phone || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
      });
      
      addressForm.reset({
        street: user.street || "",
        apartment: user.apartment || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "Canada",
      });
      
      businessForm.reset({
        businessInfo: {
          businessName: user.businessInfo?.businessName || "",
          businessType: user.businessInfo?.businessType || "",
          industry: user.businessInfo?.industry || "",
          taxId: user.businessInfo?.taxId || "",
          website: user.businessInfo?.website || "",
          description: user.businessInfo?.description || "",
        },
      });
      
      paymentForm.reset({
        paymentMethods: user.paymentMethods || [],
        paymentMethodSetup: user.paymentMethodSetup || false,
        paymentDetails: {
          cardLast4: user.paymentDetails?.cardLast4 || "",
          cardBrand: user.paymentDetails?.cardBrand || "",
          paypalEmail: user.paymentDetails?.paypalEmail || "",
          applePayEnabled: user.paymentDetails?.applePayEnabled || false,
          googlePayEnabled: user.paymentDetails?.googlePayEnabled || false,
        },
      });
    }
  }, [user, personalForm, addressForm, businessForm, paymentForm]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full"></div>
      </div>
    );
  }

  // If user doesn't exist, redirect to profile creation
  if (!user) {
    navigate(`/profile/${cleanUsername}/personal`);
    return null;
  }

  // If there's an error, show error message
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation 
        showBackButton={true}
        title="Profile Summary"
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile Complete</h1>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Go to Login
            </Button>
          </div>
          
          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <CardTitle>Personal Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSection("personal")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.username} />
                  <AvatarFallback className="text-lg">
                    <User className="h-10 w-10" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Full Name</p>
                    <p className="text-lg">{user?.fullName || 'Not provided'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3" />
                      Protected - Cannot be changed
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-lg">{user?.email || 'Not provided'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Shield className="h-3 w-3" />
                      Protected - Cannot be changed
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-lg">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Username</p>
                    <p className="text-lg">{user?.username || 'Not provided'}</p>
                  </div>
                  {user?.bio && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700">Bio</p>
                      <p className="text-gray-600">{user.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <CardTitle>Address Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSection("address")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Street Address</p>
                  <p className="text-lg">{user?.street || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Apartment/Unit</p>
                  <p className="text-lg">{user?.apartment || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">City</p>
                  <p className="text-lg">{user?.city || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">State/Province</p>
                  <p className="text-lg">{user?.state || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Country</p>
                  <p className="text-lg">{user?.country || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Postal Code</p>
                  <p className="text-lg">{user?.zipCode || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSection("business")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {user?.businessInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Name</p>
                    <p className="text-lg">{user.businessInfo.businessName || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Business Type</p>
                    <p className="text-lg">{user.businessInfo.businessType || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Industry</p>
                    <p className="text-lg">{user.businessInfo.industry || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tax ID</p>
                    <p className="text-lg">{user.businessInfo.taxId || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Website</p>
                    <p className="text-lg">{user.businessInfo.website || 'Not provided'}</p>
                  </div>
                  {user.businessInfo.description && (
                    <div className="col-span-2">
                      <p className="text-sm font-medium text-gray-700">Description</p>
                      <p className="text-gray-600">{user.businessInfo.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">No business information provided</p>
              )}
            </CardContent>
          </Card>

          {/* Payment Information Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <CardTitle>Payment Information</CardTitle>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSection("payment")}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Payment Methods</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user?.paymentMethods && user.paymentMethods.length > 0 ? (
                      user.paymentMethods.map((method) => (
                        <Badge key={method} variant="outline" className="text-xs">
                          {method === 'credit_card' ? 'Credit Card' :
                           method === 'paypal' ? 'PayPal' :
                           method === 'apple_pay' ? 'Apple Pay' :
                           method === 'google_pay' ? 'Google Pay' : method}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-gray-500">No payment methods configured</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Setup Status</p>
                  <Badge variant={user?.paymentMethodSetup ? "default" : "secondary"} className="mt-2">
                    {user?.paymentMethodSetup ? "Setup Complete" : "Not Setup"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Modals */}
          <EditModal
            isOpen={editingSection === "personal"}
            onClose={() => setEditingSection(null)}
            title="Edit Personal Information"
          >
            <Form {...personalForm}>
              <form onSubmit={personalForm.handleSubmit((values) => updatePersonalMutation.mutate(values))} className="space-y-4">
                <FormField
                  control={personalForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} type="tel" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormDescription>Brief description about yourself (max 500 characters)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={personalForm.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Picture URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/your-image.jpg" />
                      </FormControl>
                      <FormDescription>Optional: Enter an image URL or leave empty</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updatePersonalMutation.isPending}>
                    {updatePersonalMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </EditModal>

          <EditModal
            isOpen={editingSection === "address"}
            onClose={() => setEditingSection(null)}
            title="Edit Address Information"
          >
            <Form {...addressForm}>
              <form onSubmit={addressForm.handleSubmit((values) => updateAddressMutation.mutate(values))} className="space-y-4">
                <FormField
                  control={addressForm.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={addressForm.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment/Unit (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addressForm.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Province</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={addressForm.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={addressForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateAddressMutation.isPending}>
                    {updateAddressMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </EditModal>

          <EditModal
            isOpen={editingSection === "business"}
            onClose={() => setEditingSection(null)}
            title="Edit Business Information"
          >
            <Form {...businessForm}>
              <form onSubmit={businessForm.handleSubmit((values) => updateBusinessMutation.mutate(values))} className="space-y-4">
                <FormField
                  control={businessForm.control}
                  name="businessInfo.businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={businessForm.control}
                    name="businessInfo.businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                            <SelectItem value="Partnership">Partnership</SelectItem>
                            <SelectItem value="Corporation">Corporation</SelectItem>
                            <SelectItem value="LLC">LLC</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="businessInfo.industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Finance">Finance</SelectItem>
                            <SelectItem value="Education">Education</SelectItem>
                            <SelectItem value="Retail">Retail</SelectItem>
                            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={businessForm.control}
                    name="businessInfo.taxId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax ID</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={businessForm.control}
                    name="businessInfo.website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={businessForm.control}
                  name="businessInfo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="resize-none" />
                      </FormControl>
                      <FormDescription>Brief description of your business</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updateBusinessMutation.isPending}>
                    {updateBusinessMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </EditModal>

          <EditModal
            isOpen={editingSection === "payment"}
            onClose={() => setEditingSection(null)}
            title="Edit Payment Information"
          >
            <Form {...paymentForm}>
              <form onSubmit={paymentForm.handleSubmit((values) => updatePaymentMutation.mutate(values))} className="space-y-4">
                <FormField
                  control={paymentForm.control}
                  name="paymentMethods"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Methods</FormLabel>
                      <FormDescription>Select all payment methods you want to enable</FormDescription>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {[
                          { id: "credit_card", label: "Credit Card" },
                          { id: "paypal", label: "PayPal" },
                          { id: "apple_pay", label: "Apple Pay" },
                          { id: "google_pay", label: "Google Pay" },
                        ].map((method) => (
                          <FormItem key={method.id} className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(method.id)}
                                onCheckedChange={(checked) => {
                                  const currentMethods = field.value || [];
                                  if (checked) {
                                    field.onChange([...currentMethods, method.id]);
                                  } else {
                                    field.onChange(currentMethods.filter((m) => m !== method.id));
                                  }
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>{method.label}</FormLabel>
                            </div>
                          </FormItem>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={paymentForm.control}
                  name="paymentMethodSetup"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Payment Method Setup Complete</FormLabel>
                        <FormDescription>
                          Check this box if you have completed setting up your payment method
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setEditingSection(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={updatePaymentMutation.isPending}>
                    {updatePaymentMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </Form>
          </EditModal>
        </div>
      </div>
    </div>
  );
}