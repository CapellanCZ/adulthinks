import { AuthProvider } from "../interfaces/AuthProvider";
import { SupabaseAuthProvider } from "../providers/SupabaseAuthProvider";
import { GoogleAuthProvider } from "../providers/GoogleAuthProvider";

export type AuthProviderType = "supabase" | "google";

export class AuthProviderFactory {
  private static instance: AuthProviderFactory;
  private currentProvider: AuthProvider;
  private providers: Map<AuthProviderType, AuthProvider>;

  private constructor() {
    // Initialize available providers
    this.providers = new Map<AuthProviderType, AuthProvider>();
    this.providers.set("supabase", new SupabaseAuthProvider());
    this.providers.set("google", new GoogleAuthProvider());

    // Default to Supabase
    this.currentProvider = this.providers.get("supabase")!;
  }

  static getInstance(): AuthProviderFactory {
    if (!AuthProviderFactory.instance) {
      AuthProviderFactory.instance = new AuthProviderFactory();
    }
    return AuthProviderFactory.instance;
  }

  getCurrentProvider(): AuthProvider {
    return this.currentProvider;
  }

  getProviderType(): AuthProviderType {
    return this.currentProvider.name as AuthProviderType;
  }

  switchProvider(providerType: AuthProviderType): void {
    const provider = this.providers.get(providerType);
    if (!provider) {
      throw new Error(`Unknown auth provider: ${providerType}`);
    }
    this.currentProvider = provider;
  }

  getAvailableProviders(): AuthProviderType[] {
    return Array.from(this.providers.keys());
  }

  getProviderFeatures(providerType?: AuthProviderType): string[] {
    const provider = providerType 
      ? this.providers.get(providerType)
      : this.currentProvider;
    
    if (!provider) {
      throw new Error(`Provider not found: ${providerType}`);
    }
    
    return provider.supportedFeatures;
  }

  supportsFeature(feature: string, providerType?: AuthProviderType): boolean {
    const features = this.getProviderFeatures(providerType);
    return features.includes(feature);
  }
}

// Singleton instance for easy access
export const authProviderFactory = AuthProviderFactory.getInstance();