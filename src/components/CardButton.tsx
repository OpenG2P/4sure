import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ImageProps,
  Image,
  View,
} from 'react-native';
import theme from '@/utils/theme';
// import {Image} from 'react-native-svg';

export function CardButton(props: {
  style: any;
  title: string;
  image: ImageProps;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <View style={styles.rowContainer}>
        <Image source={props.image} style={styles.image} />
        <Text style={styles.buttonText}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingTop: 6,
    paddingHorizontal: 10,
    height: 28,
    justifyContent: 'center',
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 15.5,
    height: 13.6,
  },
});
