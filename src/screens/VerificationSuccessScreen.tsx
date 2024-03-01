import React from 'react';
import {Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {ButtonPrimary, ButtonSecondary} from '@/components';
import theme from '@/utils/theme';

interface VerificationSuccessScreenProps {
  openedByIntent: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export const VerificationSuccessScreen: React.FC<
  VerificationSuccessScreenProps
> = ({openedByIntent, onSubmit, onBack}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/success.png')} // Adjust the image path as necessary
        style={styles.imageStyle}
      />
      <Text style={[theme.headingText, styles.textStyle]}>Completed</Text>
      <Text style={theme.subHeadingText}>UIN matches on both e-Cards</Text>
      {openedByIntent ? (
        <ButtonPrimary
          title="SUBMIT"
          onPress={onSubmit}
          style={styles.buttonStyle}
        />
      ) : (
        <ButtonSecondary
          title="BACK TO HOME"
          onPress={onBack}
          style={styles.buttonStyle}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  textStyle: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  buttonStyle: {
    marginTop: 50,
  },
});
