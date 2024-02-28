import React from 'react';
import {Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {ButtonPrimary} from '@/components';
import theme from '@/utils/theme';

interface VerificationSuccessScreenProps {
  openedByIntent: boolean;
  onSubmit: () => void;
}

export const VerificationSuccessScreen: React.FC<
  VerificationSuccessScreenProps
> = ({openedByIntent, onSubmit}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/success.png')} // Adjust the image path as necessary
        style={styles.imageStyle}
      />
      <Text style={[theme.headingText, styles.textStyle]}>Thank You</Text>
      <Text style={theme.subHeadingText}>
        That's all we need for verifying your identity.
      </Text>
      {openedByIntent ? (
        <ButtonPrimary
          title="SUBMIT"
          onPress={onSubmit}
          style={styles.buttonStyle}
        />
      ) : (
        <ButtonPrimary
          title="CLOSE"
          onPress={onSubmit}
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
