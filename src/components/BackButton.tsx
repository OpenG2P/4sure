import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from 'react-native';

export function BackButton(props: {
  source: ImageSourcePropType;
  style: any;
  onPress: () => void;
}) {
  return (
    <View style={styles.backButtonContainer}>
      <TouchableOpacity
        style={props.style}
        onPress={props.onPress}
        activeOpacity={0.9}>
        <Image source={props.source} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    position: 'absolute',
    marginTop: -20,
    marginLeft: 20,
  },
  image: {
    width: 45,
    height: 45,
  },
});
