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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    
    if (error) throw error;
    if (!data.user) throw new Error("Authentication failed");

    const user: AuthUser = {
      id: data.user.id,
      email: data.user.email!,
      emailVerified: !!data.user.email_confirmed_at,
      provider: "supabase",
      metadata: data.user.user_metadata,
    };

    return { user, session: data.session };
  }

  async signUpWithEmail(credentials: SignupCredentials): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        // No metadata needed for basic signup - names can be added later
      });

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
      
      // Additional check: if user exists but session is null, it might be a duplicate
      if (data.user && !data.session && data.user.email_confirmed_at) {
        throw new Error("An account with this email already exists");
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
    } catch (error: any) {
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