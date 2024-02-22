import React, { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ButtonPrimary } from '@/components';
import theme from '@/utils/theme';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';
import RNFS from 'react-native-fs';

export default function CameraPage({ setPhoto }: { setPhoto: any }) {
  const [cameraPermission, setCameraPermission] = useState('denied');
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  async function requestCameraPermission() {
    const status = await request(PERMISSIONS.ANDROID.CAMERA);
    setCameraPermission(status);
    console.log('Camera permission status:', status);
    if (status !== 'granted') {
      openSettings().catch(() => console.warn('Cannot open settings'));
    }
  }

  const takePicture = async () => {
    if (device && cameraPermission === 'granted') {
      if (cameraRef.current == null) throw new Error('Camera ref is null!')
      if (cameraRef.current) {
        console.log('Taking Pic');
        const photo = await cameraRef.current.takePhoto({qualityPrioritization: 'balanced', enableShutterSound: true});
        const photoBase64 = await RNFS.readFile(photo.path, 'base64');
        setPhoto(photoBase64, photo.path);
        console.log('Photo captured:', photo.path);
      }
    }
  };

  if (!device) return <View style={styles.container}><Text>Camera not available</Text></View>;

  return (
    <View style={styles.container}>
      {cameraPermission === 'granted' && (
        <>
          <Camera ref={cameraRef} style={styles.preview} device={device} isActive={true} photo={true} />
          <View style={styles.overlayContainer}>
          <View style={theme.mainContainer}>
            <Text style={theme.camHeadingText}>Position the face in the frame</Text>
            <View style={styles.visualGuide}/>
            <ButtonPrimary title="CAPTURE" onPress={takePicture}/>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayContainer: {
    position: 'relative', 
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 30,
  },
  visualGuide: {
    width: 300,
    height: 350,
    borderWidth: 1,
    borderColor: '#24bb06',
    borderRadius: 10,
    bottom: '25%',
  },
});
