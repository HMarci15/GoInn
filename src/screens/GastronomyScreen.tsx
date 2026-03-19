import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {faUtensils} from '@fortawesome/free-solid-svg-icons/faUtensils';
import {faMartiniGlassCitrus} from '@fortawesome/free-solid-svg-icons/faMartiniGlassCitrus';
import {faClipboardList} from '@fortawesome/free-solid-svg-icons/faClipboardList';
import {faCalendarDays} from '@fortawesome/free-solid-svg-icons/faCalendarDays';
import {faBookBookmark} from '@fortawesome/free-solid-svg-icons/faBookBookmark';
import {faCrown} from '@fortawesome/free-solid-svg-icons/faCrown';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';
import {faImage} from '@fortawesome/free-solid-svg-icons/faImage';
import {faImages} from '@fortawesome/free-solid-svg-icons/faImages';


import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';


type Props = StackScreenProps<RootStackParamList, 'Gastronomy'>;

const GastronomyScreen: React.FC<Props> = ({navigation}) => {
  const [showRestaurant, setShowRestaurant] = useState(true);
  const [showBar, setShowBar] = useState(true);

  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate('Main')}>
          <FontAwesomeIcon
            icon={faCircleLeft}
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Gasztronómia</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Étterem */}
      <View style={styles.sectionBox}>
        <TouchableOpacity onPress={() => setShowRestaurant(!showRestaurant)} style={styles.sectionHeader}>
          <View style={styles.sectionTitleBox}>
            <FontAwesomeIcon icon={faUtensils} size={42} color="black" />
            <Text style={styles.sectionTitle}>Étterem</Text>
          </View>
          <FontAwesomeIcon icon={showRestaurant ? faCaretUp : faCaretDown} size={30} color="black" />
        </TouchableOpacity>


        {showRestaurant && (
          <View>
            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('DailyOffer')}>
              <FontAwesomeIcon icon={faCrown} size={20} color="black" />
              <Text style={styles.routeText}>Napi ajánlat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('FoodMenu')}>
              <FontAwesomeIcon icon={faClipboardList} size={20} color="black" />
              <Text style={styles.routeText}>Étlap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('OpeningHours')}>
              <FontAwesomeIcon icon={faCircleInfo} size={20} color="black" />
              <Text style={styles.routeText}>Információ</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('TableBooking')}>
              <FontAwesomeIcon icon={faBookBookmark} size={20} color="black" />
              <Text style={styles.routeText}>Asztalfoglalás</Text>
            </TouchableOpacity>

          </View>
        )}
      </View>


      {/* Bár */}
      <View style={styles.sectionBox}>
        <TouchableOpacity onPress={() => setShowBar(!showBar)} style={styles.sectionHeader}>
          <View style={styles.sectionTitleBox}>
            <FontAwesomeIcon icon={faMartiniGlassCitrus} size={42} color="black" />
            <Text style={styles.sectionTitle}>Bár</Text>
          </View>
          <FontAwesomeIcon icon={showBar ? faCaretUp : faCaretDown} size={30} color="black" />
        </TouchableOpacity>


        {showBar && (
          <View>
            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('DrinkMenu')}>
              <FontAwesomeIcon icon={faClipboardList} size={20} color="black" />
              <Text style={styles.routeText}>Itallap</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.routeItem} onPress={() => navigation.navigate('OpeningHoursBar')}>
              <FontAwesomeIcon icon={faCircleInfo} size={20} color="black" />
              <Text style={styles.routeText}>Információ</Text>
            </TouchableOpacity>
            
          </View>
        )}
      </View>
    
         
    </View>
        
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbe9d0',
    alignItems: 'center',
    paddingTop: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    backgroundColor: '#fbe9d0',
    paddingVertical: 4,
    //borderWidth: 1.5,
    borderColor: '#000000',
    marginBottom: 25,
  },
  iconButton: {
    padding: 10,
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
  sectionBox: {
    backgroundColor: '#fff2d5',
    padding: 10,
    marginVertical: 10,
    width: '90%',
    borderRadius: 10,
    borderColor: '#000000',
    borderWidth: 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginBottom: 5,
  },
  sectionTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    marginLeft: 20,
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 5,
  },
  routeItem: {
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fbe9d0',
    marginBottom: 10,
    borderWidth: 1.2,
    borderRadius: 8,
  },
  routeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
});

export default GastronomyScreen;
