import React, { useState, useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation';
import { useRoute, RouteProp } from '@react-navigation/native';

import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import { faCircleLeft } from '@fortawesome/free-regular-svg-icons/faCircleLeft';
import {faCircleUser} from '@fortawesome/free-regular-svg-icons/faCircleUser';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import {faUtensils} from '@fortawesome/free-solid-svg-icons/faUtensils';
import {faClipboardList} from '@fortawesome/free-solid-svg-icons/faClipboardList';
import {faCircleInfo} from '@fortawesome/free-solid-svg-icons/faCircleInfo';


import firestore from '@react-native-firebase/firestore';
import { useAuth } from '../context/AuthContext'; 
import auth from '@react-native-firebase/auth';

import Toast from 'react-native-toast-message';

type MenuItem = {
  id: string;
  name: string;
  category: string;
  price: number;
  orderIndex?: number;
};

const categoryMap: Record<string, string> = {
  koktel: 'Koktélok',
  rovid: 'Rövid italok',
  likor: 'Likőrök',
  sor: 'Sörök',
  bor: 'Borok',
};

type Props = StackScreenProps<RootStackParamList, 'DrinkMenu'>;

const DrinkMenuScreen: React.FC<Props> = ({navigation}) => {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [groupedItems, setGroupedItems] = useState<Record<string, MenuItem[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);

        const snapshot = await firestore()
          .collection('menuitems')
          .where('type', '==', 'bar')
          .orderBy('orderInCategory')
          .get();

        const items: MenuItem[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<MenuItem, 'id'>),
        }));

        // kategoria szerinti csoportosítas
        const grouped: Record<string, MenuItem[]> = {};
        items.forEach(item => {
          if (!grouped[item.category]) {
            grouped[item.category] = [];
          }
          grouped[item.category].push(item);
        });

        setGroupedItems(grouped);
      } catch (error) {
        console.error('Hiba az itallap betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

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
          <Text style={styles.headerText}>Itallap</Text>
        </View>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Profile')}>
          <FontAwesomeIcon icon={faCircleUser} size={40} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <FontAwesomeIcon icon={faCircleInfo} size={20} color="black" style={{ marginRight: 6 }} />
        <Text style={styles.infoText}>A szállás díja nem tartalmazza a bárban fogyasztott termékek árát.</Text>
      </View>

      <ScrollView
        style={{ width: '100%', paddingTop: 5, marginBottom: 20 }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 5 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.menuCard}>
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#000"
              style={{ marginVertical: 20 }}
            />
          ) : (
            Object.keys(groupedItems)
              .filter(
                category =>
                  selectedCategory === null || selectedCategory === category,
              )
              .map((category, idx) => (
                <View key={idx} style={{ marginBottom: 16 }}>
                  <Text style={styles.categoryTitle}>
                    {categoryMap[category] || category}
                  </Text>

                  {groupedItems[category].map((item, i) => (
                    <View key={i} style={styles.menuItemRow}>
                      <View style={styles.menuNameBox}>
                        <Text style={styles.menuName}>{item.name}</Text>
                      </View>
                      <Text style={styles.menuPrice}>{item.price} Ft</Text>
                    </View>
                  ))}
                </View>
              ))
          )}
        </View>
      </ScrollView>

      <View style={styles.dropdownWrapper}>
        <TouchableOpacity
          style={styles.dropdownToggle}
          onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Text style={styles.dropdownToggleText}>
            {selectedCategory
              ? categoryMap[selectedCategory]
              : 'Összes kategória'}
          </Text>
          <FontAwesomeIcon
            icon={dropdownVisible ? faCaretUp : faCaretDown}
            size={16}
          />
        </TouchableOpacity>

        {dropdownVisible && (
          <ScrollView
            style={styles.dropdownList}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedCategory(null);
                setDropdownVisible(false);
              }}>
              <Text style={styles.dropdownItemText}>Összes kategória</Text>
            </TouchableOpacity>

            {Object.keys(groupedItems).map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setDropdownVisible(false);
                }}>
                <Text style={styles.dropdownItemText}>
                  {categoryMap[cat] || cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      

      

    </View>
        
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fbe9d0',
},
loadingText: {
  marginTop: 12,
  fontSize: 16,
  color: '#000',
},
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff2d5',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    width: '90%',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    fontStyle: 'italic',
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 5,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'left',
    color: '#000',
    borderBottomWidth: 1.5,
    borderColor: '#000',
    paddingBottom: 4,
  },
  menuItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginTop: 6,
  },
  menuCard: {
    backgroundColor: '#fff2d5',
    padding: 12,
    marginVertical: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#000',
    width: '90%',
  },
  menuNameBox: {
    width: '80%',
  },
  menuName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
  dropdownWrapper: {
    width: '90%',
    marginBottom: 20,
    alignItems: 'center',
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffd18b',
    borderColor: '#000',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
  },
  dropdownToggleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  dropdownList: {
    maxHeight: 200,
    width: '95%',
    backgroundColor: '#fbe9d0',
    borderRadius: 10,
    borderColor: '#000',
    marginTop: 8,
    zIndex: 10,
    paddingVertical: 1,
  },
  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginVertical: 3,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#000',
    backgroundColor: '#fff2d5',
  },
  dropdownItemText: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#000',
  },
});

export default DrinkMenuScreen;
