// Abstract Auth Provider Interface
// This interface defines the contract that all auth providers must implement

export interface AuthUser {
  id: string;
  email: string;
  emailVerified?: boolean;
  name?: string;
  avatar?: string;
  provider: string;
  metadata?: Record<string, any>;
}

export interface AuthProfile {
  id: string;
  email: string;
  fullName?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  fullName?: string;
  metadata?: Record<string, any>;
}

export interface AuthResult {
  user: AuthUser;
  session?: any;
}

export interface AuthError {
  code: string;
  message: string;
  details?: any;
}

export abstract class AuthProvider {
  abstract readonly name: string;
  abstract readonly supportedFeatures: string[];

  // Core authentication methods
  abstract signInWithEmail(credentials: LoginCredentials): Promise<AuthResult>;
  abstract signUpWithEmail(credentials: SignupCredentials): Promise<AuthResult>;
  abstract signOut(): Promise<void>;
  
  // Profile management
  abstract fetchProfile(userId: string): Promise<AuthProfile>;
  abstract updateProfile(userId: string, updates: Partial<AuthProfile>): Promise<AuthProfile>;
  
  // Password management
  abstract resetPassword(email: string, options?: { redirectTo?: string }): Promise<{ success: boolean; message: string }>;
  abstract updatePassword(newPassword: string): Promise<{ success: boolean; message: string }>;
  
  // Session management
  abstract getCurrentUser(): Promise<AuthUser | null>;
  abstract getSession(): Promise<any>;
  abstract refreshSession(): Promise<any>;
  
  // Optional: Social auth (can be implemented by specific providers)
  signInWithGoogle?(): Promise<AuthResult>;
  signInWithApple?(): Promise<AuthResult>;
  signInWithFacebook?(): Promise<AuthResult>;
  
  // Optional: Additional features
  verifyEmail?(): Promise<{ success: boolean; message: string }>;
  resendVerification?(): Promise<{ success: boolean; message: string }>;
}