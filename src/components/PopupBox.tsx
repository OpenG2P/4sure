import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ButtonPrimary} from './ButtonPrimary';
import {ButtonTertiary} from './ButtonTertiary';

export function PopupBox(props: {
  title: string;
  description: string;
  onPress: () => void;
  popupType: string;
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
          props.setPopupType && props.setPopupType(props.popupType);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                props.setPopupIsVisible(false);
                props.setPopupType && props.setPopupType(props.popupType);
              }}>
              <Image
                source={require('../../assets/images/close.png')}
                style={styles.image}
              />
            </TouchableOpacity>
            <Text style={styles.modalText}>{props.title}</Text>
            <Text style={styles.modalDescription}>{props.description}</Text>
            <View style={styles.row}>
              <ButtonTertiary
                title="CANCEL"
                onPress={() => {
                  props.setPopupIsVisible(false);
                  props.setPopupType && props.setPopupType(props.popupType);
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
                title={props.popupType === 'default' ? 'BACK' : 'YES'}
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
  image: {
    width: 20,
    height: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    top: 10,
    marginBottom: 15,
    fontWeight: '500',
    fontSize: 22,
    textAlign: 'center',
    color: '#000000',
  },
  modalDescription: {
    top: 10,
    marginBottom: 15,
    fontWeight: '300',
    fontSize: 18,
    color: '#666666',
    textAlign: 'center',
  },
});
