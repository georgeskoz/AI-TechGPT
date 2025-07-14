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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowLeft, ArrowRight, Save, CreditCard, Shield } from "lucide-react";

const paymentSchema = z.object({
  paymentMethod: z.string().optional(),
  paymentMethodSetup: z.boolean().optional(),
  paymentDetails: z.object({
    cardLast4: z.string().max(4, { message: "Last 4 digits only" }).optional().or(z.literal("")),
    cardBrand: z.string().max(20, { message: "Card brand must be less than 20 characters" }).optional().or(z.literal("")),
    paypalEmail: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal("")),
    applePayEnabled: z.boolean().optional(),
    googlePayEnabled: z.boolean().optional(),
  }).optional(),
});

export default function ProfilePayment() {
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
  
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: "",
      paymentMethodSetup: false,
      paymentDetails: {
        cardLast4: "",
        cardBrand: "",
        paypalEmail: "",
        applePayEnabled: false,
        googlePayEnabled: false,
      },
    },
  });
  
  // Update form values when user data is loaded
  useEffect(() => {
    if (user) {
      const paymentDetails = user.paymentDetails || {};
      form.reset({
        paymentMethod: user.paymentMethod || "",
        paymentMethodSetup: user.paymentMethodSetup || false,
        paymentDetails: {
          cardLast4: paymentDetails.cardLast4 || "",
          cardBrand: paymentDetails.cardBrand || "",
          paypalEmail: paymentDetails.paypalEmail || "",
          applePayEnabled: paymentDetails.applePayEnabled || false,
          googlePayEnabled: paymentDetails.googlePayEnabled || false,
        },
      });
    }
  }, [user, form.reset]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof paymentSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Payment information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update payment information",
        variant: "destructive",
      });
    },
  });

  const handlePrevious = () => {
    navigate(`/profile/${cleanUsername}/business`);
  };

  const handleNext = () => {
    navigate(`/profile/${cleanUsername}/review`);
  };

  const handleSave = () => {
    const values = form.getValues();
    updateProfileMutation.mutate(values);
  };

  const selectedPaymentMethod = form.watch("paymentMethod");
  
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
        title="Payment Information"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </CardTitle>
            <CardDescription>Configure your payment methods and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="credit_card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="apple_pay">Apple Pay</SelectItem>
                          <SelectItem value="google_pay">Google Pay</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
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

                {/* Credit Card Details */}
                {selectedPaymentMethod === "credit_card" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Credit Card Details</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="paymentDetails.cardBrand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Brand</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select card brand" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="visa">Visa</SelectItem>
                                <SelectItem value="mastercard">Mastercard</SelectItem>
                                <SelectItem value="amex">American Express</SelectItem>
                                <SelectItem value="discover">Discover</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="paymentDetails.cardLast4"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last 4 Digits</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="1234" 
                                maxLength={4} 
                                value={field.value || ""} 
                                onChange={field.onChange} 
                                name={field.name} 
                                ref={field.ref} 
                                onBlur={field.onBlur} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* PayPal Details */}
                {selectedPaymentMethod === "paypal" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">PayPal Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="paymentDetails.paypalEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>PayPal Email</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="your-paypal@email.com" 
                              type="email" 
                              value={field.value || ""} 
                              onChange={field.onChange} 
                              name={field.name} 
                              ref={field.ref} 
                              onBlur={field.onBlur} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Mobile Payment Options */}
                {(selectedPaymentMethod === "apple_pay" || selectedPaymentMethod === "google_pay") && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">Mobile Payment Settings</h3>
                    
                    <FormField
                      control={form.control}
                      name="paymentDetails.applePayEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Apple Pay Enabled</FormLabel>
                            <FormDescription>
                              Allow Apple Pay for payments
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentDetails.googlePayEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Google Pay Enabled</FormLabel>
                            <FormDescription>
                              Allow Google Pay for payments
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Your payment information is secure</p>
                    <p>All payment details are encrypted and stored securely according to PCI DSS standards.</p>
                  </div>
                </div>
                
                <div className="flex justify-between gap-4 mt-8">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous: Business
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
                    Next: Review
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