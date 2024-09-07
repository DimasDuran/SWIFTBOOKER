import { useState, useEffect } from 'react';
import { getAuth, User, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAuth {
    user: User | null;
    uid: string | null;
    token: string | null;
    email: string | null; 
    getToken: () => Promise<string | null>; 
}

const useAuth = (): UseAuth => {
    const [user, setUser] = useState<User | null>(null);
    const [uid, setUid] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null); 
    const auth: Auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userToken = await user.getIdToken();
                setUser(user);
                setUid(user.uid);
                setToken(userToken);
                setEmail(user.email);
                await AsyncStorage.setItem('userToken', userToken);
            } else {
                setUser(null);
                setUid(null);
                setToken(null);
                setEmail(null); 
                await AsyncStorage.removeItem('userToken');
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const getToken = async (): Promise<string | null> => {
        return token;
    };

    return { user, uid, token, email, getToken }; // add email
};

export default useAuth;
