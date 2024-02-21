import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native";
import theme from '@/utils/theme';

export function ScreenImage(props: { source: ImageSourcePropType }) {
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

