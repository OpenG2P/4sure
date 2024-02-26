import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import {
  WaitingScreen,
  CameraScreen,
  VerificationPreviewScreen,
  VerificationFailureScreen,
  VerificationSuccessScreen,
  VCDetailsScreen,
  QRCodeDisplayScreen,
} from './index';
import RNFS from 'react-native-fs';

interface MainScreenProps {
  setVCData: any;
  ovpble: any;
  setIsFaceVerified: any;
  returnVC: any;
  isFaceVerified: string;
  state: any; // Adjust the type according to your state management
  transferFun: any;
  vcData: any;
  capturedPhoto: any;
  verifyFace: any;
  setCapturedPhoto: any;
}

const MainScreen: React.FC<MainScreenProps> = props => {
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [photoPath, setPhotoPath] = useState('');
  const [vcPhotoPath, setVcPhotoPath] = useState('');
  const {state, vcData, isFaceVerified} = props;

  useEffect(() => {
    if (vcData && !vcPhotoPath) {
      setVCPhoto();
    }
  }, [vcData, vcPhotoPath]);

  const restartProcess = () => {
    props.setVCData(null);
    props.ovpble.stopTransfer();
    setPhotoPath('');
    setIsReadyToCapture(false);
    setVcPhotoPath('');
    props.setIsFaceVerified('unverified');
    props.transferFun();
    console.log('Restarting the process', isReadyToCapture, !vcData);
  };

  const setVCPhoto = () => {
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
        setVcPhotoPath(path);
      })
      .catch(err => {
        console.error('Error writing file:', err.message);
      });
  };

  const renderContent = () => {
    if (state.name === 'Advertising') {
      return <QRCodeDisplayScreen uri={state.data.uri} />;
    } else if (
      state.name === 'SecureConnectionEstablished' ||
      state.name === 'Connected'
    ) {
      return (
        <WaitingScreen onDisconnect={restartProcess} onBack={restartProcess} />
      );
    } else if (vcData && !isReadyToCapture && !photoPath) {
      return (
        <VCDetailsScreen
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          onBack={restartProcess}
          onCapturePhoto={() => setIsReadyToCapture(true)}
        />
      );
    } else if (vcData && isReadyToCapture && !photoPath) {
      return (
        <CameraScreen
          setPhoto={(base64: string, path: string) => {
            props.setCapturedPhoto(base64);
            setPhotoPath(path);
            console.log('Photo captured:', path);
          }}
          setIsReadyToCapture={setIsReadyToCapture}
          setPhotoPath={setPhotoPath}
        />
      );
    } else if (vcData && photoPath && isFaceVerified === 'unverified') {
      console.log('Verifying face...');
      console.log('Captured photo:', photoPath);
      return (
        <VerificationPreviewScreen
          photoPath={photoPath}
          onRetake={() => {
            setPhotoPath('');
            setIsReadyToCapture(true);
          }}
          onVerify={props.verifyFace}
          onBack={() => {
            setPhotoPath('');
            setIsReadyToCapture(true);
          }}
        />
      );
    } else if (vcData && isFaceVerified === 'successful') {
      return <VerificationSuccessScreen onSubmit={props.returnVC} />;
    } else if (vcData && isFaceVerified === 'failed') {
      return (
        <VerificationFailureScreen
          onRetry={() => {
            setPhotoPath('');
            setIsReadyToCapture(true);
          }}
          onSubmitWithoutVerification={props.returnVC}
        />
      );
    }

    return <Text>No active state</Text>;
  };

  return <SafeAreaView>{renderContent()}</SafeAreaView>;
};

export default MainScreen;
