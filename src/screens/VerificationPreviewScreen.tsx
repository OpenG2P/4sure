// VerificationPreviewScreen.tsx
import React from 'react';
import {View, Text, Image, SafeAreaView, StyleSheet} from 'react-native';
import {ButtonSecondary, BackButton, ButtonPrimary} from '@/components';
import theme from '@/utils/theme';

interface VerificationPreviewScreenProps {
  photoPath: string;
  onRetake: () => void;
  onVerify: () => void;
  onBack: () => void;
}

export const VerificationPreviewScreen: React.FC<
  VerificationPreviewScreenProps
> = ({photoPath, onRetake, onVerify, onBack}) => {
  console.log('Photo path:', photoPath);
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        style={styles.backButtonStyle}
        source={require('../../assets/images/back.png')}
        onPress={onBack}
      />
      <View style={styles.textContainer}>
        <Text style={theme.headingText}>Preview</Text>
        <Text style={theme.subHeadingText}>
          Please confirm and proceed with verification.
        </Text>
      </View>
      <Image source={{uri: 'file://' + photoPath}} style={styles.imageStyle} />
      <View style={styles.buttonContainer}>
        <ButtonSecondary
          title="RETAKE"
          onPress={onRetake}
          style={styles.buttonStyle}
        />
        <ButtonPrimary
          title="VERIFY"
          onPress={onVerify}
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
  backButtonStyle: {
    position: 'absolute',
    top: 55,
    right: 110,
  },
  textContainer: {
    marginTop: 70,
  },

  imageStyle: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginVertical: 20,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // width: '100%',
    // paddingHorizontal: 20,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 50,
  },
});
