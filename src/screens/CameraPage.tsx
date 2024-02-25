import React, {useRef, useState, useEffect} from 'react';
import {Button, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {ButtonPrimary, BackButton} from '@/components';
import theme from '@/utils/theme';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import RNFS from 'react-native-fs';

export default function CameraPage({
  setPhoto,
  setIsReadyToCapture,
  setPhotoPath,
}: {
  setPhoto: any;
  setIsReadyToCapture: any;
  setPhotoPath: any;
}) {
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
    console.log('Camera permission status:', status);
    if (status !== 'granted') {
      openSettings().catch(() => console.warn('Cannot open settings'));
    }
  }

  const goBack = () => {
    setIsReadyToCapture(false);
    setPhotoPath('');
  };

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
      <View style={theme.container}>
        <Text>Camera not available</Text>
      </View>
    );

  return (
    <SafeAreaView style={{flex: 1}}>
      {cameraPermission === 'granted' && (
        <>
          <View style={theme.container}>
            <Camera
              key={cameraKey}
              ref={cameraRef}
              style={theme.preview}
              device={device}
              isActive={true}
              photo={true}
            />
            <BackButton
              style={{position: 'absolute', top: 20, left: 20}}
              source={require('../../assets/images/back.png')}
              onPress={goBack}
            />
            <View style={theme.overlayContainer}>
              <View style={theme.mainContainer}>
                <Text style={theme.camHeadingText}>
                  Position the face in the frame
                </Text>
                <View style={theme.visualGuide} />
                <ButtonPrimary
                  style={null}
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
}
