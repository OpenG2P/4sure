import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import theme from '@/utils/theme';

// Create a button with round shape
export function ButtonPrimary(props: {
  style: any;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 30,
    padding: 15,
    width: 280,
    height: 60,
    marginLeft: '15%',
    marginRight: '15%',
  },
  buttonText: {
    color: theme.colors.textSecondary,
    fontSize: 20,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Create a button with round shape
export function ButtonSecondary(props: {
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
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    padding: 15,
    width: 280,
    height: 60,
    marginLeft: '15%',
    marginRight: '15%',
  },
  buttonText: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontFamily: theme.fontFamily,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
