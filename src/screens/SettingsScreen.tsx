import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import { faCircleUser } from '@fortawesome/free-regular-svg-icons/faCircleUser';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message'; 
import { useUserPreferences } from '../context/UserPreferencesContext';



type Props = StackScreenProps<RootStackParamList, 'Settings'>;

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { mobilityImpaired, setMobilityImpaired, loading } = useUserPreferences();

  const handleSave = async () => {
    const user = auth().currentUser;
    if (!user) return;

    try {
      await firestore().collection('users').doc(user.uid).update({
        mozgasserult: mobilityImpaired,
      });

      Toast.show({
        type: 'success',
        text1: 'Sikeresen mentve!',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Mentés hiba:', error);
      Toast.show({
        type: 'error',
        text1: 'Hiba történt mentés közben!',
        position: 'bottom',
      });
    }
  };


  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleLeft} size={40} color="black" />
        </TouchableOpacity>
        <View style={styles.header}><Text style={styles.headerText}>Beállítások</Text></View>
         <View style={styles.iconButton} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Közlekedési lehetőségek</Text>
        <View style={styles.switchRow}>
          <Text style={styles.switchLabelMSV}>Mozgássérült vagyok (Lift használata)</Text>
          {loading ? (
              <ActivityIndicator size="small" color="#888" />
            ) : (
          <Switch
            value={mobilityImpaired}
            onValueChange={setMobilityImpaired}
            trackColor={{ false: '#ccc', true: '#fbd39bff' }}
            thumbColor={mobilityImpaired ? '#ffd18b' : '#888'}
          />
          )}
        </View>
      </View>
    </ScrollView>

    <View style={styles.savingBlock}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Beállítások mentése</Text>
      </TouchableOpacity>
    </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fbe9d0',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 80,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor: '#fbe9d0',
    paddingVertical: 4,
    borderColor: '#000000',
    marginBottom: 25,
  },
  iconButton: {
    padding: 10,
    width: 60, 
    alignItems: 'center',
    //borderWidth: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffd18b',
    borderRadius: 25,
    borderWidth: 1.5,
    padding: 8,
  },
  headerText: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#000',
  },
  section: {
    width: '90%',
    backgroundColor: '#fff2d5',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabelMSV: {
    fontSize: 16,
    maxWidth: 170,
    paddingRight: 10,
    //borderWidth: 1,
  },
  savingBlock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fbe9d0',
    padding: 10,
    borderWidth: 1.5,
    borderTopLeftRadius: 21,
    borderTopRightRadius: 21,
    borderTopColor: '#000',
    borderBottomColor: '#fbe9d0',
    alignItems: 'center',
  },
   saveButton: {
    backgroundColor: '#ffd18b',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderWidth: 1.5,
    marginVertical: 10,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
  },

});

export default SettingsScreen;
