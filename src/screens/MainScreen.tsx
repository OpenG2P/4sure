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
  openedByIntent: any;
  setIsBackEnabled: any;
  setOnBack: any;
}

const MainScreen: React.FC<MainScreenProps> = props => {
  const [isReadyToCapture, setIsReadyToCapture] = useState(false);
  const [photoPath, setPhotoPath] = useState('');
  const [vcPhotoPath, setVcPhotoPath] = useState('');
  const [beneficiaryVCPhotoPath, setBeneficiaryVCPhotoPath] = useState('');
  const [isCardValid, setIsCardValid] = useState('unverified');

  const {
    state,
    vcData,
    beneficiaryVCData,
    setIsFaceVerified,
    isFaceVerified,
    setIsBackEnabled,
    setOnBack,
    setVCData,
  } = props;

  useEffect(() => {
    if (vcData && !vcPhotoPath) {
      setVCPhoto();
    }
    if (beneficiaryVCData && !beneficiaryVCPhotoPath) {
      setBeneficiaryVCPhoto();
    }
    if (!vcData && !isReadyToCapture && !photoPath && state.name === 'Idle') {
      setOnBack(() => () => {
        restartProcess(false);
      });
      setIsBackEnabled(false);
    } else if (vcData && isReadyToCapture && !photoPath) {
      setOnBack(() => () => {
        setVCData(null);
        setIsReadyToCapture(false);
        setPhotoPath('');
      });
      setIsBackEnabled(true);
    } else if (vcData && photoPath && isFaceVerified === 'unverified') {
      setOnBack(() => () => {
        setPhotoPath('');
        props.setCapturedPhoto(null);
        props.setIsFaceVerified('unverified');
        setIsReadyToCapture(true);
      });
      setIsBackEnabled(true);
    } else if (vcPhotoPath || beneficiaryVCPhotoPath) {
      setOnBack(() => () => {
        restartProcess(false);
      });
      setIsBackEnabled(true);
    } else if (state.name === 'Advertising') {
      setOnBack(() => () => {
        restartProcess(false);
      });
      setIsBackEnabled(true);
    } else if (vcData && !isReadyToCapture && !photoPath) {
      setOnBack(() => () => {
        restartProcess();
      });
      setIsBackEnabled(true);
    } else if (
      vcData &&
      isFaceVerified === 'successful' &&
      isCardValid === 'unverified'
    ) {
      setOnBack(() => () => {
        restartProcess();
      });
      setIsBackEnabled(true);
    }
    if (vcData && isFaceVerified === 'failed') {
      setIsBackEnabled(false);
    }
    if (isCardValid === 'valid') {
      console.log('Setting back enabled');
      setIsBackEnabled(false);
    } else if (isCardValid === 'invalid') {
      setIsBackEnabled(false);
    }
  }, [
    vcPhotoPath,
    beneficiaryVCPhotoPath,
    vcData,
    isReadyToCapture,
    photoPath,
    isFaceVerified,
    isCardValid,
    beneficiaryVCData,
    state,
  ]);

  const restartProcess = (startAdvertising = true) => {
    props.setVCData(null);
    props.ovpble.stopTransfer();
    setPhotoPath('');
    setIsReadyToCapture(false);
    setVcPhotoPath('');
    props.setBeneficiaryVCData(null);
    setBeneficiaryVCPhotoPath('');
    props.setIsFaceVerified('unverified');
    if (startAdvertising) {
      props.startNationalIDTransfer();
    }
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
    if (
      !vcData &&
      !isReadyToCapture &&
      !photoPath &&
      (state.name === 'Idle' || state.name === 'Received')
    ) {
      return (
        <VCDetailsScreen
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={false}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
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
            setIsFaceVerified('unverified');
          }}
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
            props.setCapturedPhoto(null);
            props.setIsFaceVerified('unverified');
            setIsReadyToCapture(true);
          }}
          onVerify={props.verifyFace}
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
          openedByIntent={props.openedByIntent}
          textData="Sorry! We couldn’t verify your photo. Please try again."
          onRetry={() => {
            setPhotoPath('');
            setIsReadyToCapture(true);
          }}
          onBack={() => {
            restartProcess(false);
          }}
          onSubmitWithoutVerification={props.returnVC}
        />
      );
    } else if (isCardValid === 'valid') {
      return (
        <VerificationSuccessScreen
          onSubmit={props.returnVC}
          openedByIntent={props.openedByIntent}
          onBack={() => {
            restartProcess(false);
          }}
        />
      );
    } else if (isCardValid === 'invalid') {
      return (
        <VerificationFailureScreen
          openedByIntent={props.openedByIntent}
          textData="UIN do not match"
          onRetry={() => {
            setIsCardValid('unverified');
            setBeneficiaryVCPhotoPath('');
            props.setBeneficiaryVCData(null);
          }}
          onBack={() => {
            restartProcess(false);
          }}
          onSubmitWithoutVerification={props.returnVC}
        />
      );
    }

    return (
      <Text style={{color: 'black'}}>
        Debugging Information:
        {'\n'}
        vcData: {JSON.stringify(vcData)}
        {'\n'}
        isReadyToCapture: {isReadyToCapture.toString()}
        {'\n'}
        photoPath: {photoPath}
        {'\n'}
        isFaceVerified: {isFaceVerified}
        {'\n'}
        state: {JSON.stringify(state)}
        {'\n'}
        isCardValid: {isCardValid}
      </Text>
    );
  };

  return <SafeAreaView>{renderContent()}</SafeAreaView>;
};

export default MainScreen;
