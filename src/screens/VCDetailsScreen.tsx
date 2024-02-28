import React from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';
import {
  NationalCard,
  BeneficiaryCard,
  ButtonPrimary,
  BackButton,
} from '@/components';
import theme from '@/utils/theme';

interface VCDetailsScreenProps {
  vcData: any;
  vcPhotoPath: string;
  beneficiaryVCData: any;
  beneficiaryVCPhotoPath: string;
  isIdVerified: boolean;
  onNationalIDClick: () => void;
  onBeneficiaryIDClick: () => void;
  onCapturePhoto: () => void;
  onBack: (startAdvertising: boolean) => void;
  setIsCardValid: (state: string) => void;
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
  onBack,
}) => {
  const validateCards = () => {
    console.log('Validating both the cards UIN');
    if (
      vcData?.verifiableCredential?.credential?.credentialSubject?.UIN ===
      beneficiaryVCData?.verifiableCredential?.credential?.credentialSubject
        ?.UIN
    ) {
      setIsCardValid('valid');
    } else {
      setIsCardValid('invalid');
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {(vcPhotoPath || beneficiaryVCPhotoPath) && (
        <BackButton
          style={styles.backButtonStyle}
          source={require('../../assets/images/back.png')}
          onPress={() => onBack(false)}
        />
      )}
      <View style={styles.detailsContainer}>
        <Text style={theme.headingText}>Add Your ID Cards</Text>
        {/* <Text style={theme.subHeadingText}>
          Add VCs here to verify the details
        </Text> */}
        <NationalCard
          source={{uri: 'file://' + vcPhotoPath}}
          fullName={
            vcData?.verifiableCredential?.credential?.credentialSubject
              ?.fullName
          }
          isVerified={vcData?.isVerified}
          isPhotoIDVerified={isIdVerified}
          uin={vcData?.verifiableCredential?.credential?.credentialSubject?.UIN}
          idType={'National Card'}
          generatedOn={vcData?.generatedOn}
          onCapturePhoto={onCapturePhoto}
          onPress={onNationalIDClick}
        />
        <BeneficiaryCard
          source={{uri: 'file://' + beneficiaryVCPhotoPath}}
          fullName={
            beneficiaryVCData?.verifiableCredential?.credential
              ?.credentialSubject?.fullName?.[0]?.value
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
            title="VALIDATE"
            onPress={validateCards}
            style={styles.buttonStyle}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
