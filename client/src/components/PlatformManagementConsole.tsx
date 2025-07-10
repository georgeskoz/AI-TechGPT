import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  Globe, 
  DollarSign, 
  FileText, 
  Users, 
  Shield, 
  Bell, 
  Mail, 
  Database, 
  Server, 
  Cloud, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  RefreshCw, 
  Download, 
  Upload, 
  Search, 
  Filter, 
  Eye, 
  EyeOff,
  Calculator,
  Percent,
  MapPin,
  Flag,
  Building,
  CreditCard,
  Receipt,
  Calendar,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

// Types for Platform Management
interface TaxJurisdiction {
  id: string;
  country: string;
  countryCode: string;
  state?: string;
  stateCode?: string;
  province?: string;
  provinceCode?: string;
  taxType: 'GST' | 'PST' | 'HST' | 'VAT' | 'Sales Tax' | 'Service Tax';
  taxRate: number;
  isActive: boolean;
  appliesTo: ('service_providers' | 'customers')[];
  exemptions: string[];
  effectiveDate: Date;
  lastUpdated: Date;
  description: string;
}

interface PlatformSettings {
  id: string;
  category: 'general' | 'payments' | 'taxes' | 'notifications' | 'security' | 'api' | 'integration';
  key: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json' | 'array';
  description: string;
  isRequired: boolean;
  isSecret: boolean;
  lastUpdated: Date;
  updatedBy: string;
}

interface AdminPanelConfig {
  id: string;
  section: string;
  title: string;
  description: string;
  isEnabled: boolean;
  permissions: string[];
  icon: string;
  order: number;
  settings: Record<string, any>;
}

export default function PlatformManagementConsole() {
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [editingTax, setEditingTax] = useState<TaxJurisdiction | null>(null);
  const [editingSetting, setEditingSetting] = useState<PlatformSettings | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch platform settings
  const { data: platformSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ['/api/admin/platform-settings'],
    queryFn: () => apiRequest('GET', '/api/admin/platform-settings').then(res => res.json())
  });

  // Fetch tax jurisdictions
  const { data: taxJurisdictions, isLoading: taxLoading } = useQuery({
    queryKey: ['/api/admin/tax-jurisdictions'],
    queryFn: () => apiRequest('GET', '/api/admin/tax-jurisdictions').then(res => res.json())
  });

  // Fetch admin panel config
  const { data: adminConfig, isLoading: configLoading } = useQuery({
    queryKey: ['/api/admin/panel-config'],
    queryFn: () => apiRequest('GET', '/api/admin/panel-config').then(res => res.json())
  });

  // Update platform setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: (data: Partial<PlatformSettings>) => 
      apiRequest('PUT', `/api/admin/platform-settings/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/platform-settings'] });
      toast({ title: 'Setting updated successfully' });
      setEditingSetting(null);
    },
    onError: () => {
      toast({ title: 'Failed to update setting', variant: 'destructive' });
    }
  });

  // Update tax jurisdiction mutation
  const updateTaxMutation = useMutation({
    mutationFn: (data: Partial<TaxJurisdiction>) => 
      apiRequest('PUT', `/api/admin/tax-jurisdictions/${data.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tax-jurisdictions'] });
      toast({ title: 'Tax jurisdiction updated successfully' });
      setEditingTax(null);
    },
    onError: () => {
      toast({ title: 'Failed to update tax jurisdiction', variant: 'destructive' });
    }
  });

  // Create tax jurisdiction mutation
  const createTaxMutation = useMutation({
    mutationFn: (data: Omit<TaxJurisdiction, 'id'>) => 
      apiRequest('POST', '/api/admin/tax-jurisdictions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tax-jurisdictions'] });
      toast({ title: 'Tax jurisdiction created successfully' });
      setEditingTax(null);
    },
    onError: () => {
      toast({ title: 'Failed to create tax jurisdiction', variant: 'destructive' });
    }
  });

  // Filter functions
  const filteredSettings = platformSettings?.filter((setting: PlatformSettings) =>
    setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredTaxJurisdictions = taxJurisdictions?.filter((tax: TaxJurisdiction) =>
    tax.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.state?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tax.province?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'UK', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'BE', name: 'Belgium' }
  ];

  const usStates = [
    { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
    { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
    { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
    { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
    { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
    { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
    { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
    { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
    { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
    { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
    { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
    { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
    { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
    { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
    { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
    { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
    { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' }
  ];

  const canadianProvinces = [
    { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' }, { code: 'MB', name: 'Manitoba' },
    { code: 'NB', name: 'New Brunswick' }, { code: 'NL', name: 'Newfoundland and Labrador' },
    { code: 'NS', name: 'Nova Scotia' }, { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
    { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' }, { code: 'NT', name: 'Northwest Territories' },
    { code: 'NU', name: 'Nunavut' }, { code: 'YT', name: 'Yukon' }
  ];

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Platform Settings</h3>
          <p className="text-sm text-muted-foreground">Configure platform-wide settings and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
          >
            {showSecrets ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showSecrets ? 'Hide' : 'Show'} Secrets
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {settingsLoading ? (
          <div className="text-center py-8">Loading settings...</div>
        ) : (
          filteredSettings.map((setting: PlatformSettings) => (
            <Card key={setting.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{setting.key}</span>
                    {setting.isRequired && <Badge variant="destructive" className="text-xs">Required</Badge>}
                    {setting.isSecret && <Badge variant="secondary" className="text-xs">Secret</Badge>}
                    <Badge variant="outline" className="text-xs">{setting.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
                  <div className="mt-2">
                    {setting.isSecret && !showSecrets ? (
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">••••••••</span>
                    ) : (
                      <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                        {setting.dataType === 'json' ? JSON.stringify(setting.value, null, 2) : setting.value}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSetting(setting)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderTaxTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Tax Information Management</h3>
          <p className="text-sm text-muted-foreground">Manage tax rates and jurisdictions for countries, states, and provinces</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Tax Jurisdiction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Tax Jurisdiction</DialogTitle>
            </DialogHeader>
            <TaxJurisdictionForm
              onSubmit={(data) => createTaxMutation.mutate(data)}
              isLoading={createTaxMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {taxLoading ? (
          <div className="text-center py-8">Loading tax jurisdictions...</div>
        ) : (
          filteredTaxJurisdictions.map((tax: TaxJurisdiction) => (
            <Card key={tax.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {tax.country}
                      {tax.state && `, ${tax.state}`}
                      {tax.province && `, ${tax.province}`}
                    </span>
                    <Badge variant={tax.isActive ? 'default' : 'secondary'}>
                      {tax.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{tax.taxType}</Badge>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Tax Rate:</span>
                      <span className="ml-2 font-medium">{tax.taxRate}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Applies To:</span>
                      <span className="ml-2">
                        {tax.appliesTo.map(type => 
                          type === 'service_providers' ? 'Service Providers' : 'Customers'
                        ).join(', ')}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{tax.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTax(tax)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateTaxMutation.mutate({ ...tax, isActive: !tax.isActive })}
                  >
                    {tax.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  const renderAdminPanelTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Admin Panel Configuration</h3>
        <p className="text-sm text-muted-foreground">Configure admin panel sections, permissions, and layout</p>
      </div>

      <div className="grid gap-4">
        {configLoading ? (
          <div className="text-center py-8">Loading admin panel configuration...</div>
        ) : (
          adminConfig?.map((config: AdminPanelConfig) => (
            <Card key={config.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{config.title}</span>
                    <Badge variant={config.isEnabled ? 'default' : 'secondary'}>
                      {config.isEnabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{config.section}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{config.description}</p>
                  <div className="mt-2">
                    <span className="text-xs text-muted-foreground">
                      Permissions: {config.permissions.join(', ')}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <span>Platform Management Console</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure platform settings, tax information, and admin panel preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Platform Settings</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Tax Information</span>
          </TabsTrigger>
          <TabsTrigger value="admin-panel" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Admin Panel</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          {renderSettingsTab()}
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          {renderTaxTab()}
        </TabsContent>

        <TabsContent value="admin-panel" className="space-y-6">
          {renderAdminPanelTab()}
        </TabsContent>
      </Tabs>

      {/* Edit Setting Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
          </DialogHeader>
          {editingSetting && (
            <SettingForm
              setting={editingSetting}
              onSubmit={(data) => updateSettingMutation.mutate(data)}
              isLoading={updateSettingMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Tax Jurisdiction Dialog */}
      <Dialog open={!!editingTax} onOpenChange={() => setEditingTax(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tax Jurisdiction</DialogTitle>
          </DialogHeader>
          {editingTax && (
            <TaxJurisdictionForm
              taxJurisdiction={editingTax}
              onSubmit={(data) => updateTaxMutation.mutate(data)}
              isLoading={updateTaxMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Setting Form Component
function SettingForm({ 
  setting, 
  onSubmit, 
  isLoading 
}: { 
  setting: PlatformSettings; 
  onSubmit: (data: Partial<PlatformSettings>) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    value: setting.value,
    description: setting.description
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...setting, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="value">Value</Label>
        {setting.dataType === 'boolean' ? (
          <Switch
            checked={formData.value === 'true'}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, value: checked.toString() }))}
          />
        ) : setting.dataType === 'json' ? (
          <Textarea
            id="value"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            rows={6}
            className="font-mono"
          />
        ) : (
          <Input
            id="value"
            type={setting.dataType === 'number' ? 'number' : 'text'}
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            required={setting.isRequired}
          />
        )}
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}

// Tax Jurisdiction Form Component
function TaxJurisdictionForm({ 
  taxJurisdiction, 
  onSubmit, 
  isLoading 
}: { 
  taxJurisdiction?: TaxJurisdiction; 
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    country: taxJurisdiction?.country || '',
    countryCode: taxJurisdiction?.countryCode || '',
    state: taxJurisdiction?.state || '',
    stateCode: taxJurisdiction?.stateCode || '',
    province: taxJurisdiction?.province || '',
    provinceCode: taxJurisdiction?.provinceCode || '',
    taxType: taxJurisdiction?.taxType || 'Sales Tax',
    taxRate: taxJurisdiction?.taxRate || 0,
    isActive: taxJurisdiction?.isActive ?? true,
    appliesTo: taxJurisdiction?.appliesTo || ['customers'],
    description: taxJurisdiction?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taxJurisdiction ? { ...taxJurisdiction, ...formData } : formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="countryCode">Country Code</Label>
          <Input
            id="countryCode"
            value={formData.countryCode}
            onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="state">State (Optional)</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="province">Province (Optional)</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => setFormData(prev => ({ ...prev, province: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxType">Tax Type</Label>
          <Select value={formData.taxType} onValueChange={(value) => setFormData(prev => ({ ...prev, taxType: value as any }))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GST">GST</SelectItem>
              <SelectItem value="PST">PST</SelectItem>
              <SelectItem value="HST">HST</SelectItem>
              <SelectItem value="VAT">VAT</SelectItem>
              <SelectItem value="Sales Tax">Sales Tax</SelectItem>
              <SelectItem value="Service Tax">Service Tax</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="taxRate">Tax Rate (%)</Label>
          <Input
            id="taxRate"
            type="number"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
            required
          />
        </div>
      </div>

      <div>
        <Label>Applies To</Label>
        <div className="flex space-x-4 mt-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.appliesTo.includes('customers')}
              onChange={(e) => {
                const appliesTo = e.target.checked
                  ? [...formData.appliesTo, 'customers']
                  : formData.appliesTo.filter(t => t !== 'customers');
                setFormData(prev => ({ ...prev, appliesTo }));
              }}
            />
            <span>Customers</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.appliesTo.includes('service_providers')}
              onChange={(e) => {
                const appliesTo = e.target.checked
                  ? [...formData.appliesTo, 'service_providers']
                  : formData.appliesTo.filter(t => t !== 'service_providers');
                setFormData(prev => ({ ...prev, appliesTo }));
              }}
            />
            <span>Service Providers</span>
          </label>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
        />
        <Label>Active</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          {taxJurisdiction ? 'Update' : 'Create'} Tax Jurisdiction
        </Button>
      </div>
    </form>
  );
}