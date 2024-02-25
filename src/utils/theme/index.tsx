import {colors} from './colors';
import {textVariants} from './text-variants';

const theme: any = {
  colors,
  textVariants,
  fontFamily: 'Roboto',
  mainContainer: {
    padding: 10,
    alignItems: 'center',
    marginBottom: 60,
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
  subHeadingText: {
    fontSize: 18,
    fontWeight: '300',
    textAlign: 'center',
    marginLeft: '20%',
    marginRight: '20%',
    // marginBottom: 40,
    color: colors.subHeadingText,
  },
  camHeadingText: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: '15%',
    marginRight: '15%',
    bottom: '30%',
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  preview: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    left: 0,
    right: 0,
    bottom: 30,
  },
  visualGuide: {
    width: 300,
    height: 350,
    borderWidth: 1,
    borderColor: '#24bb06',
    borderRadius: 10,
    bottom: '25%',
  },
};
export default theme;
