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
              <Text style={styles.detail}>
                {props.idType === 'UIN' ? 'National Card' : props.idType}{' '}
              </Text>
            </View>
            {props.isPhotoIDVerified && (
              <View>
                <Text style={styles.verifiedSign}>VERIFIED</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>UIN</Text>
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
            <View style={styles.bottomRectangle} />
          ) : (
            <CardButton
              title="VERIFY"
              onPress={props.onCapturePhoto}
              style={styles.buttonStyle}
            />
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.emptyCardContainer}>
      <View>
        <Text style={styles.emptyTopTitle}>National ID</Text>
        <TouchableOpacity
          style={styles.placeHolderContainer}
          onPress={props.onPress}>
          <View style={styles.placeHolder}>
            <Text style={styles.plusSign}>+</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.bottomLineEmpty} />
        <View style={styles.bottomRectangle} />
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
    paddingLeft: 6,
    paddingTop: 4,
    bottom: 30,
  },
  buttonStyle: {marginBottom: -5},
  plusSign: {
    fontSize: 55,
    paddingBottom: 10,
    color: theme.colors.lineColor,
    fontWeight: '200',
  },
  placeHolderContainer: {
    left: '50%',
    marginTop: 15,
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
    marginRight: 90,
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
    width: 300,
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
    width: 300,
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
  },
  title: {
    fontSize: 14,
    color: '#777',
  },
  name: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 0,
    marginLeft: 50,
  },
  status: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 10,
    fontWeight: 'bold',
    marginLeft: 50,
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
});
