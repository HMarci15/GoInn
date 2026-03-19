import 'react-native-reanimated';
import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen.tsx';
import MainScreen from './src/screens/MainScreen.tsx';
import ProfileScreen from './src/screens/ProfileScreen.tsx'
import PasswordChangeScreen from './src/screens/PasswordChangeScreen.tsx'
import EarlierFavScreen from './src/screens/EarlierFavScreen.tsx'
import SettingsScreen from './src/screens/SettingsScreen.tsx'
import MyTableBookingsScreen from './src/screens/MyTableBookingsScreen.tsx'
import MyBookingsScreen from './src/screens/MyBookingsScreen.tsx';
import MyIssuesScreen from './src/screens/MyIssuesScreen.tsx';
import LocationScreen from './src/screens/LocationScreen.tsx';
import QRScannerScreen from './src/screens/QRScannerScreen.tsx';
import TargetScreen from './src/screens/TargetScreen.tsx';
import BookingScreen from './src/screens/BookingScreen.tsx';
import GastronomyScreen from './src/screens/GastronomyScreen.tsx';
import DailyOfferScreen from './src/screens/DailyOfferScreen.tsx';
import FoodMenuScreen from './src/screens/FoodMenuScreen.tsx';
import DrinkMenuScreen from './src/screens/DrinkMenuScreen.tsx';
import OpeningHoursScreen from './src/screens/OpeningHoursScreen.tsx';
import OpeningHoursBarScreen from './src/screens/OpeningHoursBarScreen.tsx';
import TableBookingScreen from './src/screens/TableBookingScreen.tsx';
import UploadRooms from './src/screens/UploadRooms.tsx';
import IssueScreen from './src/screens/IssueScreen.tsx';
import PhotoCaptureScreen from './src/screens/PhotoCaptureScreen.tsx';
import {RootStackParamList} from './src/types/navigation.ts';
import './src/utils/firebase';
import { AuthProvider } from './src/context/AuthContext';
import {UserPreferencesProvider} from './src/context/UserPreferencesContext';
import Toast from 'react-native-toast-message';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <AuthProvider>
    <UserPreferencesProvider> 
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PasswordChange" component={PasswordChangeScreen} />
        <Stack.Screen name="EarlierFav" component={EarlierFavScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
        <Stack.Screen name="MyTableBookings" component={MyTableBookingsScreen} />
        <Stack.Screen name="MyIssues" component={MyIssuesScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="Target" component={TargetScreen} />
        <Stack.Screen name="Booking" component={BookingScreen} />
        <Stack.Screen name="Gastronomy" component={GastronomyScreen} />
        <Stack.Screen name="DailyOffer" component={DailyOfferScreen} />
        <Stack.Screen name="FoodMenu" component={FoodMenuScreen} />
        <Stack.Screen name="DrinkMenu" component={DrinkMenuScreen} />
        <Stack.Screen name="OpeningHours" component={OpeningHoursScreen} />
        <Stack.Screen name="OpeningHoursBar" component={OpeningHoursBarScreen} />
        <Stack.Screen name="TableBooking" component={TableBookingScreen} />
        <Stack.Screen name="UploadRooms" component={UploadRooms} />
        <Stack.Screen name="Issue" component={IssueScreen} />
        <Stack.Screen name="PhotoCapture" component={PhotoCaptureScreen} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
    </UserPreferencesProvider>
    </AuthProvider>
  );
};

export default App;
