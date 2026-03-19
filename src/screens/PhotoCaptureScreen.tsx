import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBolt } from '@fortawesome/free-solid-svg-icons/faBolt';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark';
import { faCamera } from '@fortawesome/free-solid-svg-icons/faCamera';

type Props = StackScreenProps<RootStackParamList, 'PhotoCapture'>;

const PhotoCaptureScreen: React.FC<Props> = ({ navigation, route }) => {
  const cameraRef = useRef<Camera>(null);
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [flash, setFlash] = useState<'off' | 'on'>('off');

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission]);

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Nincs elérhető kamera eszköz.</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Kameraengedély szükséges…</Text>
      </View>
    );
  }

  const onCapture = async () => {
  try {
    const photo = await cameraRef.current?.takePhoto({
      flash, //on/off
      enableShutterSound: true, 
    });
    if (photo?.path) {
      navigation.navigate({
  name: 'Issue',
  params: { 
    photoPath: photo.path,
    tempRoom: route.params?.tempRoom ?? '',
    tempDescription: route.params?.tempDescription ?? ''
  },
  merge: true,
});

    }
  } catch (e) {
    console.warn('takePhoto error', e);
  }
};


  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Felső sáv: bezárás + vaku */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleXmark} size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.topBtn} onPress={() => setFlash(flash === 'off' ? 'on' : 'off')}>
          <FontAwesomeIcon icon={faBolt} size={24} color={flash === 'on' ? '#ffd700' : '#fff'} />
          <Text style={styles.topBtnText}>{flash === 'on' ? 'Vaku: BE' : 'Vaku: KI'}</Text>
        </TouchableOpacity>
      </View>

      {/* Alsó sáv: fotó gomb */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.captureBtn} onPress={onCapture}>
          <FontAwesomeIcon icon={faCamera} size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  topBar: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0,
    height: 70, 
    paddingHorizontal: 16,
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  topBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  topBtnText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  bottomBar: {
    position: 'absolute', 
    bottom: 25, 
    left: 0, 
    right: 0,
    alignItems: 'center', 
    justifyContent: 'center',
  },
  captureBtn: {
    width: 68, 
    height: 68, 
    borderRadius: 34,
    backgroundColor: '#ffd18b',
    borderWidth: 3, 
    borderColor: '#000',
    alignItems: 'center', 
    justifyContent: 'center',
  },
});

export default PhotoCaptureScreen;
