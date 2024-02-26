import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {ButtonPrimary, Card} from '@/components';
import theme from '@/utils/theme';

interface VCDetailsScreenProps {
  vcData: any;
  vcPhotoPath: string;
  onCapturePhoto: () => void;
}

export const VCDetailsScreen: React.FC<VCDetailsScreenProps> = ({
  vcData,
  vcPhotoPath,
  onCapturePhoto,
}) => {
  return (
    <SafeAreaView style={styles.container}>
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
    alignItems: 'center',
  },
  detailsContainer: {
    alignItems: 'center',
    marginTop: 50,
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
