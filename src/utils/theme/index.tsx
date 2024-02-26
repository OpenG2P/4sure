import {colors} from './colors';
import {textVariants} from './text-variants';

const theme: any = {
  colors,
  textVariants,
  fontFamily: 'Roboto',
  headingText: {
    marginTop: 60,
    fontSize: 22,
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: '15%',
    marginRight: '15%',
    color: colors.headingText,
  },
  subHeadingText: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginLeft: '15%',
    marginRight: '15%',
    color: colors.subHeadingText,
  },
};
export default theme;
