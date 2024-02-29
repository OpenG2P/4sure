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
        <View style={styles.container}>
          <View style={styles.cornerBorderBottomRight} />
          <View style={styles.cornerBorderTopLeft} />
          <View style={styles.cornerBorderTopRight} />
          <View style={styles.cornerBorderBottomLeft} />
          <QRCode size={200} value={uri} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const cornerBorderStyle = {
  height: 25,
  width: 25,
  borderColor: '#7d23f3',
  borderWidth: 4,
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerBorderTopLeft: {
    ...cornerBorderStyle,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    right: '150%',
    bottom: '150%',
    position: 'absolute',
  },
  cornerBorderTopRight: {
    ...cornerBorderStyle,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    left: '150%',
    bottom: '150%',
    position: 'absolute',
  },
  cornerBorderBottomLeft: {
    ...cornerBorderStyle,
    borderTopWidth: 0,
    borderRightWidth: 0,
    right: '150%',
    top: '150%',
    position: 'absolute',
  },
  cornerBorderBottomRight: {
    ...cornerBorderStyle,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    left: '150%',
    top: '150%',
    position: 'absolute',
  },
  mainContainer: {
    paddingTop: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  textContainer: {
    position: 'relative',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 100,
    borderWidth: 10,
    borderStyle: 'dashed',
    borderColor: 'black',
  },
});
