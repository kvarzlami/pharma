import {Image, TouchableOpacity, View} from 'react-native';
import styles from '../styles/style';
import React from 'react';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
  }

  authorize() {
    // API.authorize(this.state).then(r => {
    //     console.log(r.data);
    //     if (r.data === 'OK') {
    //         this.props.navigation.navigate('Panel');
    //     } else {
    //         ToastAndroid.show(r.data, 2000);
    //     }
    // });
    this.props.navigation.replace('Panel');
  }

  render() {
    setTimeout(() => {
      this.authorize();
    }, 2000);

    return (
      <View
        style={[
          styles.container,
          {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#01AAAD',
          },
        ]}>
        <TouchableOpacity>
          <Image
            style={{
              marginTop: 30,
              width: 200,
              height: 200,
            }}
            source={require('../img/logo.png')}
          />
        </TouchableOpacity>
      </View>
    );
  }
}
