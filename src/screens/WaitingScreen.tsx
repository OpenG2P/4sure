import React from 'react';
import {View, Text, SafeAreaView, StyleSheet, Image} from 'react-native';
import theme from '@/utils/theme';
import {
  ButtonPrimary,
  ButtonTertiary,
  BackButton,
  ScreenImage,
} from '@/components';

interface WaitingScreenProps {
  onDisconnect: () => void;
}

export const WaitingScreen: React.FC<WaitingScreenProps> = ({onDisconnect}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={theme.headingText}>
        Waiting for beneficiary to share the e-Card
      </Text>
      <View style={styles.mainContainer}>
        <ScreenImage
          style={null}
          source={require('../../assets/images/waiting_anim.gif')}
        />
      </View>
      <ButtonTertiary style={null} title="DISCONNECT" onPress={onDisconnect} />
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
