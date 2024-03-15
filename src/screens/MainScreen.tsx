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
  const [isPopupVisible, setPopupIsVisible] = useState(false);
  const [onConfirmFunc, setOnConfirmFunc] = useState(() => () => {});
  const [popupType, setPopupType] = React.useState('default');

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
  }, [vcData, vcPhotoPath, beneficiaryVCData, beneficiaryVCPhotoPath]);

  useEffect(() => {
    // Default settings
    let newOnBack = () => () => {};
    let newIsBackEnabled = true;
    let newPopupType = 'default';

    if (!vcData && !isReadyToCapture && !photoPath && state.name === 'Idle') {
      newOnBack = () => () => restartProcess();
      newIsBackEnabled = false;
    } else if (vcData && isReadyToCapture && !photoPath) {
      newOnBack = () => () => {
        setVCData(null);
        setIsReadyToCapture(false);
        setPhotoPath('');
      };
    } else if (vcData && photoPath && isFaceVerified === 'unverified') {
      newOnBack = () => () => {
        setPhotoPath('');
        props.setCapturedPhoto(null);
        props.setIsFaceVerified('unverified');
        setIsReadyToCapture(true);
      };
    } else if (state.name === 'Advertising') {
      if (isFaceVerified === 'successful') {
        newOnBack = () => () => restartBeneficiaryProcess();
      } else if (isFaceVerified === 'unverified') {
        newOnBack = () => () => restartProcess();
      }
    } else if (
      vcData &&
      !isReadyToCapture &&
      ((isFaceVerified && !beneficiaryVCData) || !photoPath)
    ) {
      newOnBack = () => () => {
        setPopupIsVisible(true);
        setOnConfirmFunc(() => () => {
          restartProcess();
          setPopupIsVisible(false);
        });
      };
    } else if (
      vcData &&
      isFaceVerified === 'successful' &&
      isCardValid === 'unverified' &&
      state.name !== 'Advertising'
    ) {
      newPopupType = vcData && !beneficiaryVCData ? 'type_a' : 'default';
      newOnBack = () => () => {
        setPopupIsVisible(true);
        setOnConfirmFunc(() => () => {
          (vcData && !beneficiaryVCData
            ? restartProcess
            : restartBeneficiaryProcess)();
          setPopupIsVisible(false);
        });
      };
    } else if (isFaceVerified === 'failed' || isCardValid !== 'unverified') {
      newIsBackEnabled = false;
    }

    setOnBack(newOnBack);
    setIsBackEnabled(newIsBackEnabled);
    setPopupType(newPopupType);
  }, [
    vcData,
    isReadyToCapture,
    photoPath,
    isFaceVerified,
    isCardValid,
    beneficiaryVCData,
    state.name,
  ]);

  const restartBeneficiaryProcess = (startAdvertising = false) => {
    props.ovpble.stopTransfer();
    setIsReadyToCapture(false);
    props.setBeneficiaryVCData(null);
    // Delete the file if it exists
    RNFS.unlink(beneficiaryVCPhotoPath)
      .then(() => {
        console.log('File deleted');
      })
      .catch(err => {
        console.log('Error deleting file:', err.message);
      });
    setBeneficiaryVCPhotoPath('');
    if (startAdvertising) {
      props.startBeneficiaryIDTransfer();
    }
    setIsCardValid('unverified');
  };

  const restartProcess = (startAdvertising = false) => {
    props.setVCData(null);
    props.ovpble.stopTransfer();
    setPhotoPath('');
    setIsReadyToCapture(false);
    // Delete the file if it exists
    RNFS.unlink(vcPhotoPath)
      .then(() => {
        console.log('File deleted');
      })
      .catch(err => {
        console.log('Error deleting file:', err.message);
      });
    setVcPhotoPath('');
    props.setBeneficiaryVCData(null);
    // Delete the file if it exists
    RNFS.unlink(beneficiaryVCPhotoPath)
      .then(() => {
        console.log('File deleted');
      })
      .catch(err => {
        console.log('Error deleting file:', err.message);
      });
    setBeneficiaryVCPhotoPath('');
    props.setIsFaceVerified('unverified');
    if (startAdvertising) {
      props.startNationalIDTransfer();
    }
    setIsCardValid('unverified');
  };

  const setVCPhoto = () => {
    let vcPhotoBase64 = '';
    if (props?.vcData?.verifiableCredential?.credential) {
      vcPhotoBase64 =
        props?.vcData?.verifiableCredential?.credential?.credentialSubject
          ?.face;
    } else {
      vcPhotoBase64 = props?.vcData?.credential?.biometrics?.face;
    }

    // Remove data URL scheme if present
    const base64Pattern = /^data:image\/[a-z]+;base64,/;
    if (vcPhotoBase64.match(base64Pattern)) {
      vcPhotoBase64 = vcPhotoBase64.replace(base64Pattern, '');
    }

    const path = RNFS.TemporaryDirectoryPath + '/face_' + Date.now() + '.jpg';

    RNFS.writeFile(path, vcPhotoBase64, 'base64')
      .then(() => {
        setVcPhotoPath(path);
      })
      .catch(err => {
        console.log('Error writing file:', err.message);
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

    const path =
      RNFS.TemporaryDirectoryPath + '/beneficiary_face_' + Date.now() + '.jpg';

    RNFS.writeFile(path, beneficiaryVCPhotoBase64, 'base64')
      .then(() => {
        console.log('File written to:', path);
        setBeneficiaryVCPhotoPath(path);
      })
      .catch(err => {
        console.log('Error writing file:', err.message);
      });
  };

  const renderContent = () => {
    if (
      // !vcData &&
      !isReadyToCapture &&
      !photoPath &&
      // !isCardValid &&
      (state.name === 'Idle' || state.name === 'Received')
    ) {
      return (
        <VCDetailsScreen
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={isFaceVerified === 'successful'}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          isPopupVisible={isPopupVisible}
          setPopupIsVisible={setPopupIsVisible}
          onPress={onConfirmFunc}
          popupType={popupType}
          setPopupType={setPopupType}
          onCapturePhoto={
            isFaceVerified === 'successful'
              ? () => {}
              : () => setIsReadyToCapture(true)
          }
          onNationalIDClick={props.startNationalIDTransfer}
          onBeneficiaryIDClick={
            isFaceVerified === 'successful'
              ? props.startBeneficiaryIDTransfer
              : () => {}
          }
        />
      );
    } else if (state.name === 'Advertising') {
      return <QRCodeDisplayScreen uri={state.data.uri} />;
    } else if (
      state.name === 'SecureConnectionEstablished' ||
      state.name === 'Connected'
    ) {
      return (
        <WaitingScreen
          onDisconnect={
            isFaceVerified === 'successful'
              ? () => restartBeneficiaryProcess(true)
              : () => restartProcess(true)
          }
        />
      );
    } else if (vcData && !isReadyToCapture && !photoPath) {
      return (
        <VCDetailsScreen
          beneficiaryVCData={beneficiaryVCData}
          beneficiaryVCPhotoPath={beneficiaryVCPhotoPath}
          setIsCardValid={setIsCardValid}
          isIdVerified={isFaceVerified === 'successful'}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          isPopupVisible={isPopupVisible}
          setPopupIsVisible={setPopupIsVisible}
          onPress={onConfirmFunc}
          popupType={popupType}
          setPopupType={setPopupType}
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
          isIdVerified={isFaceVerified === 'successful'}
          vcData={vcData}
          vcPhotoPath={vcPhotoPath}
          isPopupVisible={isPopupVisible}
          setPopupIsVisible={setPopupIsVisible}
          onPress={onConfirmFunc}
          popupType={popupType}
          setPopupType={setPopupType}
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
            restartProcess();
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
            restartProcess();
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
            restartProcess();
          }}
          onSubmitWithoutVerification={props.returnVC}
        />
      );
    }
  };

  return <SafeAreaView>{renderContent()}</SafeAreaView>;
};

export default MainScreen;
