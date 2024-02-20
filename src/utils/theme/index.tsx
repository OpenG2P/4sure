import {colors} from './colors';
import { textVariants } from './text-variants';

const theme = {
    colors,
    textVariants,
    fontFamily: 'Roboto',
    QRContainer: {
        padding: 10,
        alignItems: 'center',
        marginBottom: 150,
        
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
};
export default theme;