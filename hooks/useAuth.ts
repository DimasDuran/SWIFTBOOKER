import { useState, useEffect } from 'react';
import { getAuth, User, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UseAuth {
    user: User | null;
    token: string | null;
    getToken: () => Promise<string | null>; // Add for to get token
}

const useAuth = (): UseAuth => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const auth: Auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userToken = await user.getIdToken();
                setUser(user);
                setToken(userToken);
                await AsyncStorage.setItem('userToken', userToken);
            } else {
                setUser(null);
                setToken(null);
                await AsyncStorage.removeItem('userToken');
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const getToken = async (): Promise<string | null> => {
        return token;
    };

    return { user, token, getToken }; 
};

export default useAuth;
