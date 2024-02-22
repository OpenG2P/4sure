import { StyleSheet, Text, View, Image, ImageSourcePropType } from "react-native";

export function ScreenImage(props: { source: ImageSourcePropType, style: any }) {
  return (
    <View style={styles.container}>
      <Image source={props.source} style={[styles.image, props.style]} />
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

