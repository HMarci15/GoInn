import React, { createContext, useContext, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

type UserPreferences = {
  mobilityImpaired: boolean;
  setMobilityImpaired: (value: boolean) => void;
  loading: boolean;
};

const UserPreferencesContext = createContext<UserPreferences | null>(null);

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobilityImpaired, setMobilityImpaired] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrefs = async () => {
      const user = auth().currentUser;
      if (user) {
        const doc = await firestore().collection('users').doc(user.uid).get();
        const data = doc.data();
        if (data && typeof data.mozgasserult === 'boolean') {
          setMobilityImpaired(data.mozgasserult);
        }
      }
      setLoading(false);
    };

    fetchPrefs();
  }, []);

  return (
    <UserPreferencesContext.Provider value={{ mobilityImpaired, setMobilityImpaired, loading }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) throw new Error('useUserPreferences must be used within UserPreferencesProvider');
  return context;
};
