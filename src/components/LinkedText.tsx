import {StyleSheet, Text, TouchableOpacity} from 'react-native';

export function LinkedText(props: {
  text: any;
  style: any;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <Text style={styles.testStyle}>{props.text}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  testStyle: {
    color: '#032BFF',
    fontWeight: 'bold',
    fontSize: 18,
    textDecorationLine: 'underline',
    marginTop: 20,
  },
});
