import React, {useRef, useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {ButtonPrimary, BackButton} from '@/components';
import theme from '@/utils/theme';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import RNFS from 'react-native-fs';

interface CameraScreenProps {
  setPhoto: any;
  setIsReadyToCapture: any;
  setPhotoPath: any;
}

export const CameraScreen: React.FC<CameraScreenProps> = ({setPhoto}) => {
  const [cameraPermission, setCameraPermission] = useState('denied');
  const device = useCameraDevice('back');
  const cameraRef = useRef<Camera>(null);
  const [cameraKey, setCameraKey] = useState(1);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  async function requestCameraPermission() {
    const status = await request(PERMISSIONS.ANDROID.CAMERA);
    setCameraPermission(status);
    if (status !== 'granted') {
      openSettings().catch(() => console.warn('Cannot open settings'));
    }
  }

  const takePicture = async () => {
    if (device && cameraPermission === 'granted') {
      if (cameraRef.current == null) throw new Error('Camera ref is null!');
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          qualityPrioritization: 'balanced',
          enableShutterSound: true,
        });
        const photoBase64 = await RNFS.readFile(photo.path, 'base64');
        setCameraKey(prevKey => prevKey + 1);
        setPhoto(photoBase64, photo.path);
      }
    }
  };

  if (!device)
    return (
      <View style={styles.container}>
        <Text>Camera not available</Text>
      </View>
    );

  return (
    <SafeAreaView>
      {cameraPermission === 'granted' && (
        <>
          <View style={styles.container}>
            <Camera
              key={cameraKey}
              ref={cameraRef}
              style={styles.preview}
              device={device}
              isActive={true}
              photo={true}
            />
            <View style={styles.overlayContainer}>
              <View style={styles.mainContainer}>
                <Text style={styles.camHeadingText}>
                  Position the face in the frame
                </Text>
                <View style={styles.visualGuide} />
                <ButtonPrimary
                  style={{marginBottom: 10}}
                  title="CAPTURE"
                  onPress={takePicture}
                />
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  mainContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 60,
  },
  camHeadingText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: '15%',
    marginRight: '15%',
    bottom: '30%',
    color: theme.colors.textPrimary,
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
    height: 330,
    borderWidth: 1,
    borderColor: '#24bb06',
    borderRadius: 10,
    bottom: '25%',
  },
  preview: {
    position: 'absolute',
    top: '-6%',
    left: -2,
    right: -2,
    bottom: 0,
  },
});
