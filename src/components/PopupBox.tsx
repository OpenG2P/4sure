import React from 'react';
import {Modal, StyleSheet, Text, View, SafeAreaView} from 'react-native';
import {ButtonPrimary} from './ButtonPrimary';
import {ButtonTertiary} from './ButtonTertiary';

export function PopupBox(props: {
  title: string;
  description: string;
  onPress: () => void;
  isPopupVisible: boolean;
  setPopupIsVisible: (isVisible: boolean) => void;
  setPopupType?: (type: string) => void;
}) {
  return (
    <SafeAreaView style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={props.isPopupVisible}
        onRequestClose={() => {
          props.setPopupIsVisible(false);
          props.setPopupType && props.setPopupType('default');
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{props.title}</Text>
            <Text style={styles.modalDescription}>{props.description}</Text>
            <View style={styles.row}>
              <ButtonTertiary
                title="CANCEL"
                onPress={() => {
                  props.setPopupIsVisible(false);
                  props.setPopupType && props.setPopupType('default');
                }}
                style={{
                  width: 120,
                  height: 40,
                  marginRight: 1,
                  padding: 8,
                }}
                buttonTextStyle={{fontSize: 16}}
              />
              <ButtonPrimary
                title="YES"
                onPress={props.onPress}
                style={{
                  width: 120,
                  height: 40,
                  marginLeft: 1,
                  padding: 8,
                }}
                buttonTextStyle={{fontSize: 16}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
    color: '#000000',
  },
  modalDescription: {
    marginBottom: 15,
    fontWeight: '300',
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});
