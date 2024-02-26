import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import theme from '@/utils/theme';
import {ButtonPrimary, BackButton, ScreenImage} from '@/components';

interface WaitingScreenProps {
  onDisconnect: () => void;
  onBack: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({
  onDisconnect,
  onBack,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton
        style={styles.backButtonStyle}
        source={require('../../assets/images/back.png')}
        onPress={onBack}
      />
      <Text style={theme.headingText}>
        Waiting for beneficiary to share the VC
      </Text>
      <View style={styles.mainContainer}>
        <ScreenImage
          style={null}
          source={require('../../assets/images/waiting_image.png')}
        />
      </View>
      <ButtonPrimary style={null} title="DISCONNECT" onPress={onDisconnect} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonStyle: {
    position: 'relative',
    top: 0,
  },
  mainContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 60,
  },
});
