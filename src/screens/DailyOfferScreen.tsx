import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, ScrollView} from 'react-native';
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

import orsegzoldaranya from '../assets/gastronomyImages/orsegzoldaranya.png';
import csirkepaprikas from '../assets/gastronomyImages/csirkepaprikas.png';


type Props = StackScreenProps<RootStackParamList, 'DailyOffer'>;

const DailyOfferScreen: React.FC<Props> = ({navigation}) => {
  

  

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
          <Text style={styles.headerText}>Napi ajánlat</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      {/* Mozaikos ajánlatok */}
      <View style={styles.grid}>
        {/* Példakártya - név és ár */}
        <View style={styles.tileBox}>
          <Text style={styles.tileTitle}>Paprikás csirke</Text>
          <Text style={styles.tilePrice}>3200 Ft</Text>
        </View>

        {/* Példakártya - kép */}
        <View style={styles.tileImageBox}>
          <Image source={csirkepaprikas} style={styles.tileImage} />
        </View>

        {/* Példakártya - leírás */}
        <View style={styles.tileDescBox}>
          <Text style={styles.tileDesc}>Ízletes paprikás csirke, házi nokedlivel és tejfölös mártással tálalva.</Text>
        </View>

        {/* Példakártya - kép */}
        <View style={styles.tileImageBox}>
          <Image source={orsegzoldaranya} style={styles.tileImage} />
        </View>

        {/* Példakártya - név és ár */}
        <View style={styles.tileBox}>
          <Text style={styles.tileTitle}>Őrség zöld aranya</Text>
          <Text style={styles.tilePrice}>1100 Ft</Text>
        </View>    

        {/* Példakártya - leírás */}
        <View style={styles.tileDescBox}>
          <Text style={styles.tileDesc}>Az ország tortájának is megválasztott Őrség zöld aranya torta, fehércsokoládéval és málnazselével.</Text>
        </View>


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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  tileBox: {
    width: '42.5%',
    height: 170,
    margin: 8,
    backgroundColor: '#ffd18b',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileImageBox: {
    width: '42.5%',
    height: 170,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#000',
  },
  tileDescBox: {
    width: '90%',
    height: 120,
    paddingHorizontal: 11,
    margin: 8,
    backgroundColor: '#ffd18b',
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileImage: {
    width: '100%',
    height: 170,
    resizeMode: 'cover',
  },
  tileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 6,
  },
  tilePrice: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  tileDesc: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '400',
    //fontWeight: 'bold',
    color: '#000',
  },
});

export default DailyOfferScreen;
