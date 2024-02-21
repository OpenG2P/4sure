import { StyleSheet, Text, View } from "react-native";
import theme from '@/utils/theme';

// Create a button with round shape
export function ButtonPrimary(props: { title: string, onPress: () => void }) {
  return (
    <View style={styles.button}>
      <Text style={styles.buttonText} onPress={props.onPress}>{props.title}</Text>
    </View>
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

