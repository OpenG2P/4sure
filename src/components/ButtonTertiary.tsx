import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import theme from '@/utils/theme';

export function ButtonTertiary(props: {
  buttonTextStyle?: any;
  style: any;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[secondaryStyles.button, props.style]}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <Text style={[secondaryStyles.buttonText, props?.buttonTextStyle]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
}

const secondaryStyles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    borderColor: theme.colors.primary,
    padding: 15,
    width: 280,
    height: 60,
    borderWidth: 2,
    // marginLeft: '15%',
    // marginRight: '15%',
  },
  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: 20,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
