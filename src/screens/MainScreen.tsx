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
  setBeneficiaryVCData: any;
  ovpble: any;
  setIsFaceVerified: any;
  returnVC: any;
  isFaceVerified: string;
  state: any; // Adjust the type according to your state management
  startNationalIDTransfer: any;
  startBeneficiaryIDTransfer: any;
  vcData: any;
  capturedPhoto: any;
  verifyFace: any;
  setCapturedPhoto: any;
  beneficiaryVCData: any;
}

const MainScreen: React.FC<MainScreenProps> = props => {
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [photoPath, setPhotoPath] = useState('');
  const [vcPhotoPath, setVcPhotoPath] = useState('');
  const [beneficiaryVCPhotoPath, setBeneficiaryVCPhotoPath] = useState('');
  const [isCardValid, setIsCardValid] = useState('unverified');

  const {state, vcData, beneficiaryVCData, isFaceVerified} = props;

  useEffect(() => {
    if (vcData && !vcPhotoPath) {
      setVCPhoto();
    }
  }, [vcData, vcPhotoPath]);

  useEffect(() => {
    if (beneficiaryVCData && !beneficiaryVCPhotoPath) {
      setBeneficiaryVCPhoto();
    }
  }, [beneficiaryVCData, beneficiaryVCPhotoPath]);

  const restartProcess = () => {
    props.setVCData(null);
    props.ovpble.stopTransfer();
    setPhotoPath('');
    setIsReadyToCapture(false);
    setVcPhotoPath('');
    props.setIsFaceVerified('unverified');
    props.startNationalIDTransfer();
    setIsCardValid('unverified');
  };

  const setVCPhoto = () => {
    let vcPhotoBase64 =
      props?.vcData?.verifiableCredential?.credential?.credentialSubject?.face;
    console.log('VC Photo:', vcPhotoBase64);
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

  const setBeneficiaryVCPhoto = () => {
    console.log('Beneficiary VC Data Captured');
    let beneficiaryVCPhotoBase64 =
      props?.beneficiaryVCData?.verifiableCredential?.credential
        ?.credentialSubject?.face;

    // Remove data URL scheme if present
    const base64Pattern = /^data:image\/[a-z]+;base64,/;
    if (beneficiaryVCPhotoBase64.match(base64Pattern)) {
      beneficiaryVCPhotoBase64 = beneficiaryVCPhotoBase64.replace(
        base64Pattern,
        '',
      );
    }

    const path = RNFS.TemporaryDirectoryPath + '/beneficiary_face.jpg';

    RNFS.writeFile(path, beneficiaryVCPhotoBase64, 'base64')
      .then(() => {
        console.log('File written to:', path);
        setBeneficiaryVCPhotoPath(path);
      })
      .catch(err => {
        console.error('Error writing file:', err.message);
      });
  };

  const renderContent = () => {
    if (!vcData && !isReadyToCapture && !photoPath && state.name === 'Idle') {
      return (
        <VCDetailsScreen
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={false}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          onBack={restartProcess}
          onCapturePhoto={() => {
            null;
          }}
          onNationalIDClick={props.startNationalIDTransfer}
          onBeneficiaryIDClick={props.startBeneficiaryIDTransfer}
        />
      );
    } else if (state.name === 'Advertising') {
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
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={false}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          onBack={restartProcess}
          onCapturePhoto={() => setIsReadyToCapture(true)}
          onNationalIDClick={() => {
            null;
          }}
          onBeneficiaryIDClick={() => {
            null;
          }}
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
          restartProcess={restartProcess}
          setIsReadyToCapture={setIsReadyToCapture}
          setPhotoPath={setPhotoPath}
        />
      );
    } else if (vcData && photoPath && isFaceVerified === 'unverified') {
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
    } else if (
      vcData &&
      isFaceVerified === 'successful' &&
      isCardValid === 'unverified'
    ) {
      return (
        <VCDetailsScreen
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={true}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          onBack={restartProcess}
          onCapturePhoto={() => setIsReadyToCapture(true)}
          onNationalIDClick={() => {
            null;
          }}
          onBeneficiaryIDClick={props.startBeneficiaryIDTransfer}
        />
      );
    } else if (vcData && isFaceVerified === 'failed') {
      return (
        <VerificationFailureScreen
          textData="Sorry! We couldn’t verify your photo. Please try again."
          onRetry={() => {
            setPhotoPath('');
            setIsReadyToCapture(true);
          }}
          onSubmitWithoutVerification={props.returnVC}
        />
      );
    } else if (isCardValid === 'valid') {
      return <VerificationSuccessScreen onSubmit={props.returnVC} />;
    } else if (isCardValid === 'invalid') {
      return (
        <VerificationFailureScreen
          textData="Sorry! The UINs do not match"
          onRetry={() => {
            setIsCardValid('unverified');
            setBeneficiaryVCPhotoPath('');
            props.setBeneficiaryVCData(null);
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
