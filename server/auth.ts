import { z } from "zod";
import bcrypt from "bcryptjs";

// Authentication schemas
export const loginSchema = z.object({
  emailOrUsername: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
});

export const socialLoginSchema = z.object({
  provider: z.enum(["google", "facebook", "apple", "instagram", "twitter", "github", "linkedin"]),
  userData: z.object({
    id: z.string(),
    email: z.string().email().optional(),
    name: z.string().optional(),
    username: z.string().optional(),
    avatar: z.string().url().optional(),
  }),
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().optional(),
  street: z.string().optional(),
  apartment: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("Canada"),
});

export type LoginData = z.infer<typeof loginSchema>;
export type SocialLoginData = z.infer<typeof socialLoginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;

// Password hashing utilities
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate username from social data
export const generateUsernameFromSocial = (userData: SocialLoginData['userData'], provider: string): string => {
  if (userData.username) {
    return `${userData.username}_${provider}`;
  }
  
  if (userData.email) {
    const emailPrefix = userData.email.split('@')[0];
    return `${emailPrefix}_${provider}`;
  }
  
  if (userData.name) {
    const nameSlug = userData.name.toLowerCase().replace(/\s+/g, '_');
    return `${nameSlug}_${provider}`;
  }
  
  return `user_${provider}_${userData.id.slice(0, 8)}`;
};

// Extract user info from social data
export const extractUserInfoFromSocial = (userData: SocialLoginData['userData']): {
  email?: string;
  fullName?: string;
  avatar?: string;
} => {
  return {
    email: userData.email,
    fullName: userData.name,
    avatar: userData.avatar,
  };
};