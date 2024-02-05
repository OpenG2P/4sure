/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import OvpBle, { useUI } from '@mosip/ble-verifier-sdk';
import React, { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View, Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { IntermediateStateUI } from './IntermediateStateUI';


const ovpble = new OvpBle({deviceName: "example"});

function App(): React.JSX.Element {

  useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      // Android 12 (API level 31) or higher
      await request(PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE);
      await request(PERMISSIONS.ANDROID.BLUETOOTH_CONNECT);
    } else if (Platform.OS === 'android') {
      // Android 11 (API level 30) or lower
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH);
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADMIN);
    }
  };

  const {state} = useUI(ovpble)
  const [result, setResult] = useState<any>('');
  const [error, setError] = useState<any>(null);

  const startTransfer = () => {
    setResult('');
    setError(null);

    ovpble.startTransfer()
      .then((vc) => {
        setResult(JSON.parse(vc));
      })
      .catch((err) => {
        setError(err);
      });

    };

  const returnVC = () => {
    // TODO: Implement returnVC
  }
    
    const subject = result?.verifiableCredential?.credential?.credentialSubject;

  return (
    <View style={styles.container}>
      {(state.name === 'Idle' || state.name === 'Disconnected') && (
        <Button title={'Return VC'} onPress={returnVC} />
      )}
      {result && (
        <View>
          <Text style={styles.state}>Received VC</Text>
          <Text style={styles.state}>
            VC ID: {subject?.UIN || subject?.VID}
          </Text>
          <Button title={'Restart'} onPress={startTransfer} />
        </View>
      )}
      {error && (
        <View>
          <Text style={styles.state}>Error In Transfer</Text>
          <Text style={styles.state}>error: {JSON.stringify(error)}</Text>
          <Button title={'Restart'} onPress={startTransfer} />
        </View>
      )}
      <IntermediateStateUI state={state} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    color: 'black',
  },
  state: {
    fontSize: 20,
    marginBottom: 10,
    color: 'black',
  },
});

export default App;