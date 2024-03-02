import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import {ButtonSecondary, ButtonPrimary} from '@/components';
import theme from '@/utils/theme';

interface VerificationFailureScreenProps {
  textData: string;
  openedByIntent: boolean;
  onRetry: () => void;
  onSubmitWithoutVerification: () => void;
  onBack: () => void;
}

export const VerificationFailureScreen: React.FC<
  VerificationFailureScreenProps
> = ({
  onRetry,
  openedByIntent,
  onSubmitWithoutVerification,
  textData,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require('../../assets/images/failure.png')}
        style={styles.imageStyle}
      />
      <Text style={[theme.headingText, styles.textStyle]}>Error</Text>
      <Text style={theme.subHeadingText}>{textData}</Text>
      <View style={styles.buttonContainer}>
        <ButtonSecondary
          title="RETRY"
          onPress={onRetry}
          style={styles.buttonStyle}
        />
        <ButtonPrimary
          title="HOME"
          onPress={onBack}
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
    justifyContent: 'center',
  },
  imageStyle: {
    width: 80,
    height: 80,
  },
  textStyle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    // marginTop: 20,
  },
  buttonStyle: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 30,
  },
});
