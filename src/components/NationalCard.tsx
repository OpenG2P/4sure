import theme from '@/utils/theme';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import {View, Image, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {CardButton} from '@/components';

export function NationalCard(props: {
  source: any;
  fullName: any;
  idType: string;
  uin: string;
  generatedOn: string;
  isVerified: string;
  isPhotoIDVerified: boolean;
  cardError: string;
  onPress: () => void;
  onCapturePhoto: () => void;
}) {
  var maskedUIN = '';
  var fullNameEng = '';
  var generatedOnWithoutTime = '';

  if (props.fullName) {
    maskedUIN = props.uin.length > 4 ? props.uin.slice(-4) : props.uin;
    fullNameEng = props.fullName.find(
      (fn: {language: string}) => fn.language === 'eng',
    ).value;
    generatedOnWithoutTime = props.generatedOn.split('T')[0];
    return (
      <View style={styles.cardContainer}>
        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <View>
              <Image source={props.source} style={styles.image} />
            </View>
            <View>
              <Text style={styles.topTitle}>Full Name</Text>
              <Text style={styles.name}>{fullNameEng}</Text>
              <Text style={styles.topTitle}>ID Type</Text>
              <Text style={styles.topDetail}>
                {props.idType === 'UIN' ? 'National Card' : props.idType}{' '}
              </Text>
            </View>
          </View>
          <Text style={styles.title}>National ID</Text>
          <Text style={styles.detail}>******{maskedUIN}</Text>
          <View style={styles.row}>
            <View>
              <Text style={styles.title}>Generated On</Text>
              <Text style={styles.detail}>{generatedOnWithoutTime}</Text>
            </View>
            <View>
              <Text style={styles.statusTitle}>Status</Text>
              <Text style={styles.status}>
                Valid <Icon name="check-circle" size={16} color="green" />
              </Text>
            </View>
          </View>
          <View style={styles.bottomLine} />
          {props.isPhotoIDVerified ? (
            <>
              <View>
                <Text style={styles.verifiedSign}>AUTHENTICATED</Text>
              </View>
            </>
          ) : (
            <CardButton
              title="AUTHENTICATE"
              onPress={props.onCapturePhoto}
              style={styles.buttonStyle}
              image={require('../../assets/images/cam.png')}
            />
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.emptyCardContainer}>
      <View>
        <Text style={styles.emptyTopTitle}>Add National ID</Text>
        <TouchableOpacity
          style={styles.placeHolderContainer}
          onPress={props.onPress}>
          <View style={styles.placeHolder}>
            <Text style={styles.plusSign}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.bottomLineEmpty} />
        {!props.cardError ? (
          <View style={styles.bottomRectangle} />
        ) : (
          <View style={styles.bottomRow}>
            <Image
              source={require('../../assets/images/warning.png')}
              style={styles.warningImage}
            />
            <Text style={styles.warning}>Choose only National id</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  verifiedSign: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'green',
    borderWidth: 2,
    borderRadius: 15,
    marginRight: 0,
    borderColor: 'green',
    padding: 1,
    textAlign: 'center',
    paddingTop: 4,
    width: 100,
  },
  buttonStyle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'green',
    borderWidth: 2,
    borderRadius: 15,
    marginRight: 0,
    padding: 1,
    paddingLeft: 5,
    paddingTop: 0,
    width: 125,
  },
  plusSign: {
    fontSize: 45,
    paddingBottom: 0,
    color: theme.colors.lineColor,
    fontWeight: '300',
  },
  placeHolderContainer: {
    left: '50%',
    marginTop: 20,
    marginBottom: 15,
  },
  placeHolder: {
    width: 75,
    height: 75,
    borderColor: theme.colors.lineColor,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  emptyTopTitle: {
    fontSize: 18,
    color: theme.colors.primary,
    marginRight: 60,
    fontWeight: 'bold',
  },
  emptyCardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: 'center',
    width: 315,
    height: 200,
    marginBottom: 15,
    marginTop: 15,
  },
  bottomLineEmpty: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.lineColor,
    marginBottom: 8,
    width: '150%',
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    alignItems: 'center',
    width: 315,
    marginBottom: 0,
    marginTop: 15,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 6,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  topTitle: {
    fontSize: 14,
    color: '#777',
    marginRight: 0,
    left: '5%',
  },
  title: {
    fontSize: 14,
    color: '#777',
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
    left: '5%',
  },
  topDetail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
    left: '5%',
  },
  detail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 0,
    marginLeft: '62%',
  },
  status: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    fontWeight: 'bold',
    marginLeft: '62%',
  },
  bottomLine: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.lineColor,
    marginBottom: 8,
  },
  bottomRectangle: {
    borderBottomWidth: 12,
    width: 110,
    borderBottomColor: theme.colors.lineColor,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 12,
  },
  warning: {
    fontSize: 14,
    color: '#FF475A',
    marginBottom: 0,
  },
  warningImage: {
    width: 20,
    height: 20,
    right: 0,
    top: 0,
  },
});
