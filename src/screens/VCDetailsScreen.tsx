import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {ButtonPrimary, Card, BackButton} from '@/components';
import theme from '@/utils/theme';

interface VCDetailsScreenProps {
  vcData: any;
  vcPhotoPath: string;
  onCapturePhoto: () => void;
  onBack: () => void;
}

export const VCDetailsScreen: React.FC<VCDetailsScreenProps> = ({
  vcData,
  vcPhotoPath,
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
        <Text style={theme.headingText}>VC Details</Text>
        <Text style={theme.subHeadingText}>
          Verify the details of the Verifiable Credential
        </Text>
        <Card
          source={{uri: 'file://' + vcPhotoPath}}
          fullName={vcData.credential.fullName}
          isVerified={vcData.isVerified}
          uin={vcData.id}
          idType={vcData.idType}
          generatedOn={vcData.generatedOn}
        />
        <ButtonPrimary
          title="CAPTURE PHOTO"
          onPress={onCapturePhoto}
          style={styles.buttonStyle}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 100,
  },
  backButtonStyle: {
    position: 'relative',
    bottom: 43,
    right: 25,
  },
  detailsContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    marginTop: 50,
  },
});
