import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  user: any | null;
  token: string | null;
  uid: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  loadAuthData: () => Promise<void>;
}

const saveAuthDataToAsyncStorage = async (token: string, uid: string) => {
  try {
    await AsyncStorage.multiSet([
      ['authToken', token],
      ['authUid', uid],
    ]);
  } catch (error) {
    console.error('Error saving auth data to AsyncStorage:', error);
  }
};

const removeAuthDataFromAsyncStorage = async () => {
  try {
    await AsyncStorage.multiRemove(['authToken', 'authUid']);
  } catch (error) {
    console.error('Error removing auth data from AsyncStorage:', error);
  }
};

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  uid: null,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;
      
      await saveAuthDataToAsyncStorage(token, uid);
      
      set({
        user: userCredential.user,
        token,
        uid,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  googleLogin: async (idToken: string) => {
    set({ isLoading: true, error: null });
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      const token = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      await saveAuthDataToAsyncStorage(token, uid);

      set({
        user: userCredential.user,
        token,
        uid,
        isLoading: false,
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await signOut(auth);
      await removeAuthDataFromAsyncStorage();
      set({ user: null, token: null, uid: null, isLoading: false });
    } catch (error: any) {
      console.error("Logout failed: ", error.message);
      set({ isLoading: false });
    }
  },

  // Nueva función para cargar los datos almacenados
  loadAuthData: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('authToken');
      const uid = await AsyncStorage.getItem('authUid');
      
      if (token && uid) {
        set({
          token,
          uid,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error: any) {
      console.error('Failed to load auth data:', error);
      set({ isLoading: false, error: error.message });
    }
  },
}));

export default useAuthStore;
