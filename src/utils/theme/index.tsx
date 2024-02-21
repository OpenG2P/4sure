import {colors} from './colors';
import { textVariants } from './text-variants';

const theme = {
    colors,
    textVariants,
    fontFamily: 'Roboto',
    mainContainer: {
        padding: 10,
        alignItems: 'center',
        marginBottom: 100,
        
    },
    headingText: {
        marginTop: 60,
        fontSize: 22,
        fontWeight: '400',
        textAlign: 'center',
        marginLeft: '15%',
        marginRight: '15%',
        color: colors.headingText,
    },
    subHeadingText:{
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center',
        marginLeft: '15%',
        marginRight: '15%',
        marginBottom: 40,
        color: colors.subHeadingText,
    }
};
export default theme;