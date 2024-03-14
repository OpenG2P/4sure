import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  PermissionsAndroid,
  Platform,
  View,
  NativeModules,
  Image,
} from 'react-native';
import {request, PERMISSIONS} from 'react-native-permissions';
import {configure, faceCompare} from '@iriscan/biometric-sdk-react-native';
import OvpBle, {useUI} from '@mosip/ble-verifier-sdk';
import SplashScreen from 'react-native-splash-screen';
import {BackButton} from '@/components';
import MainScreen from './screens/MainScreen';
import Toast from 'react-native-simple-toast';

const ovpble = new OvpBle({deviceName: 'example'});

export default function App() {
  const [result, setResult] = useState<any>('');
  const [beneficiaryVC, setBeneficiaryVC] = useState<any>('');
  const [error, setError] = useState<any>(null);
  const [beneficiaryError, setBeneficiaryError] = useState<any>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const {state} = useUI(ovpble);
  const [isFaceVerified, setIsFaceVerified] = React.useState('unverified');
  const [openedByIntent, setOpenedByIntent] = useState(false);

  const [isBackEnabled, setIsBackEnabled] = useState(false);
  const [onBack, setOnBack] = useState<(enabled: boolean) => void>(
    () => () => {},
  );

  useEffect(() => {
    SplashScreen.hide();
    requestBluetoothPermissions();
    configureBiometricSDK();
    NativeModules.ODKDataModule.hasFullNameExtra()
      .then((intentExists: any) => {
        setOpenedByIntent(intentExists);
      })
      .catch((error: any) => {
        console.error('Error checking for intent:', error);
      });
    setIsBackEnabled(false);
  }, []);

  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // For Android 12 and above
        await request(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE);
        await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
      } else {
        // For Android 10 and below
        try {
          await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN,
          ]);
        } catch (err) {
          console.error('Error requesting Bluetooth permissions:', err);
        }
      }
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
          threshold: 2.0,
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
        if (
          JSON.parse(vc)?.verifiableCredential?.type?.includes(
            'MOSIPVerifiableCredential',
          ) ||
          JSON.parse(vc)?.verifiableCredential?.credential?.type?.includes(
            'MOSIPVerifiableCredential',
          )
        ) {
          setResult(JSON.parse(vc));
        } else {
          Toast.show('Invalid ID received!', Toast.SHORT);
          setIsBackEnabled(false);
        }
      })
      .catch(err => {
        setError(err);
      });
  };

  const startBeneficiaryIDTransfer = () => {
    setBeneficiaryVC('');
    setBeneficiaryError(null);
    if (!result) {
      Toast.show('Please add the National ID first', Toast.SHORT);
      return;
    }
    ovpble
      .startTransfer()
      .then(vc => {
        if (
          JSON.parse(vc)?.verifiableCredential?.type?.includes(
            'MOSIPVerifiableCredential',
          ) ||
          JSON.parse(vc)?.verifiableCredential?.credential?.type?.includes(
            'MOSIPVerifiableCredential',
          )
        ) {
          Toast.show('Invalid ID received!', Toast.SHORT);
        } else {
          setBeneficiaryVC(JSON.parse(vc));
        }
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
    let resultPhotoB64 = '';
    if (result?.verifiableCredential?.credential) {
      resultPhotoB64 =
        result?.verifiableCredential?.credential?.credentialSubject?.face;
    } else {
      resultPhotoB64 = result?.credential?.biometrics?.face;
    }

    const base64Pattern = /^data:image\/[a-z]+;base64,/;
    if (resultPhotoB64.match(base64Pattern)) {
      resultPhotoB64 = resultPhotoB64.replace(base64Pattern, '');
    }
    const comparisonResult = await faceCompare(resultPhotoB64, capturedPhoto);
    if (comparisonResult) {
      console.log('Face comparison successful: The faces match.');
      setIsFaceVerified('successful');
    } else {
      console.log('Face comparison failed: The faces do not match.');
      setIsFaceVerified('failed');
    }
  };

  const returnVC = () => {
    if (!isFaceVerified) {
      console.error('Face verification not successful or not yet performed.');
      return;
    }
    let resultData = null;
    let fullNameEng = '';
    let genderEng = '';
    if (result?.verifiableCredential?.credential?.credentialSubject) {
      resultData = result.verifiableCredential.credential.credentialSubject;
      fullNameEng = resultData?.fullName.value;
      genderEng = resultData?.gender.value;
    } else {
      resultData = result?.verifiableCredential?.credentialSubject;
      fullNameEng = resultData?.fullName.find(
        (fn: {language: string}) => fn.language === 'eng',
      ).value;
      genderEng = resultData?.gender.find(
        (g: {language: string}) => g.language === 'eng',
      ).value;
    }
    const dob = resultData?.dateOfBirth;
    const uin = resultData?.UIN;
    const programName =
      beneficiaryVC.verifiableCredential.credential.credentialSubject?.programName.find(
        (fn: {language: string}) => fn.language === 'eng',
      ).value;

    const jsonData = JSON.stringify({
      full_name: fullNameEng,
      gender: genderEng,
      dob: dob,
      uin: uin,
      program_name: programName,
      is_photo_verified: isFaceVerified === 'successful',
      vc_data: 'vc_data_sample',
    });

    NativeModules.ODKDataModule.returnDataToODKCollect(jsonData);
  };

  return (
    <View style={styles.container}>
      {isBackEnabled && (
        <BackButton
          style={{
            marginTop: '30%',
            right: '65%',
            height: 45,
            width: 140,
            // position: 'absolute',
          }}
          source={require('../assets/images/back.png')}
          onPress={() => onBack(true)}
        />
      )}
      <Image
        style={{
          left: '65%',
          marginTop: '4%',
          height: 45,
          width: 140,
          position: 'absolute',
        }}
        source={require('../assets/images/logo_dark.png')}
      />
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
        setIsBackEnabled={setIsBackEnabled}
        setOnBack={setOnBack}
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
