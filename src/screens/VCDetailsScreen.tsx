import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {NationalCard, BeneficiaryCard, BackButton} from '@/components';
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
  onBack: () => void;
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
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        style={styles.backButtonStyle}
        source={require('../../assets/images/back.png')}
        onPress={onBack}
      />
      <View style={styles.detailsContainer}>
        <Text style={theme.headingText}>Add Your ID Cards</Text>
        {/* <Text style={theme.subHeadingText}>
          Add VCs here to verify the details
        </Text> */}
        <NationalCard
          source={{uri: 'file://' + vcPhotoPath}}
          fullName={vcData?.credential?.fullName}
          isVerified={vcData?.isVerified}
          isPhotoIDVerified={isIdVerified}
          uin={vcData?.id}
          idType={vcData?.idType}
          generatedOn={vcData?.generatedOn}
          onCapturePhoto={onCapturePhoto}
          onPress={onNationalIDClick}
        />
        <BeneficiaryCard
          source={{uri: 'file://' + beneficiaryVCPhotoPath}}
          fullName={beneficiaryVCData?.credential?.fullName}
          isVerified={beneficiaryVCData?.isVerified}
          uin={beneficiaryVCData?.id}
          idType={beneficiaryVCData?.idType}
          generatedOn={beneficiaryVCData?.generatedOn}
          onPress={onBeneficiaryIDClick}
        />
        {/* <ButtonPrimary
          title="CAPTURE PHOTO"
          onPress={onCapturePhoto}
          style={styles.buttonStyle}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 50,
  },
  backButtonStyle: {
    position: 'relative',
    bottom: 10,
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
