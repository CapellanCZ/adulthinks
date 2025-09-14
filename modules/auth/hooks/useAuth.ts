// import { useAuthStore } from '../store/useAuthStore';
// import { useEffect } from 'react';
// import { supabase } from '@/lib/supabase';

// export const useAuth = () => {
//   const { user, profile, loading, error, login, logout, setUser, setProfile } = useAuthStore();

//   // Check for existing session on app start
//   useEffect(() => {
//     const checkSession = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
//       if (session?.user) {
//         setUser(session.user);
//         // Optionally fetch profile here
//       }
//     };
    
//     checkSession();

//     // Listen for auth changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange(
//       async (event, session) => {
//         if (session?.user) {
//           setUser(session.user);
//         } else {
//           logout();
//         }
//       }
//     );

//     return () => subscription.unsubscribe();
//   }, []);

//   return {
//     user,
//     profile,
//     loading,
//     error,
//     login,
//     logout,
//     isAuthenticated: !!user,
//     isLoading: loading,
//   };
// };