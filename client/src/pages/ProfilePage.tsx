import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowRight, User, MapPin, Building2, CreditCard } from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const [, navigate] = useLocation();
  
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

  const handleStartFlow = () => {
    navigate(`/profile/${username}/personal`);
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
        title="Profile Settings"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your profile information across multiple sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-8">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage 
                  src={user?.avatar || (() => {
                    try {
                      return localStorage.getItem(`techgpt_profile_picture_${username}`) || "";
                    } catch (error) {
                      return "";
                    }
                  })()} 
                  alt={user?.username} 
                />
                <AvatarFallback className="text-lg">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-xl font-semibold mb-2">{user?.fullName || username}</h2>
              <p className="text-gray-600 text-center">{user?.bio || "Complete your profile to get started"}</p>
            </div>

            <div className="grid gap-4 mb-8">
              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate(`/profile/${username}/personal`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">Personal Information</h3>
                      <p className="text-sm text-gray-600">Name, email, bio, and profile picture</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate(`/profile/${username}/address`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-6 w-6 text-green-600" />
                    <div>
                      <h3 className="font-semibold">Address Information</h3>
                      <p className="text-sm text-gray-600">Phone, street address, city, state, and postal code</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate(`/profile/${username}/business`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-6 w-6 text-purple-600" />
                    <div>
                      <h3 className="font-semibold">Business Information</h3>
                      <p className="text-sm text-gray-600">Company details, industry, and business description</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => navigate(`/profile/${username}/payment`)}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                    <div>
                      <h3 className="font-semibold">Payment Information</h3>
                      <p className="text-sm text-gray-600">Payment methods and billing preferences</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={handleStartFlow}
                className="w-full max-w-md"
              >
                Start Profile Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}