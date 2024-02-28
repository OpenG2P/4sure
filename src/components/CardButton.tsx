import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import theme from '@/utils/theme';

export function CardButton(props: {
  style: any;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[secondaryStyles.button, props.style]}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <Text style={secondaryStyles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const secondaryStyles = StyleSheet.create({
  button: {
    backgroundColor: 'black',
    borderRadius: 30,
    paddingTop: 6,
    width: 70,
    height: 30,
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
