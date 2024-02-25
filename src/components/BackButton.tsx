import {
  StyleSheet,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';

export function BackButton(props: {
  source: ImageSourcePropType;
  style: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={props.style}
      onPress={props.onPress}
      activeOpacity={0.9}>
      <Image source={props.source} style={styles.image} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 45,
    height: 45,
    marginTop: 15,
    marginLeft: 20,
  },
});
