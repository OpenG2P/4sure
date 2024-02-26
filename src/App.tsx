import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  View,
  NativeModules,
} from 'react-native';
import {request, PERMISSIONS, openSettings} from 'react-native-permissions';
import {configure, faceCompare} from '@iriscan/biometric-sdk-react-native';
import OvpBle, {useUI} from '@mosip/ble-verifier-sdk';
import SplashScreen from 'react-native-splash-screen';

import MainScreen from './screens/MainScreen';

const ovpble = new OvpBle({deviceName: 'example'});

export default function App() {
  const [result, setResult] = useState<any>('');
  const [error, setError] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const {state} = useUI(ovpble);
  const [isFaceVerified, setIsFaceVerified] = React.useState('unverified');

  useEffect(() => {
    SplashScreen.hide();
    requestBluetoothPermissions();
    configureBiometricSDK();
    startTransfer();
  }, []);

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      await request(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE);
      await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    } else if (Platform.OS === 'android') {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH,
      );
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
      );
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
            modelChecksum:
              '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
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
            modelChecksum:
              '797b4d99794965749635352d55da38d4748c28c659ee1502338badee4614ed06',
          },
        },
      },
    };
    await configure(config).then(() => console.log('Biometric SDK Ready'));
  }

  const startTransfer = () => {
    setResult('');
    setError(null);

    ovpble
      .startTransfer()
      .then(vc => {
        setResult(JSON.parse(vc));
        // console.log("VC_DEBUG", JSON.parse(vc))
      })
      .catch(err => {
        setError(err);
      });
  };

  const verifyFace = async () => {
    if (!result || !result.verifiableCredential || !capturedPhoto) {
      console.error('Required data is missing');
      setIsFaceVerified('failed');
      return;
    }

    const comparisonResult = await faceCompare(capturedPhoto, capturedPhoto);

    if (comparisonResult) {
      console.log(comparisonResult);
      console.log('Face comparison successful: The faces match.');
      setIsFaceVerified('successful');
    } else {
      console.error('Face comparison failed: The faces do not match.');
      setIsFaceVerified('failed');
    }
  };

  const returnVC = () => {
    if (!isFaceVerified) {
      console.error('Face verification not successful or not yet performed.');
      return;
    }

    const fullNameEng =
      result.verifiableCredential.credentialSubject.fullName.find(
        (fn: {language: string}) => fn.language === 'eng',
      ).value;
    const genderEng = result.verifiableCredential.credentialSubject.gender.find(
      (g: {language: string}) => g.language === 'eng',
    ).value;
    const dob = result.verifiableCredential.credentialSubject.dateOfBirth;
    const uin = result.verifiableCredential.credentialSubject.UIN;

    const jsonData = JSON.stringify({
      full_name: fullNameEng,
      gender: genderEng,
      dob: dob,
      uin: uin,
    });

    console.log('Returning data for UIN:', uin);
    NativeModules.ODKDataModule.returnDataToODKCollect(jsonData);
  };

  return (
    <View style={styles.container}>
      <MainScreen
        state={state}
        setVCData={setResult}
        ovpble={ovpble}
        setIsFaceVerified={setIsFaceVerified}
        returnVC={returnVC}
        isFaceVerified={isFaceVerified}
        verifyFace={verifyFace}
        transferFun={startTransfer}
        vcData={result}
        capturedPhoto={capturedPhoto}
        setCapturedPhoto={setCapturedPhoto}
      />
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
