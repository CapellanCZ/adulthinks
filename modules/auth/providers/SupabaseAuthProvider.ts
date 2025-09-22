import { supabase } from "@/lib/supabase";
import { 
  AuthProvider, 
  AuthUser, 
  AuthProfile, 
  LoginCredentials, 
  SignupCredentials, 
  AuthResult 
} from "../interfaces/AuthProvider";

export class SupabaseAuthProvider extends AuthProvider {
  readonly name = "supabase";
  readonly supportedFeatures = [
    "email-password", 
    "password-reset", 
    "profile-management", 
    "session-management"
  ];

  async signInWithEmail(credentials: LoginCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });
      
      if (error) {
        console.error("Supabase login error:", error);
        
        // Convert email confirmation errors to invalid credentials message
        // This prevents revealing that the email exists but isn't confirmed
        if (error.message?.toLowerCase().includes("email not confirmed") ||
            error.message?.toLowerCase().includes("not confirmed") ||
            error.message?.toLowerCase().includes("confirm your email") ||
            error.message?.toLowerCase().includes("email confirmation") ||
            error.code === "email_not_confirmed") {
          throw new Error("Please check your email.");
        }
        
        // Convert authentication errors for existing accounts
        if (error.message?.toLowerCase().includes("invalid login credentials") ||
            error.message?.toLowerCase().includes("invalid credentials") ||
            error.message?.toLowerCase().includes("wrong password") ||
            error.code === "invalid_credentials") {
          throw new Error("Invalid user credentials.");
        }
        
        // For user not found errors, use different message
        if (error.message?.toLowerCase().includes("user not found") ||
            error.message?.toLowerCase().includes("no user found")) {
          throw new Error("No account found with this email address. Please check your email or create a new account.");
        }
        
        // Fallback for other errors
        throw error;
      }
      
      if (!data.user) throw new Error("Invalid user credentials.");

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        emailVerified: !!data.user.email_confirmed_at,
        provider: "supabase",
        metadata: data.user.user_metadata,
      };

      return { user, session: data.session };
    } catch (error: any) {
      // Final catch to ensure we don't leak email confirmation status
      if (error.message?.toLowerCase().includes("confirm") ||
          error.message?.toLowerCase().includes("verification")) {
        throw new Error("Invalid user credentials. Please check your email and password.");
      }
      throw error;
    }
  }

  async signUpWithEmail(credentials: SignupCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        // No metadata needed for basic signup - names can be added later
      });
      
      // If signup returns a user but no session, it means user already exists
      if (data?.user && !data?.session) {
        throw new Error("An account with this email already exists");
      }

      if (error) {
        console.error("Supabase signup error:", error);
        
        // Enhanced error handling for duplicate emails
        if (error.message?.toLowerCase().includes("already") || 
            error.message?.toLowerCase().includes("exists") ||
            error.message?.toLowerCase().includes("duplicate") ||
            error.message?.toLowerCase().includes("user_already_exists")) {
          throw new Error("An account with this email already exists");
        }
        
        throw error;
      }
      
      if (!data.user) throw new Error("Registration failed");
      
      // Check if this is actually a duplicate signup attempt
      // Supabase sometimes returns user data even for existing users
      if (data.user && !data.session) {
        // If there's a user but no session, it's likely a duplicate
        throw new Error("An account with this email already exists");
      }
      
      // Additional check: if user was created a while ago, it's a duplicate attempt
      if (data.user && data.user.created_at) {
        const createdAt = new Date(data.user.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - createdAt.getTime();
        
        // If user was created more than 10 seconds ago, it's likely a duplicate
        if (timeDiff > 10000) {
          throw new Error("An account with this email already exists");
        }
      }

      // Profile creation is handled automatically by the database trigger
      // The trigger creates a profile when a user is inserted into auth.users
      // No manual profile creation needed here

      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email!,
        emailVerified: !!data.user.email_confirmed_at,
        name: credentials.fullName,
        provider: "supabase",
        metadata: data.user.user_metadata,
      };

      return { user, session: data.session };
    } catch (error: any) {``
      console.error("Full signup error:", error);
      // Re-throw with more context
      throw new Error(`Database error saving new user: ${error.message || error}`);
    }
  }

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  async fetchProfile(userId: string): Promise<AuthProfile> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) throw error;
    
    // Map your actual table schema to the AuthProfile interface
    const fullName = [data.first_name, data.middle_name, data.last_name]
      .filter(Boolean)
      .join(" ") || null;
    
    return {
      id: data.id,
      email: data.email || "", // Your table doesn't have email, get from auth user if needed
      fullName: fullName || undefined,
      avatar: data.avatar_url || undefined,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      metadata: {
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        middleName: data.middle_name,
        website: data.website,
      },
    };
  }

  async updateProfile(userId: string, updates: Partial<AuthProfile>): Promise<AuthProfile> {
    // Parse fullName into separate fields if provided
    const nameParts = updates.fullName?.split(" ") || [];
    const firstName = nameParts[0] || undefined;
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : undefined;
    const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(" ") : undefined;

    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Map updates to your table schema
    if (updates.avatar !== undefined) updateData.avatar_url = updates.avatar;
    if (updates.fullName !== undefined) {
      updateData.first_name = firstName;
      updateData.last_name = lastName;
      updateData.middle_name = middleName;
    }
    if (updates.metadata?.username !== undefined) updateData.username = updates.metadata.username;
    if (updates.metadata?.website !== undefined) updateData.website = updates.metadata.website;

    const { data, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    
    // Map response back to AuthProfile format
    const fullName = [data.first_name, data.middle_name, data.last_name]
      .filter(Boolean)
      .join(" ") || undefined;
    
    return {
      id: data.id,
      email: data.email || "",
      fullName: fullName,
      avatar: data.avatar_url || undefined,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      metadata: {
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        middleName: data.middle_name,
        website: data.website,
      },
    };
  }

  async resetPassword(email: string, options?: { redirectTo?: string }): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: options?.redirectTo || `${process.env.EXPO_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) throw error;
    
    return {
      success: true,
      message: "Password reset email sent successfully"
    };
  }

  async updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;
    
    return {
      success: true,
      message: "Password updated successfully"
    };
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return null;

    return {
      id: user.id,
      email: user.email!,
      emailVerified: !!user.email_confirmed_at,
      provider: "supabase",
      metadata: user.user_metadata,
    };
  }

  async getSession(): Promise<any> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async refreshSession(): Promise<any> {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return session;
  }

  // Optional: Email verification
  async verifyEmail(): Promise<{ success: boolean; message: string }> {
    // Implementation depends on your verification flow
    throw new Error("Email verification not implemented yet");
  }

  async resendVerification(): Promise<{ success: boolean; message: string }> {
    // Implementation depends on your verification flow  
    throw new Error("Email verification resend not implemented yet");
  }
}