import { User } from "@shared/schema";

export function isProfileComplete(user: User | null): boolean {
  if (!user) return false;
  
  // Check if basic profile information is completed
  const hasBasicInfo = user.fullName && user.email && user.phone;
  
  // Check if at least some address information is provided
  const hasAddress = user.street && user.city && user.state && user.country;
  
  // Don't require business info as it's optional
  // Don't require payment info as it's optional
  
  return !!(hasBasicInfo && hasAddress);
}

export function getProfileCompletionStatus(user: User | null): {
  isComplete: boolean;
  missingFields: string[];
  completionPercentage: number;
} {
  if (!user) {
    return {
      isComplete: false,
      missingFields: ['All fields'],
      completionPercentage: 0
    };
  }
  
  const requiredFields = [
    { field: 'fullName', label: 'Full Name' },
    { field: 'email', label: 'Email' },
    { field: 'phone', label: 'Phone' },
    { field: 'street', label: 'Street Address' },
    { field: 'city', label: 'City' },
    { field: 'state', label: 'State/Province' },
    { field: 'country', label: 'Country' },
  ];
  
  const missingFields: string[] = [];
  let completedFields = 0;
  
  requiredFields.forEach(({ field, label }) => {
    if (user[field as keyof User]) {
      completedFields++;
    } else {
      missingFields.push(label);
    }
  });
  
  const completionPercentage = Math.round((completedFields / requiredFields.length) * 100);
  const isComplete = missingFields.length === 0;
  
  return {
    isComplete,
    missingFields,
    completionPercentage
  };
}