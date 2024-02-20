import React, { useRef, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, PermissionsAndroid, Platform } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';
import RNFS from 'react-native-fs';

export default function CameraPage({ setPhoto }: { setPhoto: any }) {
  const [cameraPermission, setCameraPermission] = useState('denied');
  const device = useCameraDevice('front');
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
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({qualityPrioritization: 'balanced'});
        const photoBase64 = await RNFS.readFile(photo.path, 'base64');
        setPhoto(photoBase64);
        console.log('Photo captured:', photo.path);
      }
    }
  };

  if (!device) return <View style={styles.container}><Text>Camera not available</Text></View>;

  return (
    <View style={styles.container}>
      {cameraPermission === 'granted' && (
        <>
          <Camera ref={cameraRef} style={styles.preview} device={device} isActive={true} onInitialized={() => console.log('Camera is ready!')} photo={true}/>
          <Button title="Capture Photo" onPress={takePicture} />
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
    width: 300,
    height: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});
