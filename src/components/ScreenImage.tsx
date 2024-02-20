import { StyleSheet, Text, View, Image } from "react-native";
import theme from '@/utils/theme';

// Create a button with round shape
export function ScreenImage(props: { source: string }) {
  return (
    <View style={styles.container}>
      <Image source={props.source} style={styles.image} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        color: 'black',

    },
    image: {
        
        width: 282,
        height: 282,
        resizeMode: 'contain',
    },
  
});

