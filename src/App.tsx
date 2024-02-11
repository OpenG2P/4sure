import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, PermissionsAndroid, Platform, View, NativeModules } from 'react-native';
import { request, PERMISSIONS, openSettings } from 'react-native-permissions';
import { configure, faceCompare } from '@iriscan/biometric-sdk-react-native';
import OvpBle, { useUI } from '@mosip/ble-verifier-sdk';

import CameraPage from './CameraPage';
import { IntermediateStateUI } from './IntermediateStateUI';

const ovpble = new OvpBle({deviceName: "example"});

export default function App() {
  const [result, setResult] = useState<any>('');
  const [error, setError] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const {state} = useUI(ovpble);

  useEffect(() => {
    requestBluetoothPermissions();
    configureBiometricSDK();
  }, []);

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      await request(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE);
      await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN);
    }
  }

  async function configureBiometricSDK() {
    let config = {
      withFace: {
        encoder: {
          tfModel: {
            path: 'https://github.com/biometric-technologies/tensorflow-facenet-model-test/raw/master/model.tflite',
            inputWidth: 160,
            inputHeight: 160,
            outputLength: 512,
            modelChecksum: '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
          },
        },
        matcher: {
          threshold: 1.0,
        },
        liveness: {
          tfModel: {
            path: 'https://github.com/biometric-technologies/liveness-detection-model/releases/download/v0.2.0/deePix.tflite',
            inputWidth: 224,
            inputHeight: 224,
            // 0.0 - real, 1.0 - spoof
            threshold: 0.5,
            modelChecksum: "797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06",
          },
        },
      },
    };
    await configure(config).then(() => console.log('Biometric SDK Ready'));
  }

  const startTransfer = () => {
    setResult('');
    setError(null);

    ovpble.startTransfer()
      .then((vc) => {
        setResult(JSON.parse(vc));
        // console.log("VC_DEBUG", JSON.parse(vc))
      })
      .catch((err) => {
        setError(err);
      });

  };

  const returnVC = async () => {
    if (!result || !result.verifiableCredential || !capturedPhoto) {
      console.error('Required data is missing');
      return;
    }
    
    const vcPhotoBase64 = result.verifiableCredential.credentialSubject.photo;
    const comparisonResult = await faceCompare(capturedPhoto, vcPhotoBase64);

    if (comparisonResult) {
      const fullNameEng = result.verifiableCredential.credentialSubject.fullName.find((fn: { language: string; }) => fn.language === "eng").value;
      const genderEng = result.verifiableCredential.credentialSubject.gender.find((g: { language: string; }) => g.language === "eng").value;
      const dob = result.verifiableCredential.credentialSubject.dateOfBirth;
      const uin = result.verifiableCredential.credentialSubject.UIN;

      const jsonData = JSON.stringify({
        full_name: fullNameEng,
        gender: genderEng,
        dob: dob,
        uin: uin
      });

      NativeModules.ODKDataModule.returnDataToODKCollect(jsonData);
    } else {
      console.error('Face comparison failed: The faces do not match.');
    }
  };

  const setPhoto = (photoBase64: string) => {
    setCapturedPhoto(photoBase64);
  };

  return (
    <View style={styles.container}>
    {(state.name === 'Idle' || state.name === 'Disconnected') && (
      <Button title={'Start Transfer'} onPress={startTransfer} />
    )}
    {result && (
      <View>
        <Text style={styles.state}>Received VC</Text>
        <Text style={styles.state}>VC ID: {result?.id}</Text>
        {/* <Button title={'Restart'} onPress={startTransfer} /> */}
        <CameraPage setPhoto={setPhoto} />
        <Button title={'Return VC'} onPress={returnVC} />
      </View>
    )}
    {error && (
      <View>
        <Text style={styles.state}>Error In Transfer</Text>
        <Text style={styles.state}>error: {JSON.stringify(error)}</Text>
        <Button title={'Restart'} onPress={startTransfer} />
      </View>
    )}

    <IntermediateStateUI state={state} />
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  state: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
});