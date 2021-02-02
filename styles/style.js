import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  input: {
    width: 300,
    fontSize: 14,
  },
  button: {
    backgroundColor: '#37AAAE',
    paddingLeft: 15,
    paddingRight: 15,
    height: 40,
    marginBottom: 10,
    borderRadius: 10,
    color: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontFamily: 'BPGMrgvlovani',
    color: '#fff',
    fontSize: 12,
  },
  buttonSmall: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#37AAAE',
    paddingLeft: 15,
    paddingRight: 15,
    marginBottom: 5,
    borderRadius: 5,
    height: 30,
    color: '#ffffff',
  },
  buttonDisabled: {
    alignItems: 'center',
    backgroundColor: '#c6c6c6',
    padding: 10,
    paddingLeft: 25,
    paddingRight: 25,
    marginBottom: 10,
    borderRadius: 15,
    color: '#ffffff',
  },
  buttonWhite: {
    backgroundColor: '#ffffff',
    borderColor: '#37AAAE',
    borderWidth: 1,
  },
  searchInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
    width: '70%',
    paddingTop: 1,
    paddingBottom: 1,
    fontSize: 12,
  },
  head: {height: 40, backgroundColor: '#fff', color: '#fff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 40, padding: 10},
  text: {textAlign: 'center'},
  fill: {
    width: '100%',
  },
  horizontal: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  vertical: {
    flex: 0,
    flexDirection: 'column',
    width: '100%',
  },

  bold: {
    fontWeight: 'bold',
  },
  Mrgvlovani: {
    fontFamily: 'BPGMrgvlovani',
    fontSize: 12,
  },
  Dejavu: {
    fontFamily: 'DejaVuSansExtraLight',
  },

  textSmall: {
    fontSize: 12,
  },
  textMedium: {
    fontSize: 14,
  },
  textLarge: {
    fontSize: 18,
  },
  colorAccent: {
    color: '#37AAAE',
  },
  accent: {
    backgroundColor: '#37AAAE',
    color: '#fff',
    alignItems: 'center',
    padding: 10,
  },
  textAccent: {
    color: '#37AAAE',
  },
});
