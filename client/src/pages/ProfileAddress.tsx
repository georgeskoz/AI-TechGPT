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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowRight, ArrowLeft, Save, MapPin } from "lucide-react";

const addressSchema = z.object({
  phone: z.string().max(20, { message: "Phone number must be less than 20 characters" }).optional().or(z.literal("")),
  street: z.string().max(100, { message: "Street address must be less than 100 characters" }).optional().or(z.literal("")),
  apartment: z.string().max(20, { message: "Apartment number must be less than 20 characters" }).optional().or(z.literal("")),
  city: z.string().max(50, { message: "City must be less than 50 characters" }).optional().or(z.literal("")),
  state: z.string().max(50, { message: "State/Province must be less than 50 characters" }).optional().or(z.literal("")),
  zipCode: z.string().max(20, { message: "Zip/Postal code must be less than 20 characters" }).optional().or(z.literal("")),
  country: z.string().max(50, { message: "Country must be less than 50 characters" }).optional().or(z.literal("")),
});

export default function ProfileAddress() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/users", username],
    queryFn: async () => {
      const res = await fetch(`/api/users/${username}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user data");
      }
      return res.json();
    },
  });
  
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      phone: "",
      street: "",
      apartment: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Canada",
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      form.reset({
        phone: user.phone || "",
        street: user.street || "",
        apartment: user.apartment || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        country: user.country || "Canada",
      });
    }
  }, [user, form.reset]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof addressSchema>) => {
      const response = await apiRequest(`/api/users/${username}/profile`, {
        method: "PUT",
        body: values,
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Address information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", username] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update address",
        variant: "destructive",
      });
    },
  });

  const handlePrevious = () => {
    navigate(`/profile/${username}/personal`);
  };

  const handleNext = () => {
    navigate(`/profile/${username}/business`);
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
        title="Address Information"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Address Information
            </CardTitle>
            <CardDescription>Update your contact and address details</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your phone number" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your country" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State/Province</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your state or province" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City/Region</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your city or region" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="street"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your street address" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apartment/Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="Apt, Unit, etc." value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip/Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter postal code" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-between gap-4 mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: Personal
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
                    Next: Business
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