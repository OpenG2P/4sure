import * as React from 'react';

import {StyleSheet, Text, View, Image } from 'react-native';
import { ButtonPrimary, ScreenImage, Card } from '@/components';
import QRCode from 'react-native-qrcode-svg';
import { IntermediateState } from '@mosip/ble-verifier-sdk';
import theme from '@/utils/theme';

export function QRCodeUI(props: { state: IntermediateState }) {
  console.log('IntermediateStateUI', props.state, 'Actions', props.state.actions);
  return (
    <View>
       {props.state.name === 'Advertising' && (
      <>
        <Text style={theme.headingText}>Scan this QR code using Inji Wallet App</Text>
        <View style={theme.mainContainer}>
          <QRCode size={200} value={(props.state.data as { uri: string; }).uri} />
        </View>
      </>
      )}
      {props.state.name === 'SecureConnectionEstablished'
       && (
        <>
          <Text style={theme.headingText}>Waiting for beneficiary to share the VC
          </Text>
          <View style={theme.mainContainer}>
          <ScreenImage source={require('../../assets/images/waiting_image.png')} />      
          </View>
          <ButtonPrimary title="DISCONNECT" onPress={() => props.state.actions.disconnect()} />

        </>
      )}

      {props.state.name === 'Error'
       && (
        <>
          <Text style={theme.headingText}>VC Details</Text>

          <Text style={theme.subHeadingText}>Neque porro quisquam est qui
dolorem quia dolor sit amet</Text>

          <View style={theme.mainContainer}>
            <Card source={require('../../assets/images/waiting_image.png')} />
          </View>
          <ButtonPrimary title="CAPTURE & VERIFY" onPress={() => props.state.actions.disconnect()} />

        </>
      )}
    </View>
  );
}
