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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SimpleNavigation from "@/components/SimpleNavigation";
import { ArrowRight, Save, User, Upload, Camera } from "lucide-react";
import { Label } from "@/components/ui/label";

const personalInfoSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  fullName: z.string().max(100, { message: "Full name must be less than 100 characters" }).optional().or(z.literal("")),
  bio: z.string().max(500, { message: "Bio must be less than 500 characters" }).optional().or(z.literal("")),
  avatar: z.string().optional().or(z.literal("")),
});

export default function ProfilePersonalInfo() {
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
  
  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      email: "",
      fullName: "",
      bio: "",
      avatar: "",
    },
  });
  
  // Update form values when user data is loaded or from localStorage
  useEffect(() => {
    // Always try to load from localStorage first
    let localStorageAvatar = "";
    let localStorageFormData = null;
    try {
      localStorageAvatar = localStorage.getItem(`techgpt_profile_picture_${cleanUsername}`) || "";
      const savedFormData = localStorage.getItem(`techgpt_personal_info_${cleanUsername}`);
      localStorageFormData = savedFormData ? JSON.parse(savedFormData) : null;
    } catch (error) {
      console.warn('localStorage access error:', error);
    }
    
    // If we have localStorage data, use it even if user doesn't exist
    if (localStorageFormData) {
      form.reset({
        email: localStorageFormData.email || "",
        fullName: localStorageFormData.fullName || "",
        bio: localStorageFormData.bio || "",
        avatar: localStorageAvatar,
      });
    } else if (user) {
      // Otherwise use user data from database
      const avatarValue = user.avatar || localStorageAvatar || "";
      
      form.reset({
        email: user.email || "",
        fullName: user.fullName || "",
        bio: user.bio || "",
        avatar: avatarValue,
      });
    }
  }, [user, form.reset, cleanUsername]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      try {
        localStorage.setItem(`techgpt_personal_info_${cleanUsername}`, JSON.stringify({
          email: value.email || "",
          fullName: value.fullName || "",
          bio: value.bio || "",
        }));
      } catch (error) {
        console.warn('localStorage save error:', error);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, cleanUsername]);
  
  const updateProfileMutation = useMutation({
    mutationFn: async (values: z.infer<typeof personalInfoSchema>) => {
      const response = await apiRequest("PUT", `/api/users/${cleanUsername}/profile`, values);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Personal information updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users", cleanUsername] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataUrl = e.target?.result as string;
          
          // Compress the image to reduce size
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const img = new Image();
          
          img.onload = () => {
            // Resize to max 200x200 for profile pictures
            const maxSize = 200;
            let { width, height } = img;
            
            if (width > height) {
              if (width > maxSize) {
                height = height * (maxSize / width);
                width = maxSize;
              }
            } else {
              if (height > maxSize) {
                width = width * (maxSize / height);
                height = maxSize;
              }
            }
            
            canvas.width = width;
            canvas.height = height;
            ctx?.drawImage(img, 0, 0, width, height);
            
            // Convert to compressed format
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            
            // Update the avatar field in the form
            form.setValue('avatar', compressedDataUrl);
            
            // Try to store in localStorage with error handling
            try {
              localStorage.setItem(`techgpt_profile_picture_${cleanUsername}`, compressedDataUrl);
            } catch (storageError) {
              console.warn('localStorage quota exceeded, skipping local storage');
            }
            
            // Automatically save the profile with the new avatar
            const currentFormData = form.getValues();
            updateProfileMutation.mutate(currentFormData);
            
            toast({
              title: "Picture uploaded",
              description: "Profile picture has been uploaded and saved successfully.",
            });
          };
          
          img.src = imageDataUrl;
        };
        reader.readAsDataURL(file);
      }
    };
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  };

  const handleCameraCapture = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        
        // Create title
        const title = document.createElement('h2');
        title.textContent = 'Take a Live Photo';
        title.style.color = 'white';
        title.style.fontSize = '24px';
        title.style.fontWeight = 'bold';
        title.style.marginBottom = '20px';
        
        // Create video element
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.width = '400px';
        video.style.height = '300px';
        video.style.borderRadius = '12px';
        video.style.marginBottom = '20px';
        
        // Create canvas for capture
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create buttons container
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '12px';
        
        // Create capture button
        const captureButton = document.createElement('button');
        captureButton.textContent = '📸 Capture Photo';
        captureButton.style.padding = '12px 24px';
        captureButton.style.backgroundColor = '#3b82f6';
        captureButton.style.color = 'white';
        captureButton.style.border = 'none';
        captureButton.style.borderRadius = '8px';
        captureButton.style.cursor = 'pointer';
        captureButton.style.fontSize = '16px';
        captureButton.style.fontWeight = '500';

        // Create cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = '❌ Cancel';
        cancelButton.style.padding = '12px 24px';
        cancelButton.style.backgroundColor = '#6b7280';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '8px';
        cancelButton.style.cursor = 'pointer';
        cancelButton.style.fontSize = '16px';
        cancelButton.style.fontWeight = '500';

        // Add hover effects
        captureButton.addEventListener('mouseenter', () => {
          captureButton.style.backgroundColor = '#2563eb';
        });
        captureButton.addEventListener('mouseleave', () => {
          captureButton.style.backgroundColor = '#3b82f6';
        });

        cancelButton.addEventListener('mouseenter', () => {
          cancelButton.style.backgroundColor = '#4b5563';
        });
        cancelButton.addEventListener('mouseleave', () => {
          cancelButton.style.backgroundColor = '#6b7280';
        });

        // Add event listeners
        captureButton.addEventListener('click', () => {
          // Resize to max 200x200 for profile pictures
          const maxSize = 200;
          let { videoWidth: width, videoHeight: height } = video;
          
          if (width > height) {
            if (width > maxSize) {
              height = height * (maxSize / width);
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = width * (maxSize / height);
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(video, 0, 0, width, height);
          
          // Convert to compressed data URL
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          
          // Update the avatar field in the form
          form.setValue('avatar', imageDataUrl);
          
          // Try to store in localStorage with error handling
          try {
            localStorage.setItem(`techgpt_profile_picture_${cleanUsername}`, imageDataUrl);
          } catch (storageError) {
            console.warn('localStorage quota exceeded, skipping local storage');
          }
          
          // Automatically save the profile with the new avatar
          const currentFormData = form.getValues();
          updateProfileMutation.mutate(currentFormData);
          
          toast({
            title: "Photo captured",
            description: "Live photo has been captured and saved successfully.",
          });
          
          // Stop camera stream
          stream.getTracks().forEach(track => track.stop());
          
          // Remove overlay
          document.body.removeChild(overlay);
        });

        cancelButton.addEventListener('click', () => {
          // Stop camera stream
          stream.getTracks().forEach(track => track.stop());
          
          // Remove overlay
          document.body.removeChild(overlay);
        });

        // Assemble the UI
        buttonsContainer.appendChild(captureButton);
        buttonsContainer.appendChild(cancelButton);
        overlay.appendChild(title);
        overlay.appendChild(video);
        overlay.appendChild(buttonsContainer);
        document.body.appendChild(overlay);
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
        toast({
          title: "Camera access denied",
          description: "Unable to access camera. Please check permissions.",
          variant: "destructive",
        });
      });
  };

  const handleNext = () => {
    navigate(`/profile/${cleanUsername}/address`);
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
        title="Personal Information"
      />
      
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details and profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 mb-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage 
                    src={form.watch('avatar') || user?.avatar || (() => {
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
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleFileUpload}
                    className="flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Picture
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCameraCapture}
                    className="flex items-center gap-2"
                  >
                    <Camera className="h-4 w-4" />
                    Take Live Photo
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" type="email" value={field.value || ""} onChange={field.onChange} name={field.name} ref={field.ref} onBlur={field.onBlur} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself"
                              className="resize-none"
                              value={field.value || ""}
                              onChange={field.onChange}
                              name={field.name}
                              ref={field.ref}
                              onBlur={field.onBlur}
                            />
                          </FormControl>
                          <FormDescription>
                            Brief description about yourself (max 500 characters)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Profile Picture URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/your-image.jpg" 
                              value={field.value || ""} 
                              onChange={field.onChange} 
                              name={field.name} 
                              ref={field.ref} 
                              onBlur={field.onBlur} 
                            />
                          </FormControl>
                          <FormDescription>
                            Optional: Enter an image URL or leave empty
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-between gap-4 mt-8">
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
                        Next: Address
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}