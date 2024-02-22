import * as React from 'react';

import {StyleSheet, Text, View, Image } from 'react-native';
import { ButtonPrimary, ScreenImage, Card } from '@/components';
import QRCode from 'react-native-qrcode-svg';
import { IntermediateState } from '@mosip/ble-verifier-sdk';
import theme from '@/utils/theme';
import CameraPage from './CameraPage';
import RNFS from 'react-native-fs';

export function QRCodeUI(props: { state: IntermediateState,  transferFun: any, vcData: any, capturedPhoto: any, setCapturedPhoto: any }) {
  console.log('IntermediateStateUI', props.state, 'Actions', props.state.actions);
  const restartProcess = () => {
    props.state.actions.disconnect();
    props.transferFun();
  }
  const [isReadyToCapture, setIsReadyToCapture] = React.useState(false);
  const [photoPath, setPhotoPath] = React.useState('');
  const [vcPhotoPath, setVcPhotoPath] = React.useState('');
  
  const capturePhoto = () => {
    setPhotoPath('');
    setIsReadyToCapture(true);
    
  }
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
      vcPhotoBase64 = vcPhotoBase64.replace(base64Pattern, "");
    }
  
    const path = RNFS.TemporaryDirectoryPath + '/face.jpg';
  
    RNFS.writeFile(path, vcPhotoBase64, 'base64')
      .then(() => {
        console.log('File written to:', path);
        setVcPhotoPath(path); // Assuming setVcPhotoPath updates state correctly
      })
      .catch((err) => {
        console.error('Error writing file:', err.message);
      });
  }
  return (
    <View>
       {(props.state.name === 'Advertising') && (
      <>
        <Text style={theme.headingText}>Scan this QR code using Inji Wallet App</Text>
        <View style={theme.mainContainer}>
          <QRCode size={200} value={(props.state.data as { uri: string; }).uri} />
        </View>
      </>
      )}
      { props.state.name === 'SecureConnectionEstablished'
       && (
        <>
          <Text style={theme.headingText}>Waiting for beneficiary to share the VC</Text>
          <View style={theme.mainContainer}>
          <ScreenImage source={require('../../assets/images/waiting_image.png')} />      
          </View>
          <ButtonPrimary title="DISCONNECT" onPress={() =>  restartProcess()} />
        </>
      )}
      { (props.vcData && !isReadyToCapture)
       && (
        <>
          <Text style={theme.headingText}>VC Details</Text>
          <Text style={theme.subHeadingText}>Neque porro quisquam est qui dolorem quia dolor sit amet</Text>
          <View style={theme.mainContainer}>
            <Card source={{ uri: 'file://' + vcPhotoPath }} fullName={props.vcData.credential.fullName} isVerified={props.vcData.isVerified} uin={props.vcData.id} idType={props.vcData.idType} generatedOn={props.vcData.generatedOn} />
          </View>
          <ButtonPrimary title="CAPTURE & VERIFY" onPress={() => capturePhoto()} />
        </>
      )}

      { (props.vcData && isReadyToCapture && !photoPath)
       && (
        <CameraPage setPhoto={setPhoto} />
      )} 

    {(props.vcData && photoPath)
    
       && (
        <>
          <Text style={theme.headingText}>Preview</Text>
          <Text style={theme.subHeadingText}>Neque porro quisquam est qui dolorem quia dolor sit amet</Text>
          <View style={theme.mainContainer}>
          <ScreenImage source={{ uri: 'file://' + photoPath }} style={{ borderWidth: 1}} />      
          </View>
          <ButtonPrimary title="RETAKE" onPress={() => capturePhoto()} />
        </>
      )}
      
    </View>
  );
}
