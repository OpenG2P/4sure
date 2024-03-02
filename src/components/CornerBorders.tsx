import React from 'react';
import {View, StyleSheet} from 'react-native';

const CornerBorders = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cornerBorderTopLeft} />
      <View style={styles.cornerBorderTopRight} />
      <View style={styles.cornerBorderBottomLeft} />
      <View style={styles.cornerBorderBottomRight} />
      {/* Content of the view goes here */}
    </View>
  );
};

const cornerBorderStyle = {
  height: 20, // Adjust the height to control the size of the 'border'
  width: 20, // Adjust the width to control the size of the 'border'
  borderColor: 'black', // Border color
  borderWidth: 2, // Border thickness
};

const styles = StyleSheet.create({
  container: {
    height: 100, // Set the desired height
    width: 100, // Set the desired width
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cornerBorderTopLeft: {
    ...cornerBorderStyle,
    borderTopWidth: 0,
    borderRightWidth: 0,
    left: 0,
    top: 0,
    position: 'absolute',
  },
  cornerBorderTopRight: {
    ...cornerBorderStyle,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    right: 0,
    top: 0,
    position: 'absolute',
  },
  cornerBorderBottomLeft: {
    ...cornerBorderStyle,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    left: 0,
    bottom: 0,
    position: 'absolute',
  },
  cornerBorderBottomRight: {
    ...cornerBorderStyle,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
});

export default CornerBorders;
