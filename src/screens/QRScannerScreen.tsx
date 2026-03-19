import React, { useCallback, useMemo, useRef, useState , useEffect} from 'react';
import { StyleSheet, View, Platform, Text, TouchableOpacity, Vibration, Dimensions } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner, useCameraFormat, } from 'react-native-vision-camera';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons/faLightbulb';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons/faCircleXmark';

const WINDOW_SIZE = 240;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const TOP = Math.floor((SCREEN_H - WINDOW_SIZE) / 2);
const LEFT = Math.floor((SCREEN_W - WINDOW_SIZE) / 2);

type Props = StackScreenProps<RootStackParamList, 'QRScanner'>;

const QRScannerScreen: React.FC<Props> = ({ navigation }) => {
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();
  const [handledOnce, setHandledOnce] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [invalidHint, setInvalidHint] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const safeVibrate = (ms: number = 40) => { try { Vibration.vibrate(ms); } catch {} };

  const format = useCameraFormat(device, [{ fps: 30 }]);

  useEffect(() => {
    (async () => {
      if (!hasPermission) {
        await requestPermission();
      }
    })();
  }, [hasPermission, requestPermission]);

  const onCodes = useCallback((codes: { value?: string }[]) => {
    if (handledOnce || cooldown) return; // duplakatt. elkerul
    
    const value = codes?.[0]?.value?.trim();
    if (!value) return;
    
    const isAllowed = /^node/i.test(value);
    if (!isAllowed) {
      safeVibrate(15);
      setInvalidHint(true);
      setCooldown(true); 
      setTimeout(() => {
        setInvalidHint(false);
        setCooldown(false);
      }, 1500); // 1,5 sec
      return;
    }

    setHandledOnce(true);
    safeVibrate(100);
    navigation.replace('Target', { startId: value });
    
  }, [handledOnce, cooldown, navigation]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'], 
    onCodeScanned: onCodes,
  });

  if (!device || !hasPermission || !format) {
    return <View style={styles.loadingScreen} />;
  }

  const canUseTorch = !!device.hasTorch;

  return (
    <View style={{ flex: 1, backgroundColor: 'black' }}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!handledOnce}
        codeScanner={codeScanner}
        format={format}
        fps={30}
        torch={torchOn ? 'on' : 'off'}
      />

    
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {/* Felső sáv */}
        <View style={[styles.overlay, { top: 0, left: 0, right: 0, height: TOP }]} />

        {/* Alsó sáv */}
        <View style={[styles.overlay, { top: TOP + WINDOW_SIZE, left: 0, right: 0, bottom: 0 }]} />

        {/* Bal sáv */}
        <View style={[styles.overlay, { top: TOP, left: 0, width: LEFT, height: WINDOW_SIZE }]} />

        {/* Jobb sáv */}
        <View style={[styles.overlay, { top: TOP, left: LEFT + WINDOW_SIZE, right: 0, height: WINDOW_SIZE }]} />

        {/* Scannelő ablak és a sarkok */}
        <View style={[styles.scanWindowAbs, { top: TOP, left: LEFT, width: WINDOW_SIZE, height: WINDOW_SIZE }]}>
          <View style={[styles.corner, styles.tl]} />
          <View style={[styles.corner, styles.tr]} />
          <View style={[styles.corner, styles.bl]} />
          <View style={[styles.corner, styles.br]} />
        </View>
      </View>


      {/* Felső help szöveg */}
      

      <View pointerEvents="box-none" style={styles.topHint}>   
        <TouchableOpacity style={styles.topBtn} onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faCircleXmark} size={35} color="#fff" />
        </TouchableOpacity>     
        <Text style={styles.hintText}>Olvasd be a QR-kódot</Text>
      </View>

      {invalidHint && (
      <View style={styles.invalidBox}>
        <Text style={styles.invalidText}>
           Érvénytelen QR-kód 
        </Text>
      </View>
    )}

      {/* Alsó gombsor */}
      <View style={styles.bottomBar}>
        {canUseTorch && (
          <TouchableOpacity
            onPress={() => setTorchOn((t) => !t)}
            activeOpacity={0.8}
            style={[styles.btn, torchOn && styles.btnActive]}
          >
            <View style={styles.textBox}>
            <FontAwesomeIcon icon={faLightbulb} size={28} color="#fff" />
            <Text style={styles.btnText}>{torchOn ? 'Zseblámpa KI' : 'Zseblámpa BE'}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingScreen: { 
    flex: 1, 
    backgroundColor: 'black' 
  },
  overlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scanWindowAbs: {
    position: 'absolute',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#ffd18b',
  },
  tl: { top: 0, left: 0, borderLeftWidth: 4, borderTopWidth: 4, borderTopLeftRadius: 1 },
  tr: { top: 0, right: 0, borderRightWidth: 4, borderTopWidth: 4, borderTopRightRadius: 1 },
  bl: { bottom: 0, left: 0, borderLeftWidth: 4, borderBottomWidth: 4, borderBottomLeftRadius: 1 },
  br: { bottom: 0, right: 0, borderRightWidth: 4, borderBottomWidth: 4, borderBottomRightRadius: 1 },

  topHint: {
    position: 'absolute',
    top: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',    
  },
  topBtn: { 
    flexDirection: 'row', 
    gap: 8,
    marginLeft: 20, 
  },
  hintText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
    textAlign: 'center',
    marginLeft: 62.9,
  },
  invalidBox: {
    position: 'absolute', 
    top: 70, 
    width: '100%', 
    alignItems: 'center'
  },
  invalidText: {
    color: '#ffb3b3', 
    fontWeight: '600'
  },
  bottomBar: {
    position: 'absolute',
    bottom: 28,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  btn: {
    paddingVertical: 10,
    paddingRight: 16,
    paddingLeft: 10,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  btnActive: {
    backgroundColor: 'rgba(255,209,139,0.22)',
    borderColor: '#ffd18b',
  },
  textBox: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  btnText: {
    color: 'white',
    fontWeight: '600',
    textAlignVertical: 'center',
    marginLeft: 5,
  },
});

export default QRScannerScreen;
