import { useState } from 'react';
import RoleSwitcher, { 
  CustomerInterface, 
  ServiceProviderInterface, 
  AdministratorInterface 
} from '@/components/RoleSwitcher';

type UserRole = 'customer' | 'service_provider' | 'admin';

export default function MultiRoleInterface() {
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  const renderInterface = () => {
    switch (currentRole) {
      case 'customer':
        return <CustomerInterface />;
      case 'service_provider':
        return <ServiceProviderInterface />;
      case 'admin':
        return <AdministratorInterface />;
      default:
        return <CustomerInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <RoleSwitcher 
        currentRole={currentRole} 
        onRoleChange={setCurrentRole} 
      />
      {renderInterface()}
    </div>
  );
}