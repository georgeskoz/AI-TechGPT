import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, queryClient } from "@tanstack/react-query";
import { insertTechnicianSchema, type InsertTechnician } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, UserCheck, Settings, Calendar, MapPin, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TechnicianRegistrationProps {
  userId: number;
  onRegistrationComplete: () => void;
}

export default function TechnicianRegistration({ userId, onRegistrationComplete }: TechnicianRegistrationProps) {
  const { toast } = useToast();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newCertification, setNewCertification] = useState("");

  const form = useForm<InsertTechnician>({
    resolver: zodResolver(insertTechnicianSchema),
    defaultValues: {
      userId,
      experience: "intermediate",
      hourlyRate: "75.00",
      serviceRadius: 25,
      skills: [],
      certifications: [],
      availability: {
        monday: { start: "09:00", end: "17:00", available: true },
        tuesday: { start: "09:00", end: "17:00", available: true },
        wednesday: { start: "09:00", end: "17:00", available: true },
        thursday: { start: "09:00", end: "17:00", available: true },
        friday: { start: "09:00", end: "17:00", available: true },
        saturday: { start: "10:00", end: "16:00", available: false },
        sunday: { start: "10:00", end: "16:00", available: false },
      },
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: InsertTechnician) => {
      const response = await apiRequest("POST", "/api/technicians", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Your technician profile has been created successfully!",
      });
      onRegistrationComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create technician profile",
        variant: "destructive",
      });
    },
  });

  const handleAddSkill = () => {
    if (newSkill.trim() && !selectedSkills.includes(newSkill.trim())) {
      const updatedSkills = [...selectedSkills, newSkill.trim()];
      setSelectedSkills(updatedSkills);
      form.setValue("skills", updatedSkills);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const updatedSkills = selectedSkills.filter(s => s !== skill);
    setSelectedSkills(updatedSkills);
    form.setValue("skills", updatedSkills);
  };

  const handleAddCertification = () => {
    if (newCertification.trim() && !selectedCertifications.includes(newCertification.trim())) {
      const updatedCerts = [...selectedCertifications, newCertification.trim()];
      setSelectedCertifications(updatedCerts);
      form.setValue("certifications", updatedCerts);
      setNewCertification("");
    }
  };

  const handleRemoveCertification = (cert: string) => {
    const updatedCerts = selectedCertifications.filter(c => c !== cert);
    setSelectedCertifications(updatedCerts);
    form.setValue("certifications", updatedCerts);
  };

  const onSubmit = (data: InsertTechnician) => {
    registerMutation.mutate({
      ...data,
      skills: selectedSkills,
      certifications: selectedCertifications,
    });
  };

  const commonSkills = [
    "Web Development", "Hardware Repair", "Network Setup", "Database Administration",
    "Mobile Device Repair", "Security Auditing", "System Administration", "Software Installation",
    "Data Recovery", "Cloud Services", "DevOps", "Technical Writing",
    "Computer Building", "Printer Setup", "WiFi Configuration", "Email Setup"
  ];

  const commonCertifications = [
    "CompTIA A+", "CompTIA Network+", "CompTIA Security+", "Cisco CCNA",
    "Microsoft Azure", "AWS Certified", "Google Cloud Professional", "Apple Certified",
    "Linux Professional", "VMware Certified", "ITIL Foundation", "PMP"
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <UserCheck className="h-6 w-6 text-blue-600" />
            Become a TechGPT Technician
          </CardTitle>
          <CardDescription>
            Join our marketplace and start earning by helping customers with their technical needs
          </CardDescription>
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name (Optional)</Label>
                    <Input
                      id="companyName"
                      {...form.register("companyName")}
                      placeholder="Your Company LLC"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select
                      value={form.watch("experience")}
                      onValueChange={(value) => form.setValue("experience", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                        <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                        <SelectItem value="advanced">Advanced (5-10 years)</SelectItem>
                        <SelectItem value="expert">Expert (10+ years)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    {...form.register("location")}
                    placeholder="City, State"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="serviceRadius">Service Radius (miles)</Label>
                  <Input
                    id="serviceRadius"
                    type="number"
                    {...form.register("serviceRadius", { valueAsNumber: true })}
                    placeholder="25"
                    min="5"
                    max="100"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills & Certifications</CardTitle>
                <CardDescription>
                  Add your technical skills and certifications to help customers find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Skills Section */}
                <div>
                  <Label>Technical Skills</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                    />
                    <Button type="button" onClick={handleAddSkill}>Add</Button>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Common Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonSkills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => {
                            if (!selectedSkills.includes(skill)) {
                              const updatedSkills = [...selectedSkills, skill];
                              setSelectedSkills(updatedSkills);
                              form.setValue("skills", updatedSkills);
                            }
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedSkills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Your Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <Badge
                            key={skill}
                            className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                          >
                            {skill}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-2 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Certifications Section */}
                <div>
                  <Label>Certifications</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Add a certification..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCertification())}
                    />
                    <Button type="button" onClick={handleAddCertification}>Add</Button>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-gray-600 mb-2">Common Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {commonCertifications.map((cert) => (
                        <Badge
                          key={cert}
                          variant="outline"
                          className="cursor-pointer hover:bg-green-50"
                          onClick={() => {
                            if (!selectedCertifications.includes(cert)) {
                              const updatedCerts = [...selectedCertifications, cert];
                              setSelectedCertifications(updatedCerts);
                              form.setValue("certifications", updatedCerts);
                            }
                          }}
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedCertifications.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Your Certifications:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCertifications.map((cert) => (
                          <Badge
                            key={cert}
                            className="bg-green-100 text-green-800 hover:bg-green-200"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(cert)}
                              className="ml-2 hover:text-red-600"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Weekly Availability
                </CardTitle>
                <CardDescription>
                  Set your working hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => (
                    <div key={day} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-20">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.watch(`availability.${day}.available` as any) || false}
                          onChange={(e) => {
                            form.setValue(`availability.${day}.available` as any, e.target.checked);
                          }}
                        />
                        <Label className="text-sm">Available</Label>
                      </div>
                      {form.watch(`availability.${day}.available` as any) && (
                        <>
                          <Input
                            type="time"
                            className="w-32"
                            {...form.register(`availability.${day}.start` as any)}
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            className="w-32"
                            {...form.register(`availability.${day}.end` as any)}
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing Information
                </CardTitle>
                <CardDescription>
                  Set your base hourly rate for technical services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="hourlyRate">Hourly Rate ($USD)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    {...form.register("hourlyRate")}
                    placeholder="75.00"
                    required
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    This is your base rate. Final pricing may include additional factors like urgency, time of day, and travel distance.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardContent className="pt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Creating Profile..." : "Complete Registration"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}