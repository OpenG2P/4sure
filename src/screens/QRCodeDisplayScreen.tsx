// QRCodeDisplayScreen.tsx
import React from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import theme from '@/utils/theme';

interface QRCodeDisplayScreenProps {
  uri: string;
}

export const QRCodeDisplayScreen: React.FC<QRCodeDisplayScreenProps> = ({
  uri,
}) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.textContainer}>
        <Text style={theme.headingText}>
          Scan this QR code using Inji Wallet App
        </Text>
      </View>
      <View style={styles.qrCodeContainer}>
        <QRCode size={200} value={uri} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 280,
  },
  textContainer: {
    position: 'relative',
  },
  qrCodeContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
});
