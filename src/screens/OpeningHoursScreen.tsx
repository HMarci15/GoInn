import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
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
import {faWebAwesome} from '@fortawesome/free-solid-svg-icons/faWebAwesome';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';


import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';

import etteremkep from '../assets/gastronomyImages/etteremkep.png';


type Props = StackScreenProps<RootStackParamList, 'OpeningHours'>;

const OpeningHoursScreen: React.FC<Props> = ({navigation}) => {
  

  

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.goBack()}>
          <FontAwesomeIcon
            icon={faCircleLeft}
            size={40}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Információ</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Nyitvatartási boxok */}
      <View style={styles.box}>
        <View style={styles.boxTitleBox}>
          <FontAwesomeIcon icon={faUtensils} size={35} color="black" />
          <Text style={styles.boxTitle}>Étterem nyitvatartása</Text>
        </View>
        <Text style={styles.boxTextMain}>Hétfő - Vasárnap: 07:00 - 22:00</Text>
        <Text style={styles.boxText}>Reggeli: 07:00 - 10:00</Text>
        <Text style={styles.boxText}>Ebéd: 12:00 - 15:00</Text>
        <Text style={styles.boxText}>Vacsora: 18:00 - 22:00</Text>
      </View>

      {/* Étterem kép */}
      <Image source={etteremkep} style={styles.image} resizeMode="cover" />
  
         
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
  box: {
    backgroundColor: '#fff2d5',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    padding: 15,
    width: '85%',
    marginBottom: 20,
  },
  boxTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  boxTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000',
  },
  boxTextMain: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
    fontWeight: 'bold',
  },
  boxText: {
    fontSize: 15,
    color: '#000',
    marginBottom: 4,
  },
  image: {
    width: '85%',
    height: 350,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#000',
  },
});

export default OpeningHoursScreen;
