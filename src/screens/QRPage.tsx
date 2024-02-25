import * as React from 'react';

import {StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {
  ButtonPrimary,
  ButtonSecondary,
  ScreenImage,
  Card,
  BackButton,
} from '@/components';
import QRCode from 'react-native-qrcode-svg';
import {IntermediateState} from '@mosip/ble-verifier-sdk';
import theme from '@/utils/theme';
import CameraPage from './CameraPage';
import RNFS from 'react-native-fs';

export function QRCodeUI(props: {
  setVCData: any;
  ovpble: any;
  setIsFaceVerified: any;
  returnVC: any;
  isFaceVerified: string;
  state: IntermediateState;
  transferFun: any;
  vcData: any;
  capturedPhoto: any;
  setCapturedPhoto: any;
  verifyFace: any;
}) {
  console.log(
    'IntermediateStateUI',
    props.state,
    'Actions',
    props.state.actions,
  );
  const restartProcess = () => {
    props.setVCData(null);
    props.ovpble.stopTransfer();
    setPhotoPath('');
    setIsReadyToCapture(true);
    props.setIsFaceVerified('unverified');
    props.transferFun();
  };
  const [isReadyToCapture, setIsReadyToCapture] = React.useState(false);
  const [photoPath, setPhotoPath] = React.useState('');
  const [vcPhotoPath, setVcPhotoPath] = React.useState('');

  const capturePhoto = () => {
    setPhotoPath('');
    setIsReadyToCapture(true);
    props.setIsFaceVerified('unverified');
  };

  const setPhoto = (photoBase64: string, photoPath: string) => {
    props.setCapturedPhoto(photoBase64);
    setPhotoPath(photoPath);
    console.log('Photo captured:', photoPath);
  };
  if (props.vcData) {
    console.log('VC Data Captured');
    let vcPhotoBase64 = props.vcData.credential.biometrics.face;

    // Remove data URL scheme if present
    const base64Pattern = /^data:image\/[a-z]+;base64,/;
    if (vcPhotoBase64.match(base64Pattern)) {
      vcPhotoBase64 = vcPhotoBase64.replace(base64Pattern, '');
    }

    const path = RNFS.TemporaryDirectoryPath + '/face.jpg';

    RNFS.writeFile(path, vcPhotoBase64, 'base64')
      .then(() => {
        console.log('File written to:', path);
        setVcPhotoPath(path); // Assuming setVcPhotoPath updates state correctly
      })
      .catch(err => {
        console.error('Error writing file:', err.message);
      });
  }

  return (
    <SafeAreaView key={isReadyToCapture ? 'camera-ready' : 'camera-not-ready'}>
      {props.state.name === 'Advertising' && (
        <>
          <Text style={theme.headingText}>
            Scan this QR code using Inji Wallet App
          </Text>
          <View style={theme.mainContainer}>
            <QRCode
              size={200}
              value={(props.state.data as {uri: string}).uri}
            />
          </View>
        </>
      )}
      {(props.state.name === 'SecureConnectionEstablished' ||
        props.state.name === 'Connected') && (
        <>
          <Text style={theme.headingText}>
            Waiting for beneficiary to share the VC
          </Text>
          <View style={theme.mainContainer}>
            <ScreenImage
              style={null}
              source={require('../../assets/images/waiting_image.png')}
            />
          </View>
          <ButtonPrimary
            style={null}
            title="DISCONNECT"
            onPress={() => restartProcess()}
          />
        </>
      )}
      {props.vcData && !isReadyToCapture && !photoPath && (
        <>
          <BackButton
            style={{position: 'absolute', top: 20, left: 0}}
            source={require('../../assets/images/back.png')}
            onPress={() => capturePhoto()}
          />
          <Text style={theme.headingText}>VC Details</Text>
          <Text style={theme.subHeadingText}>
            Neque porro quisquam est qui dolorem quia dolor sit amet
          </Text>
          <View style={theme.mainContainer}>
            <Card
              source={{uri: 'file://' + vcPhotoPath}}
              fullName={props.vcData.credential.fullName}
              isVerified={props.vcData.isVerified}
              uin={props.vcData.id}
              idType={props.vcData.idType}
              generatedOn={props.vcData.generatedOn}
            />
          </View>
          <ButtonPrimary
            style={null}
            title="CAPTURE PHOTO"
            onPress={() => capturePhoto()}
          />
        </>
      )}

      {props.vcData && isReadyToCapture && !photoPath && (
        <CameraPage
          setPhoto={setPhoto}
          setIsReadyToCapture={setIsReadyToCapture}
          setPhotoPath={setPhotoPath}
        />
      )}

      {props.vcData && photoPath && props.isFaceVerified === 'unverified' && (
        <>
          <BackButton
            style={{position: 'absolute', top: 20, left: 0}}
            source={require('../../assets/images/back.png')}
            onPress={() => capturePhoto()}
          />
          <Text style={theme.headingText}>Preview</Text>
          <Text style={theme.subHeadingText}>
            Please confirm and proceed with verification.
          </Text>
          <View style={theme.mainContainer}>
            <ScreenImage
              source={{uri: 'file://' + photoPath}}
              style={{borderWidth: 1}}
            />
          </View>
          <View style={styles.container}>
            <View style={styles.centerContainer}>
              <ButtonSecondary
                style={styles.buttonStyle}
                title="RETAKE"
                onPress={() => capturePhoto()}
              />
              <ButtonPrimary
                style={styles.buttonStyle}
                title="VERIFY"
                onPress={() => props.verifyFace()}
              />
            </View>
          </View>
        </>
      )}

      {props.vcData && props.isFaceVerified === 'successful' && (
        <>
          <ScreenImage
            style={{width: 80, height: 80}}
            source={require('../../assets/images/failure.png')}
          />
          <Text style={[theme.headingText, {fontWeight: 'bold', marginTop: 5}]}>
            Thank You
          </Text>
          <Text style={theme.subHeadingText}>
            That's all we need to start verifying your identity
          </Text>
          <ButtonPrimary
            style={{marginTop: 50}}
            title="SUBMIT"
            onPress={() => props.returnVC()}
          />
        </>
      )}
      {props.vcData && props.isFaceVerified === 'failed' && (
        <>
          <BackButton
            style={{top: 10}}
            source={require('../../assets/images/back.png')}
            onPress={() => capturePhoto()}
          />
          <ScreenImage
            style={{width: 80, height: 80}}
            source={require('../../assets/images/failure.png')}
          />
          <Text style={[theme.headingText, {fontWeight: 'bold', marginTop: 5}]}>
            Error
          </Text>
          <Text style={theme.subHeadingText}>
            Sorry! We couldn’t verify your photo. Please try again or, you can
            submit without verification
          </Text>
          <View style={styles.container}>
            <View style={styles.centerContainer}>
              <ButtonSecondary
                style={styles.buttonStyle}
                title="BACK"
                onPress={() => capturePhoto()}
              />
              <ButtonPrimary
                style={styles.buttonStyle}
                title="RESTART"
                onPress={() => restartProcess()}
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    width: 140,
  },
  centerContainer: {
    flexDirection: 'row',
    width: '15%',
    marginRight: '50%',
  },
});
