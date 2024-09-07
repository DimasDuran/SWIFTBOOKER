import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image } from 'react-native';

interface IntroScreensProps {
    onDone: () => void;
}

const IntroScreens: React.FC<IntroScreensProps> = ({ onDone }) => {
    return (
        <Onboarding
            onDone={onDone}
            pages={[
                {
                    backgroundColor: '#060212',
                    image: <Image source={require('@/assets/illustration/beauty.png')} />,
                    title: 'Find Professionals',
                    subtitle: 'Access a wide network of specialized professionals in various fields.',
                },
                {
                    backgroundColor: '#220a6a',
                    image: <Image source={require('@/assets/illustration/sport.png')} />,
                    title: 'Schedule Appointments',
                    subtitle: 'Easily book appointments and get reminders to never miss one.',
                },
                {
                    backgroundColor: '#240f4b',
                    image: <Image source={require('@/assets/illustration/healthcare.png')} />,
                    title: 'Appointment History',
                    subtitle: 'Keep track of your past appointments and consultations.',
                },
                {
                    backgroundColor: '#060212',
                    image: <Image source={require('@/assets/illustration/growth.png')} />,
                    title: 'Get Ready to Action',
                    subtitle: 'Start using the app and book your first appointment today!',
                },
            ]}
        />
    );
};

export default IntroScreens;
