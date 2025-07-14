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
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowRight, ArrowLeft, Save, Building2 } from "lucide-react";

const businessSchema = z.object({
  businessInfo: z.object({
    businessName: z.string().max(100, { message: "Business name must be less than 100 characters" }).optional().or(z.literal("")),
    businessType: z.string().max(50, { message: "Business type must be less than 50 characters" }).optional().or(z.literal("")),
    industry: z.string().max(50, { message: "Industry must be less than 50 characters" }).optional().or(z.literal("")),
    taxId: z.string().max(50, { message: "Tax ID must be less than 50 characters" }).optional().or(z.literal("")),
    website: z.string().max(200, { message: "Website must be less than 200 characters" }).optional().or(z.literal("")),
    description: z.string().max(1000, { message: "Description must be less than 1000 characters" }).optional().or(z.literal("")),
  }).optional(),
});

export default function ProfileBusiness() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Clean username parameter to handle URL encoding issues
  const cleanUsername = username?.replace(/^"(.*)"$/, '$1') || username;
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", cleanUsername],
    queryFn: async () => {
      const res = await fetch(`/api/users/${encodeURIComponent(cleanUsername)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
  });
  
  const form = useForm<z.infer<typeof businessSchema>>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      businessInfo: {
        businessName: "",
        businessType: "",
        industry: "",
        taxId: "",
        website: "",
        description: "",
      },
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      const businessInfo = user.businessInfo || {};
      form.reset({
        businessInfo: {
          businessName: businessInfo.businessName || "",
          businessType: businessInfo.businessType || "",
          industry: businessInfo.industry || "",
          taxId: businessInfo.taxId || "",
          website: businessInfo.website || "",
          description: businessInfo.description || "",
        },
      });
    }
  }, [user, form.reset]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof businessSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Business information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update business information",
        variant: "destructive",
      });
    },
  });

  const handlePrevious = () => {
    navigate(`/profile/${cleanUsername}/address`);
  };

  const handleNext = async () => {
    // Validate the form first
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the data to database before navigating
    const values = form.getValues();
    try {
      await updateProfileMutation.mutateAsync(values);
      // Navigate only after successful save
      navigate(`/profile/${cleanUsername}/payment`);
    } catch (error) {
      // Error toast is already handled in the mutation
      console.error('Failed to save business data:', error);
    }
  };

  const handleSave = () => {
    const values = form.getValues();
    updateProfileMutation.mutate(values);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 border-solid rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleNavigation 
        showBackButton={true}
        title="Business Information"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Business Information
            </CardTitle>
            <CardDescription>Update your business details (optional for personal users)</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="businessInfo.businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your business name" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="businessInfo.businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., LLC, Corporation, Partnership" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="businessInfo.industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Technology, Healthcare, Retail" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="businessInfo.taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID / EIN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your tax identification number" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormDescription>
                        Your business tax identification number (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessInfo.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-website.com" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="businessInfo.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your business or services"
                          className="resize-none"
                          rows={4}
                          value={field.value || ""}
                          onChange={field.onChange}
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                        />
                      </FormControl>
                      <FormDescription>
                        Brief description of your business or services (max 1000 characters)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-between gap-4 mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: Address
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                    className="flex-1"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Next: Payment
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}