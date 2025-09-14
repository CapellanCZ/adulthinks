// Password Reset Service: Uses Auth Provider Factory
import { authProviderFactory } from "./AuthProviderFactory";

export async function sendPasswordResetEmail(email: string, options?: { redirectTo?: string }) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.resetPassword(email, options);
}

export async function updatePassword(newPassword: string) {
  const provider = authProviderFactory.getCurrentProvider();
  return await provider.updatePassword(newPassword);
}