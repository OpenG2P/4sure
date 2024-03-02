import React, {useEffect} from 'react';
import {View, Image, Text, SafeAreaView, StyleSheet} from 'react-native';
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
