import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentMethodSelectorProps {
  selectedMethod: string | null;
  onMethodChange: (method: string) => void;
  onSetupComplete: (method: string, details: any) => void;
  isSetupComplete: boolean;
}

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
  onSetupComplete,
  isSetupComplete
}: PaymentMethodSelectorProps) {
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [currentSetupMethod, setCurrentSetupMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [paypalEmail, setPaypalEmail] = useState('');

  const paymentMethods = [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      description: 'Visa, MasterCard, American Express',
      icon: CreditCard,
      color: 'bg-blue-50 border-blue-200',
      fees: 'No additional fees'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay with your PayPal account',
      icon: Shield,
      color: 'bg-yellow-50 border-yellow-200',
      fees: 'Standard PayPal fees may apply'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      description: 'Touch ID or Face ID payment',
      icon: Smartphone,
      color: 'bg-gray-50 border-gray-200',
      fees: 'No additional fees'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      description: 'Quick payment with Google',
      icon: Smartphone,
      color: 'bg-green-50 border-green-200',
      fees: 'No additional fees'
    }
  ];

  const handleSetupMethod = (methodId: string) => {
    setCurrentSetupMethod(methodId);
    setShowSetupDialog(true);
  };

  const handleSetupComplete = () => {
    let details = {};
    
    if (currentSetupMethod === 'credit_card') {
      details = {
        cardLast4: cardDetails.number.slice(-4),
        cardBrand: getCardBrand(cardDetails.number),
        cardHolder: cardDetails.name
      };
    } else if (currentSetupMethod === 'paypal') {
      details = {
        paypalEmail: paypalEmail
      };
    } else if (currentSetupMethod === 'apple_pay') {
      details = {
        applePayEnabled: true
      };
    } else if (currentSetupMethod === 'google_pay') {
      details = {
        googlePayEnabled: true
      };
    }

    onSetupComplete(currentSetupMethod, details);
    setShowSetupDialog(false);
    setCardDetails({ number: '', expiry: '', cvv: '', name: '' });
    setPaypalEmail('');
  };

  const getCardBrand = (number: string) => {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'MasterCard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        {isSetupComplete && (
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Setup Complete
          </Badge>
        )}
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Required:</strong> You must configure a payment method before requesting technician services.
        </AlertDescription>
      </Alert>

      <RadioGroup value={selectedMethod || ''} onValueChange={onMethodChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            const isSelected = selectedMethod === method.id;
            
            return (
              <div key={method.id} className="relative">
                <RadioGroupItem
                  value={method.id}
                  id={method.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={method.id}
                  className={`flex flex-col cursor-pointer rounded-lg border-2 p-4 hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 ${method.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <span className="font-medium">{method.name}</span>
                    </div>
                    {isSelected && isSetupComplete && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                  <p className="text-xs text-gray-500">{method.fees}</p>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      {selectedMethod && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">
                {paymentMethods.find(m => m.id === selectedMethod)?.name} Configuration
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                {isSetupComplete ? 'Payment method is ready to use' : 'Complete setup to enable technician services'}
              </p>
            </div>
            <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant={isSetupComplete ? 'outline' : 'default'}
                  onClick={() => handleSetupMethod(selectedMethod)}
                >
                  {isSetupComplete ? 'Update' : 'Setup'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    Setup {paymentMethods.find(m => m.id === currentSetupMethod)?.name}
                  </DialogTitle>
                  <DialogDescription>
                    Configure your payment method to enable technician services.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  {currentSetupMethod === 'credit_card' && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                  
                  {currentSetupMethod === 'paypal' && (
                    <div>
                      <Label htmlFor="paypal-email">PayPal Email</Label>
                      <Input
                        id="paypal-email"
                        type="email"
                        placeholder="your@email.com"
                        value={paypalEmail}
                        onChange={(e) => setPaypalEmail(e.target.value)}
                      />
                    </div>
                  )}
                  
                  {(currentSetupMethod === 'apple_pay' || currentSetupMethod === 'google_pay') && (
                    <div className="text-center py-4">
                      <div className="text-sm text-gray-600 mb-4">
                        {currentSetupMethod === 'apple_pay' 
                          ? 'Apple Pay will be enabled for Touch ID/Face ID payments on compatible devices.'
                          : 'Google Pay will be enabled for quick payments through your Google account.'
                        }
                      </div>
                      <Alert>
                        <AlertDescription>
                          This will enable {currentSetupMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'} for your account.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 mt-6">
                  <Button variant="outline" onClick={() => setShowSetupDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSetupComplete}>
                    Complete Setup
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
}