import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationProp } from '@react-navigation/native';
import { getAuth, signOut } from 'firebase/auth';
import { Feather } from '@expo/vector-icons';
import { app } from '../../firebaseConfig';
import CardSmall from '@/components/CardSmall';
import UploadImage from '@/components/UploadImage';
import { colors } from '@/styles/colores';
import { showTopMessage } from "@/utils/ErrorHandler";
import { useRouter } from 'expo-router';
import useAuthStore from '@/hooks/useAuth';


interface UserProfileScreenProps {
  navigation: NavigationProp<any>;
}

const UserProfileScreen: React.FC<UserProfileScreenProps> = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const router = useRouter();
  const auth = getAuth(app);
  const { logout,token,user} = useAuthStore()

  useEffect(() => {
    // Si el estado de 'user' está disponible en el hook, usarlo
    // If state user is avalible over hook used
    if (user) {
      setUserInfo({
        id: user.uid,
        email: user.email || 'example@example.com',
        displayName: user.displayName || 'Anonymous',
      });
    } else {
      // Si no, usa el estado de auth
      // If not, You should used the auth state.
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserInfo({
          id: currentUser.uid,
          email: currentUser.email || 'example@example.com',
          displayName: currentUser.displayName || 'Anonymous',
        });
      } else {
        console.log('No user is currently logged in.');
      }
    }
  }, [user, auth]);
  
  // Sign out user
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        logout()
        showTopMessage('Session ended', 'success');
        goToLogin();
      })
      .catch((err) => console.log(err));
  };

  // Navigation
  const goToLogin = () => {
    router.replace("/stack/LoginScreen");
  };

  const goToBookingHistory = () => {
    router.replace('/');
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header_text}>Profile</Text>

      <View style={styles.section_container}>
        <View style={styles.user_card}>
          <View style={styles.title_container}>
            <Text style={styles.title}>
             Welcome!!
            </Text>
            <Text style={styles.desc}>
            {userInfo?.displayName || userInfo?.email || 'Anonymous'}
            </Text>
          </View>
          <UploadImage imageUrl={user?.photoURL || userInfo?.photoURL || null} />
          </View>

        <CardSmall iconName="user" text="Account Information" onSelect={() => console.log('')} />
        <CardSmall onSelect={goToBookingHistory} iconName="list" text="Past Appointments" />
        <CardSmall iconName="message-square" text="Feedback" onSelect={() => console.log('')} />

        <View style={styles.logo_container}>
          <Text style={styles.logo_text}>SwiftBooker</Text>
          {!!token ?(
          <TouchableOpacity style={styles.logout_container} onPress={handleSignOut}>
            <Text style={styles.text}>Log Out</Text>
            <Feather style={styles.icon} name="log-out" size={24} color="black" />
          </TouchableOpacity>

          ) : (
            <TouchableOpacity style={styles.logout_container} onPress={handleSignOut}>
            <Text style={styles.text}>Log in</Text>
            <Feather style={styles.icon} name="log-out" size={24} color="black" />
          </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
  },
  user_card: {
    flexDirection: 'row',
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: colors.color_white,
    padding: 16,
  },
  section_container: {
    flex: 1,
    marginBottom: 16,
  },
  text_container: {
    flex: 1,
  },
  title_container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Mulish-Medium',
  },
  desc: {
    fontSize: 14,
    fontFamily: 'Mulish-Light',
    color: colors.color_gray,
  },
  logout_container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header_text: {
    marginHorizontal: 24,
    marginVertical: 16,
    fontSize: 30,
    fontFamily: 'Mulish-Medium',
  },
  logo_container: {
    flex: 1,
    marginVertical: 24,
    alignItems: 'center',
  },
  logo_text: {
    fontSize: 34,
    fontFamily: 'Mulish-Medium',
    color: colors.color_light_gray,
  },
  icon: {
    padding: 4,
  },
  text: {
    padding: 8,
    fontSize: 18,
    fontFamily: 'Mulish-Medium',
  },
});

export default UserProfileScreen;
