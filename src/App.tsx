import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  View,
  NativeModules,
  Linking,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {configure, faceCompare} from '@iriscan/biometric-sdk-react-native';
import OvpBle, {useUI} from '@mosip/ble-verifier-sdk';
import SplashScreen from 'react-native-splash-screen';

import MainScreen from './screens/MainScreen';

const ovpble = new OvpBle({deviceName: 'example'});

export default function App() {
  const [result, setResult] = useState<any>('');
  const [beneficiaryVC, setBeneficiaryVC] = useState<any>('');
  const [error, setError] = useState<any>(null);
  const [beneficiaryError, setBeneficiaryError] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const {state} = useUI(ovpble);
  const [isFaceVerified, setIsFaceVerified] = React.useState('unverified');

  useEffect(() => {
    SplashScreen.hide();
    requestBluetoothPermissions();
    configureBiometricSDK();
  }, []);

  const [openedByIntent, setOpenedByIntent] = useState(false);

  useEffect(() => {
    const checkInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      // If there's an initial URL, it means the app was opened through an Intent/deep link
      setOpenedByIntent(!!initialURL);
    };

    checkInitialURL();
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
      },
    };
    await configure(config).then(() => console.log('Biometric SDK Ready'));
  }

  const startNationalIDTransfer = () => {
    setResult('');
    setError(null);

    ovpble
      .startTransfer()
      .then(vc => {
        setResult(JSON.parse(vc));
        console.log('VC Data:', vc);
      })
      .catch(err => {
        setError(err);
      });
  };

  const startBeneficiaryIDTransfer = () => {
    setBeneficiaryVC('');
    setBeneficiaryError(null);
    ovpble
      .startTransfer()
      .then(vc => {
        setBeneficiaryVC(JSON.parse(vc));
      })
      .catch(err => {
        setBeneficiaryError(err);
      });
  };

  const verifyFace = async () => {
    if (!result || !result.verifiableCredential || !capturedPhoto) {
      console.error('Required data is missing');
      setIsFaceVerified('failed');
      return;
    }
    var resultPhotoB64 =
      result.verifiableCredential?.credential?.credentialSubject?.face;
    const base64Pattern = /^data:image\/[a-z]+;base64,/;
    if (resultPhotoB64.match(base64Pattern)) {
      resultPhotoB64 = resultPhotoB64.replace(base64Pattern, '');
    }
    const comparisonResult = await faceCompare(resultPhotoB64, capturedPhoto);
    console.log('ComparisonResult:', comparisonResult);
    if (comparisonResult) {
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
      result.verifiableCredential?.credential?.credentialSubject?.fullName.find(
        (fn: {language: string}) => fn.language === 'eng',
      ).value;
    const genderEng =
      result.verifiableCredential?.credential?.credentialSubject?.gender.find(
        (g: {language: string}) => g.language === 'eng',
      ).value;
    const dob =
      result.verifiableCredential?.credential?.credentialSubject?.dateOfBirth;
    const uin =
      result.vverifiableCredential?.credential?.credentialSubject?.UIN;

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
        setBeneficiaryVCData={setBeneficiaryVC}
        ovpble={ovpble}
        setIsFaceVerified={setIsFaceVerified}
        returnVC={returnVC}
        isFaceVerified={isFaceVerified}
        verifyFace={verifyFace}
        startNationalIDTransfer={startNationalIDTransfer}
        startBeneficiaryIDTransfer={startBeneficiaryIDTransfer}
        vcData={result}
        beneficiaryVCData={beneficiaryVC}
        capturedPhoto={capturedPhoto}
        setCapturedPhoto={setCapturedPhoto}
        openedByIntent={openedByIntent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    backgroundColor: 'white',
    // color: 'black',
  },
});
