import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';

interface AuthState {
  user: any | null;
  token: string | null;
  uid: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

const getAuthDataFromAsyncStorage = async (): Promise<{ token: string | null; uid: string | null }> => {
  try {
    const values = await AsyncStorage.multiGet(['authToken', 'authUid']);
    const token = values[0][1];
    const uid = values[1][1];
    return { token, uid };
  } catch (error) {
    console.error('Error getting auth data from AsyncStorage:', error);
    return { token: null, uid: null };
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
      
      // Guardar token y uid en AsyncStorage
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
    try {
      await signOut(auth);
      await removeAuthDataFromAsyncStorage();
      set({ user: null, token: null, uid: null });
    } catch (error: any) {
      console.error("Logout failed: ", error.message);
    }
  },
}));

(async () => {
  const { token, uid } = await getAuthDataFromAsyncStorage();
  if (token && uid) {
    useAuthStore.setState({ token, uid });
  }
})();

export default useAuthStore;
