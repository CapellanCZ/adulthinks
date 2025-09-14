// Modern Auth Service: Uses Strategy Pattern with Provider Factory
import { authProviderFactory } from "./AuthProviderFactory";

export async function loginWithEmail(email: string, password: string) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.signInWithEmail({ email, password });
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.signUpWithEmail({ email, password, fullName });
}

export async function fetchProfile(userId: string) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.fetchProfile(userId);
}

export async function updateProfile(userId: string, updates: any) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.updateProfile(userId, updates);
}

export async function signOut() {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.signOut();
}

export async function getCurrentUser() {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.getCurrentUser();
}

export async function getSession() {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.getSession();
}

// Helper functions for provider management
export function switchAuthProvider(providerType: "supabase" | "google") {
  authProviderFactory.switchProvider(providerType);
}

export function getCurrentProviderType() {
  return authProviderFactory.getProviderType();
}

export function getAvailableProviders() {
  return authProviderFactory.getAvailableProviders();
}

export function supportsFeature(feature: string) {
  return authProviderFactory.supportsFeature(feature);
}