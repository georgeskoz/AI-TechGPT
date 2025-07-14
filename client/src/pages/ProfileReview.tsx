import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowLeft, Edit, User, MapPin, Building2, CreditCard, Check } from "lucide-react";

export default function ProfileReview() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  
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

  const handleEditPersonal = () => {
    navigate(`/profile/${cleanUsername}/personal`);
  };

  const handleEditAddress = () => {
    navigate(`/profile/${cleanUsername}/address`);
  };

  const handleEditBusiness = () => {
    navigate(`/profile/${cleanUsername}/business`);
  };

  const handleEditPayment = () => {
    navigate(`/profile/${cleanUsername}/payment`);
  };

  const handleFinish = () => {
    navigate(`/profile/${cleanUsername}`);
  };

  const handlePrevious = () => {
    navigate(`/profile/${cleanUsername}/payment`);
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
        title="Profile Review"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              Profile Review
            </CardTitle>
            <CardDescription>Review your information before finalizing your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* Personal Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold">Personal Information</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditPersonal}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user?.avatar || ""} alt={user?.fullName || ""} />
                    <AvatarFallback>
                      {user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.fullName || 'Not provided'}</p>
                    <p className="text-sm text-gray-600">{user?.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Phone:</span>
                    <p className="text-sm">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Password:</span>
                    <p className="text-sm">••••••••</p>
                  </div>
                </div>
              </div>
              
              {user?.bio && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700">Bio:</span>
                  <p className="text-sm mt-1">{user.bio}</p>
                </div>
              )}
            </div>

            {/* Address Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold">Address Information</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditAddress}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Street Address:</span>
                    <p className="text-sm">{user?.street || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Apartment/Unit:</span>
                    <p className="text-sm">{user?.apartment || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">City:</span>
                    <p className="text-sm">{user?.city || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">State/Province:</span>
                    <p className="text-sm">{user?.state || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Country:</span>
                    <p className="text-sm">{user?.country || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Postal Code:</span>
                    <p className="text-sm">{user?.zipCode || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold">Business Information</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditBusiness}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              {user?.businessInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Business Name:</span>
                      <p className="text-sm">{user.businessInfo.businessName || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Business Type:</span>
                      <p className="text-sm">{user.businessInfo.businessType || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Industry:</span>
                      <p className="text-sm">{user.businessInfo.industry || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Tax ID:</span>
                      <p className="text-sm">{user.businessInfo.taxId || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">Website:</span>
                      <p className="text-sm">{user.businessInfo.website || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  {user.businessInfo.description && (
                    <div className="col-span-2 mt-4">
                      <span className="text-sm font-medium text-gray-700">Description:</span>
                      <p className="text-sm mt-1">{user.businessInfo.description}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No business information provided</p>
              )}
            </div>

            {/* Payment Information Section */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-orange-600" />
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                </div>
                <Button variant="outline" size="sm" onClick={handleEditPayment}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Payment Methods:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
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
                        <p className="text-sm text-gray-500">No payment methods configured</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Setup Status:</span>
                    <Badge variant={user?.paymentMethodSetup ? "default" : "secondary"}>
                      {user?.paymentMethodSetup ? "Setup Complete" : "Not Setup"}
                    </Badge>
                  </div>
                </div>
                
                {user?.paymentDetails && (
                  <div className="space-y-2">
                    {user.paymentDetails.cardLast4 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Card:</span>
                        <p className="text-sm">•••• •••• •••• {user.paymentDetails.cardLast4}</p>
                      </div>
                    )}
                    {user.paymentDetails.paypalEmail && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">PayPal Email:</span>
                        <p className="text-sm">{user.paymentDetails.paypalEmail}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-between gap-4 mt-8">
              <Button 
                type="button"
                variant="outline"
                onClick={handlePrevious}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous: Payment
              </Button>
              
              <Button 
                type="button"
                onClick={handleFinish}
                className="flex-1"
              >
                <Check className="h-4 w-4 mr-2" />
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}