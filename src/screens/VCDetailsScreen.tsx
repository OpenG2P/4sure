import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {
  NationalCard,
  BeneficiaryCard,
  ButtonPrimary,
  PopupBox,
} from '@/components';
import theme from '@/utils/theme';

interface VCDetailsScreenProps {
  vcData: any;
  vcPhotoPath: string;
  beneficiaryVCData: any;
  beneficiaryVCPhotoPath: string;
  isIdVerified: boolean;
  isPopupVisible: boolean;
  popupType: string;
  onNationalIDClick: () => void;
  onBeneficiaryIDClick: () => void;
  onCapturePhoto: () => void;
  setIsCardValid: (state: string) => void;
  setPopupIsVisible: (state: boolean) => void;
  onPress: () => void;
  setPopupType: (state: string) => void;
}

export const VCDetailsScreen: React.FC<VCDetailsScreenProps> = ({
  vcData,
  vcPhotoPath,
  beneficiaryVCData,
  beneficiaryVCPhotoPath,
  isIdVerified,
  onNationalIDClick,
  onBeneficiaryIDClick,
  onCapturePhoto,
  setIsCardValid,
  isPopupVisible,
  setPopupIsVisible,
  onPress,
  popupType,
  setPopupType,
}) => {
  let generatedOn = '';
  let fullName = [];
  if (vcData?.verifiableCredential?.credential?.credentialSubject) {
    generatedOn = vcData?.generatedOn;
    vcData = vcData.verifiableCredential.credential.credentialSubject;
    fullName = [vcData?.fullName];
  } else {
    generatedOn = vcData?.generatedOn;
    vcData = vcData?.verifiableCredential?.credentialSubject;
    fullName = vcData?.fullName;
  }
  const validateCards = () => {
    if (
      vcData?.UIN ===
      beneficiaryVCData?.verifiableCredential?.credential?.credentialSubject
        ?.nationalId
    ) {
      setIsCardValid('valid');
    } else {
      setIsCardValid('invalid');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={[theme.headingText, {fontSize: 28}]}>e-Cards</Text>
        {/* <Text style={theme.subHeadingText}>
          Add VCs here to verify the details
        </Text> */}
        <NationalCard
          source={{uri: 'file://' + vcPhotoPath}}
          fullName={fullName}
          isVerified={vcData?.isVerified}
          isPhotoIDVerified={isIdVerified}
          uin={vcData?.UIN}
          idType={'National Card'}
          generatedOn={generatedOn}
          onCapturePhoto={onCapturePhoto}
          onPress={onNationalIDClick}
        />
        <BeneficiaryCard
          source={{uri: 'file://' + beneficiaryVCPhotoPath}}
          fullName={
            beneficiaryVCData?.verifiableCredential?.credential
              ?.credentialSubject?.fullName?.[0]?.value
          }
          programName={
            beneficiaryVCData?.verifiableCredential?.credential
              ?.credentialSubject?.programName?.[0]?.value
          }
          isVerified={beneficiaryVCData?.isVerified}
          uin={
            beneficiaryVCData?.verifiableCredential?.credential
              ?.credentialSubject?.UIN
          }
          idType={'Beneficiary Card'}
          generatedOn={beneficiaryVCData?.generatedOn}
          onPress={onBeneficiaryIDClick}
        />
        {isIdVerified && beneficiaryVCPhotoPath && (
          <ButtonPrimary
            title="MATCH"
            onPress={validateCards}
            style={styles.buttonStyle}
          />
        )}
        {popupType === 'default' ? (
          <PopupBox
            title="Are you sure?"
            description="Clicking on back button will erase the data captured"
            onPress={onPress}
            isPopupVisible={isPopupVisible}
            setPopupIsVisible={setPopupIsVisible}
            setPopupType={setPopupType}
            popupType={popupType}
          />
        ) : (
          <PopupBox
            title="Are you sure?"
            description="Do you want to proceed back to home without Beneficiary validation?"
            onPress={onPress}
            isPopupVisible={isPopupVisible}
            setPopupIsVisible={setPopupIsVisible}
            setPopupType={setPopupType}
            popupType={popupType}
          />
        )}
      </View>
      {vcData && !beneficiaryVCData && isIdVerified && (
        <Text
          onPress={() => {
            setPopupType('type_a');
            setPopupIsVisible(true);
          }}
          style={styles.hyperlinkText}>
          Go back to Home
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hyperlinkText: {
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 18,
    fontWeight: '500',
  },
  container: {
    flex: 1,
    top: 10,
  },
  backButtonStyle: {
    position: 'relative',
    bottom: 0,
    top: 40,
    right: 25,
  },
  detailsContainer: {
    alignItems: 'center',
    // marginBottom: 30,
  },
  imageStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
  },
  buttonStyle: {
    marginTop: 10,
  },
});
