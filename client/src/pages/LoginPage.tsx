import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/components/UserAuthProvider";
import { Eye, EyeOff, Mail, Lock, LogIn, User, ArrowRight } from "lucide-react";
import { FaGoogle, FaFacebookF, FaApple, FaInstagram, FaTwitter, FaGithub, FaLinkedinIn } from "react-icons/fa";
import techGPTLogoPath from "@assets/image_1752537953157.png";

// Login form validation schema
const loginFormSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  // Helper function to determine redirect path based on user role
  const getRedirectPath = (userType: string) => {
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'technician':
      case 'service_provider':
        return '/technician-dashboard';
      case 'customer':
      default:
        return '/chat';
    }
  };

  // Regular email/password login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await apiRequest("POST", "/api/auth/login", data);
      return response.json();
    },
    onSuccess: (data) => {
      // Store user data in localStorage for backward compatibility
      localStorage.setItem("techgpt_username", data.username);
      localStorage.setItem("techgpt_user_id", data.id.toString());
      localStorage.setItem("techgpt_auth_method", data.authMethod || "email");
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Initialize auth context with user data
      login(data);
      
      toast({
        title: "Login Successful",
        description: "Welcome back to TechGPT!",
      });
      
      // Redirect based on user type
      const redirectPath = getRedirectPath(data.userType);
      setLocation(redirectPath);
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email/username or password",
        variant: "destructive",
      });
    },
  });

  // Social media login mutation
  const socialLoginMutation = useMutation({
    mutationFn: async ({ provider, mockData }: { provider: string; mockData: any }) => {
      // In a real app, this would integrate with actual OAuth providers
      // For now, we'll simulate the social login process
      console.log("Social login attempt:", { provider, userData: mockData });
      try {
        const response = await apiRequest("POST", "/api/auth/social-login", { provider, userData: mockData });
        const data = await response.json();
        console.log("Social login response:", data);
        return data;
      } catch (error) {
        console.error("Social login API error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Store user data in localStorage for backward compatibility
      localStorage.setItem("techgpt_username", data.username);
      localStorage.setItem("techgpt_user_id", data.id.toString());
      localStorage.setItem("techgpt_auth_method", data.authMethod);
      localStorage.setItem("currentUser", JSON.stringify(data));
      
      // Initialize auth context with user data
      login(data);
      
      toast({
        title: "Login Successful",
        description: `Welcome back via ${data.authMethod}!`,
      });
      
      // Redirect based on user type
      const redirectPath = getRedirectPath(data.userType);
      setLocation(redirectPath);
    },
    onError: (error: any) => {
      console.error("Social login error details:", error);
      toast({
        title: "Social Login Failed",
        description: error.message || "Social login failed. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would trigger OAuth flow
    // For demo purposes, we'll simulate with mock data
    const mockSocialData = {
      google: {
        id: "google_123456",
        email: "user@gmail.com",
        name: "Google User",
        avatar: "https://lh3.googleusercontent.com/a/default-user=s96-c",
      },
      facebook: {
        id: "facebook_789012",
        email: "user@facebook.com",
        name: "Facebook User",
        avatar: "https://graph.facebook.com/789012/picture?type=large",
      },
      apple: {
        id: "apple_345678",
        email: "user@privaterelay.appleid.com",
        name: "Apple User",
      },
      instagram: {
        id: "instagram_901234",
        username: "instagram_user",
        name: "Instagram User",
        avatar: "https://instagram.com/static/images/anonymousUser.jpg",
      },
      twitter: {
        id: "twitter_567890",
        username: "twitter_user",
        name: "Twitter User",
        avatar: "https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png",
      },
      github: {
        id: "github_123789",
        username: "github_user",
        name: "GitHub User",
        avatar: "https://github.com/identicons/github_user.png",
      },
      linkedin: {
        id: "linkedin_456123",
        email: "user@linkedin.com",
        name: "LinkedIn User",
        avatar: "https://static.licdn.com/scds/common/u/img/icon/default_profile_80x80.png",
      },
    };

    socialLoginMutation.mutate({
      provider,
      mockData: mockSocialData[provider as keyof typeof mockSocialData],
    });
  };

  const socialProviders = [
    { name: "Google", icon: FaGoogle, color: "bg-red-500 hover:bg-red-600", id: "google" },
    { name: "Facebook", icon: FaFacebookF, color: "bg-blue-600 hover:bg-blue-700", id: "facebook" },
    { name: "Apple", icon: FaApple, color: "bg-gray-900 hover:bg-gray-800", id: "apple" },
    { name: "Instagram", icon: FaInstagram, color: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600", id: "instagram" },
    { name: "Twitter", icon: FaTwitter, color: "bg-sky-500 hover:bg-sky-600", id: "twitter" },
    { name: "GitHub", icon: FaGithub, color: "bg-gray-800 hover:bg-gray-900", id: "github" },
    { name: "LinkedIn", icon: FaLinkedinIn, color: "bg-blue-700 hover:bg-blue-800", id: "linkedin" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white text-center py-6">
          <div className="flex items-center justify-center mb-2">
            <img 
              src={techGPTLogoPath} 
              alt="TechGPT Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-xl font-bold">Welcome Back</CardTitle>
          <p className="text-green-100 text-sm">Sign in to your account</p>
        </CardHeader>

        <CardContent className="p-8">
          {/* Social Login Options */}
          <div className="space-y-4 mb-6">
            <div className="text-center text-sm text-gray-600 mb-4">
              Continue with your social account
            </div>
            
            {/* Primary Social Providers */}
            <div className="grid grid-cols-3 gap-3">
              {socialProviders.slice(0, 3).map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className={`${provider.color} text-white border-0 hover:scale-105 transition-transform`}
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={socialLoginMutation.isPending}
                >
                  <provider.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>

            {/* Secondary Social Providers */}
            <div className="grid grid-cols-4 gap-2">
              {socialProviders.slice(3).map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  size="sm"
                  className={`${provider.color} text-white border-0 hover:scale-105 transition-transform`}
                  onClick={() => handleSocialLogin(provider.id)}
                  disabled={socialLoginMutation.isPending}
                >
                  <provider.icon className="h-3 w-3" />
                </Button>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email/Password Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="emailOrUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email or Username
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter your email or username"
                          className="pl-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={loginMutation.isPending}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="pl-10 pr-10 h-12 border-gray-300 focus:border-green-500 focus:ring-green-500"
                          disabled={loginMutation.isPending}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 h-12 rounded-lg font-semibold transition-colors"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <button
              className="text-sm text-green-600 hover:text-green-700 hover:underline"
              onClick={() => setLocation("/forgot-password")}
            >
              Forgot your password?
            </button>
            <div className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                className="text-green-600 hover:text-green-700 hover:underline font-medium"
                onClick={() => setLocation("/register")}
              >
                Sign up here
              </button>
            </div>
          </div>

          {/* Guest Access */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full text-gray-600 hover:text-gray-800 border-gray-300 hover:border-gray-400"
              onClick={() => setLocation("/chat")}
            >
              <User className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}