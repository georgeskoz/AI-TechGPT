import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key, 
  Lock, 
  Unlock,
  UserPlus,
  Settings,
  Crown,
  Globe,
  MapPin,
  Headphones,
  MessageSquare,
  ChevronDown,
  Search,
  Filter
} from "lucide-react";

interface Admin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'super_admin' | 'country_admin' | 'city_admin' | 'tech_support_admin' | 'customer_service_admin';
  country?: string;
  city?: string;
  region?: string;
  permissions: string[];
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdDate: string;
  department: string;
  avatar?: string;
}

const AdminManagement: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all-admins");
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [newAdmin, setNewAdmin] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer_service_admin",
    country: "",
    stateProvince: "",
    city: "",
    region: "",
    permissions: [] as string[],
    department: ""
  });

  const [admins] = useState<Admin[]>([
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@techgpt.com",
      role: "super_admin",
      permissions: ["all"],
      status: "active",
      lastLogin: "2025-01-10T08:30:00Z",
      createdDate: "2024-01-15",
      department: "Executive",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@techgpt.com",
      role: "country_admin",
      country: "United States",
      permissions: ["manage_users", "view_analytics", "manage_disputes"],
      status: "active",
      lastLogin: "2025-01-10T07:15:00Z",
      createdDate: "2024-02-20",
      department: "Operations"
    },
    {
      id: "3",
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@techgpt.com",
      role: "country_admin",
      country: "Canada",
      permissions: ["manage_users", "view_analytics", "manage_disputes"],
      status: "active",
      lastLogin: "2025-01-09T16:45:00Z",
      createdDate: "2024-02-22",
      department: "Operations"
    },
    {
      id: "4",
      firstName: "David",
      lastName: "Kim",
      email: "david.kim@techgpt.com",
      role: "city_admin",
      country: "United States",
      city: "San Francisco",
      region: "California",
      permissions: ["manage_local_users", "view_local_analytics"],
      status: "active",
      lastLogin: "2025-01-10T09:20:00Z",
      createdDate: "2024-03-10",
      department: "Regional Operations"
    },
    {
      id: "5",
      firstName: "Jessica",
      lastName: "Williams",
      email: "jessica.williams@techgpt.com",
      role: "tech_support_admin",
      country: "United States",
      city: "New York",
      region: "New York",
      permissions: ["manage_technicians", "resolve_technical_issues"],
      status: "active",
      lastLogin: "2025-01-10T10:00:00Z",
      createdDate: "2024-04-05",
      department: "Technical Support"
    },
    {
      id: "6",
      firstName: "Robert",
      lastName: "Brown",
      email: "robert.brown@techgpt.com",
      role: "customer_service_admin",
      country: "Canada",
      city: "Toronto",
      region: "Ontario",
      permissions: ["manage_customer_issues", "process_refunds"],
      status: "active",
      lastLogin: "2025-01-10T08:45:00Z",
      createdDate: "2024-05-15",
      department: "Customer Service"
    }
  ]);

  const roleHierarchy = {
    super_admin: {
      name: "Super Admin",
      level: 1,
      icon: Crown,
      color: "purple",
      description: "Full platform control and oversight",
      permissions: ["all"]
    },
    country_admin: {
      name: "Country Admin",
      level: 2,
      icon: Globe,
      color: "blue",
      description: "Manage operations within a specific country",
      permissions: ["manage_users", "view_analytics", "manage_disputes", "manage_payments"]
    },
    city_admin: {
      name: "City/Region Admin",
      level: 3,
      icon: MapPin,
      color: "green",
      description: "Oversee city or regional operations",
      permissions: ["manage_local_users", "view_local_analytics", "manage_local_disputes"]
    },
    tech_support_admin: {
      name: "Tech Support Admin",
      level: 4,
      icon: Headphones,
      color: "orange",
      description: "Handle technical issues and support requests",
      permissions: ["manage_technicians", "resolve_technical_issues", "view_support_metrics"]
    },
    customer_service_admin: {
      name: "Customer Service Admin",
      level: 5,
      icon: MessageSquare,
      color: "pink",
      description: "Manage customer relations and support",
      permissions: ["manage_customer_issues", "process_refunds", "view_customer_metrics"]
    }
  };

  const allPermissions = [
    { id: "all", name: "All Permissions", description: "Complete platform access" },
    { id: "manage_users", name: "Manage Users", description: "Add, edit, and remove users" },
    { id: "manage_technicians", name: "Manage Technicians", description: "Oversee service providers" },
    { id: "view_analytics", name: "View Analytics", description: "Access platform statistics" },
    { id: "manage_disputes", name: "Manage Disputes", description: "Handle dispute resolution" },
    { id: "manage_payments", name: "Manage Payments", description: "Process payments and refunds" },
    { id: "manage_local_users", name: "Manage Local Users", description: "Manage users in assigned region" },
    { id: "view_local_analytics", name: "View Local Analytics", description: "Access regional statistics" },
    { id: "manage_local_disputes", name: "Manage Local Disputes", description: "Handle regional disputes" },
    { id: "resolve_technical_issues", name: "Resolve Technical Issues", description: "Handle technical support" },
    { id: "manage_customer_issues", name: "Manage Customer Issues", description: "Handle customer support" },
    { id: "process_refunds", name: "Process Refunds", description: "Handle refund requests" },
    { id: "view_support_metrics", name: "View Support Metrics", description: "Access support analytics" },
    { id: "view_customer_metrics", name: "View Customer Metrics", description: "Access customer analytics" }
  ];

  const countries = [
    { value: "united_states", label: "United States" },
    { value: "canada", label: "Canada" }
  ];

  const statesProvinces = {
    united_states: [
      { value: "alabama", label: "Alabama" },
      { value: "alaska", label: "Alaska" },
      { value: "arizona", label: "Arizona" },
      { value: "arkansas", label: "Arkansas" },
      { value: "california", label: "California" },
      { value: "colorado", label: "Colorado" },
      { value: "connecticut", label: "Connecticut" },
      { value: "delaware", label: "Delaware" },
      { value: "florida", label: "Florida" },
      { value: "georgia", label: "Georgia" },
      { value: "hawaii", label: "Hawaii" },
      { value: "idaho", label: "Idaho" },
      { value: "illinois", label: "Illinois" },
      { value: "indiana", label: "Indiana" },
      { value: "iowa", label: "Iowa" },
      { value: "kansas", label: "Kansas" },
      { value: "kentucky", label: "Kentucky" },
      { value: "louisiana", label: "Louisiana" },
      { value: "maine", label: "Maine" },
      { value: "maryland", label: "Maryland" },
      { value: "massachusetts", label: "Massachusetts" },
      { value: "michigan", label: "Michigan" },
      { value: "minnesota", label: "Minnesota" },
      { value: "mississippi", label: "Mississippi" },
      { value: "missouri", label: "Missouri" },
      { value: "montana", label: "Montana" },
      { value: "nebraska", label: "Nebraska" },
      { value: "nevada", label: "Nevada" },
      { value: "new_hampshire", label: "New Hampshire" },
      { value: "new_jersey", label: "New Jersey" },
      { value: "new_mexico", label: "New Mexico" },
      { value: "new_york", label: "New York" },
      { value: "north_carolina", label: "North Carolina" },
      { value: "north_dakota", label: "North Dakota" },
      { value: "ohio", label: "Ohio" },
      { value: "oklahoma", label: "Oklahoma" },
      { value: "oregon", label: "Oregon" },
      { value: "pennsylvania", label: "Pennsylvania" },
      { value: "rhode_island", label: "Rhode Island" },
      { value: "south_carolina", label: "South Carolina" },
      { value: "south_dakota", label: "South Dakota" },
      { value: "tennessee", label: "Tennessee" },
      { value: "texas", label: "Texas" },
      { value: "utah", label: "Utah" },
      { value: "vermont", label: "Vermont" },
      { value: "virginia", label: "Virginia" },
      { value: "washington", label: "Washington" },
      { value: "west_virginia", label: "West Virginia" },
      { value: "wisconsin", label: "Wisconsin" },
      { value: "wyoming", label: "Wyoming" }
    ],
    canada: [
      { value: "alberta", label: "Alberta" },
      { value: "british_columbia", label: "British Columbia" },
      { value: "manitoba", label: "Manitoba" },
      { value: "new_brunswick", label: "New Brunswick" },
      { value: "newfoundland_and_labrador", label: "Newfoundland and Labrador" },
      { value: "northwest_territories", label: "Northwest Territories" },
      { value: "nova_scotia", label: "Nova Scotia" },
      { value: "nunavut", label: "Nunavut" },
      { value: "ontario", label: "Ontario" },
      { value: "prince_edward_island", label: "Prince Edward Island" },
      { value: "quebec", label: "Quebec" },
      { value: "saskatchewan", label: "Saskatchewan" },
      { value: "yukon", label: "Yukon" }
    ]
  };

  const cities = {
    united_states: [
      { value: "new_york_city", label: "New York City" },
      { value: "los_angeles", label: "Los Angeles" },
      { value: "chicago", label: "Chicago" },
      { value: "houston", label: "Houston" },
      { value: "phoenix", label: "Phoenix" },
      { value: "philadelphia", label: "Philadelphia" },
      { value: "san_antonio", label: "San Antonio" },
      { value: "san_diego", label: "San Diego" },
      { value: "dallas", label: "Dallas" },
      { value: "san_jose", label: "San Jose" },
      { value: "austin", label: "Austin" },
      { value: "jacksonville", label: "Jacksonville" },
      { value: "fort_worth", label: "Fort Worth" },
      { value: "columbus", label: "Columbus" },
      { value: "san_francisco", label: "San Francisco" },
      { value: "charlotte", label: "Charlotte" },
      { value: "indianapolis", label: "Indianapolis" },
      { value: "seattle", label: "Seattle" },
      { value: "denver", label: "Denver" },
      { value: "boston", label: "Boston" },
      { value: "el_paso", label: "El Paso" },
      { value: "detroit", label: "Detroit" },
      { value: "nashville", label: "Nashville" },
      { value: "portland", label: "Portland" },
      { value: "memphis", label: "Memphis" },
      { value: "oklahoma_city", label: "Oklahoma City" },
      { value: "las_vegas", label: "Las Vegas" },
      { value: "louisville", label: "Louisville" },
      { value: "baltimore", label: "Baltimore" },
      { value: "milwaukee", label: "Milwaukee" }
    ],
    canada: [
      { value: "toronto", label: "Toronto" },
      { value: "montreal", label: "Montreal" },
      { value: "calgary", label: "Calgary" },
      { value: "ottawa", label: "Ottawa" },
      { value: "edmonton", label: "Edmonton" },
      { value: "winnipeg", label: "Winnipeg" },
      { value: "mississauga", label: "Mississauga" },
      { value: "vancouver", label: "Vancouver" },
      { value: "brampton", label: "Brampton" },
      { value: "hamilton", label: "Hamilton" },
      { value: "quebec_city", label: "Quebec City" },
      { value: "surrey", label: "Surrey" },
      { value: "laval", label: "Laval" },
      { value: "halifax", label: "Halifax" },
      { value: "london", label: "London" },
      { value: "markham", label: "Markham" },
      { value: "vaughan", label: "Vaughan" },
      { value: "gatineau", label: "Gatineau" },
      { value: "longueuil", label: "Longueuil" },
      { value: "burnaby", label: "Burnaby" },
      { value: "saskatoon", label: "Saskatoon" },
      { value: "kitchener", label: "Kitchener" },
      { value: "windsor", label: "Windsor" },
      { value: "regina", label: "Regina" },
      { value: "richmond", label: "Richmond" },
      { value: "richmond_hill", label: "Richmond Hill" },
      { value: "oakville", label: "Oakville" },
      { value: "burlington", label: "Burlington" },
      { value: "greater_sudbury", label: "Greater Sudbury" },
      { value: "sherbrooke", label: "Sherbrooke" }
    ]
  };

  const departments = [
    { value: "executive", label: "Executive" },
    { value: "operations", label: "Operations" },
    { value: "regional_operations", label: "Regional Operations" },
    { value: "technical_support", label: "Technical Support" },
    { value: "customer_service", label: "Customer Service" },
    { value: "finance", label: "Finance" },
    { value: "marketing", label: "Marketing" },
    { value: "human_resources", label: "Human Resources" },
    { value: "legal_compliance", label: "Legal & Compliance" },
    { value: "product_development", label: "Product Development" },
    { value: "quality_assurance", label: "Quality Assurance" },
    { value: "business_development", label: "Business Development" }
  ];

  const handleAddAdmin = () => {
    if (!newAdmin.firstName || !newAdmin.lastName || !newAdmin.email || !newAdmin.role || !newAdmin.password || !newAdmin.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including password.",
        variant: "destructive",
      });
      return;
    }

    if (newAdmin.password !== newAdmin.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Password and confirm password do not match.",
        variant: "destructive",
      });
      return;
    }

    if (newAdmin.password.length < 8) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Admin Added Successfully",
      description: `${newAdmin.firstName} ${newAdmin.lastName} has been added as ${roleHierarchy[newAdmin.role as keyof typeof roleHierarchy].name}.`,
    });
    setShowAddDialog(false);
    setNewAdmin({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "customer_service_admin",
      country: "",
      stateProvince: "",
      city: "",
      region: "",
      permissions: [],
      department: ""
    });
  };

  const handleChangePassword = (adminId: string) => {
    toast({
      title: "Password Reset",
      description: "Password reset email has been sent to the administrator.",
    });
    setShowPasswordDialog(false);
  };

  const handleSuspendAdmin = (adminId: string) => {
    toast({
      title: "Admin Suspended",
      description: "The administrator has been suspended successfully.",
      variant: "destructive",
    });
  };

  const handleDeleteAdmin = (adminId: string) => {
    toast({
      title: "Admin Deleted",
      description: "The administrator has been removed from the system.",
      variant: "destructive",
    });
  };

  const getRolePermissions = (role: string) => {
    return roleHierarchy[role as keyof typeof roleHierarchy]?.permissions || [];
  };

  const handlePermissionToggle = (permissionId: string) => {
    setNewAdmin(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const getAvailablePermissions = (role: string) => {
    const rolePermissions = getRolePermissions(role);
    if (rolePermissions.includes("all")) {
      return allPermissions;
    }
    return allPermissions.filter(p => rolePermissions.includes(p.id));
  };

  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = `${admin.firstName} ${admin.lastName} ${admin.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Management</h2>
          <p className="text-gray-600 mt-1">Manage administrator accounts and permissions</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Administrator</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newAdmin.firstName}
                    onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newAdmin.lastName}
                    onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                    placeholder="Enter password"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={newAdmin.confirmPassword}
                    onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
                    placeholder="Confirm password"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Admin Role</Label>
                <Select value={newAdmin.role} onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select admin role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleHierarchy).map(([key, role]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center space-x-2">
                          <role.icon className="h-4 w-4" />
                          <span>{role.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(newAdmin.role === "country_admin" || newAdmin.role === "city_admin" || newAdmin.role === "tech_support_admin" || newAdmin.role === "customer_service_admin") && (
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Select value={newAdmin.country} onValueChange={(value) => setNewAdmin({...newAdmin, country: value, stateProvince: "", city: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(newAdmin.role === "city_admin" || newAdmin.role === "tech_support_admin" || newAdmin.role === "customer_service_admin") && newAdmin.country && (
                <div>
                  <Label htmlFor="stateProvince">State/Province</Label>
                  <Select value={newAdmin.stateProvince} onValueChange={(value) => setNewAdmin({...newAdmin, stateProvince: value, city: ""})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state/province" />
                    </SelectTrigger>
                    <SelectContent>
                      {statesProvinces[newAdmin.country as keyof typeof statesProvinces]?.map((stateProvince) => (
                        <SelectItem key={stateProvince.value} value={stateProvince.value}>
                          {stateProvince.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {(newAdmin.role === "city_admin" || newAdmin.role === "tech_support_admin" || newAdmin.role === "customer_service_admin") && newAdmin.country && (
                <div>
                  <Label htmlFor="city">City</Label>
                  <Select value={newAdmin.city} onValueChange={(value) => setNewAdmin({...newAdmin, city: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities[newAdmin.country as keyof typeof cities]?.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <Label htmlFor="department">Department</Label>
                <Select value={newAdmin.department} onValueChange={(value) => setNewAdmin({...newAdmin, department: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.value} value={department.value}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Permissions</Label>
                <div className="grid grid-cols-1 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {getAvailablePermissions(newAdmin.role).map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer"
                         onClick={() => handlePermissionToggle(permission.id)}>
                      <input
                        type="checkbox"
                        checked={newAdmin.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">{permission.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{permission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAdmin}>
                  Add Administrator
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all-admins">All Admins</TabsTrigger>
          <TabsTrigger value="hierarchy">Admin Hierarchy</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="all-admins" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search administrators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {Object.entries(roleHierarchy).map(([key, role]) => (
                  <SelectItem key={key} value={key}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Administrator Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => {
                    const roleData = roleHierarchy[admin.role];
                    return (
                      <TableRow key={admin.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <roleData.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="font-medium">{admin.firstName} {admin.lastName}</div>
                              <div className="text-sm text-gray-600">{admin.department}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-${roleData.color}-600 border-${roleData.color}-300`}>
                            {roleData.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {admin.country && <div>{admin.country}</div>}
                            {admin.city && <div className="text-gray-600">{admin.city}</div>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={admin.status === 'active' ? 'default' : 'secondary'}>
                            {admin.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatLastLogin(admin.lastLogin)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedAdmin(admin)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowPasswordDialog(true)}
                            >
                              <Key className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuspendAdmin(admin.id)}
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hierarchy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Hierarchy Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(roleHierarchy).map(([key, role]) => (
                  <div key={key} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 bg-${role.color}-100 rounded-lg flex items-center justify-center`}>
                          <role.icon className={`h-5 w-5 text-${role.color}-600`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{role.name}</h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Level {role.level}</div>
                        <div className="text-sm font-medium">
                          {admins.filter(admin => admin.role === key).length} admins
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Permissions:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {role.permissions.map((permission) => {
                          const permissionData = allPermissions.find(p => p.id === permission);
                          return permissionData ? (
                            <div key={permission} className="flex items-center space-x-2 text-sm">
                              <Shield className="h-3 w-3 text-blue-600" />
                              <span>{permissionData.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 border-b">Permission</th>
                      {Object.entries(roleHierarchy).map(([key, role]) => (
                        <th key={key} className="text-center p-3 border-b">
                          <div className="flex flex-col items-center">
                            <role.icon className="h-4 w-4 mb-1" />
                            <span className="text-xs">{role.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allPermissions.map((permission) => (
                      <tr key={permission.id}>
                        <td className="p-3 border-b">
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-sm text-gray-600">{permission.description}</div>
                          </div>
                        </td>
                        {Object.entries(roleHierarchy).map(([key, role]) => (
                          <td key={key} className="text-center p-3 border-b">
                            {role.permissions.includes(permission.id) || role.permissions.includes("all") ? (
                              <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                                <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                              </div>
                            ) : (
                              <div className="h-6 w-6 bg-gray-100 rounded-full mx-auto"></div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Admin Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { admin: "Sarah Johnson", action: "Updated system settings", time: "2 hours ago", type: "update" },
                  { admin: "Michael Chen", action: "Added new user: john.doe@email.com", time: "4 hours ago", type: "create" },
                  { admin: "Emily Rodriguez", action: "Resolved dispute #1234", time: "6 hours ago", type: "resolve" },
                  { admin: "David Kim", action: "Approved technician application", time: "8 hours ago", type: "approve" },
                  { admin: "Jessica Williams", action: "Updated pricing rules", time: "12 hours ago", type: "update" },
                  { admin: "Robert Brown", action: "Processed refund for customer", time: "1 day ago", type: "refund" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{activity.admin}</p>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Reset Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Administrator Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to reset the password for this administrator? 
              A password reset email will be sent to their registered email address.
            </p>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => handleChangePassword("selected-admin-id")}>
                Send Reset Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminManagement;