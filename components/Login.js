import {
  Image,
  SafeAreaView,
  ScrollView,
  ToastAndroid,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/style';
import React from 'react';
import {Input} from 'react-native-elements';
import API from './API';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {
    PN: '',
    pwd: '',
  };

  authorize() {
    API.authorize(this.state).then((r) => {
      if (r.data === 'OK') {
        this.props.navigation.navigate('Panel');
      } else {
        ToastAndroid.show(r.data, 2000);
      }
    });
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.fill}>
          <View style={styles.container}>
            <Image
              style={{
                width: 250,
                height: 250,
              }}
              source={require('../img/pharmacist.png')}
            />
            <View
              style={{
                height: 20,
              }}></View>
            <View style={{paddingLeft: 20, paddingRight: 20, width: '100%'}}>
              <Input
                placeholder="პირადი ნომერი"
                leftIcon={{type: 'font-awesome-5', size: 15, name: 'user'}}
                style={[styles.input]}
                onChangeText={(pn) => {
                  this.setState({PN: pn});
                }}
              />
            </View>
            <View style={{paddingLeft: 20, paddingRight: 20, width: '100%'}}>
              <Input
                placeholder="პაროლი"
                leftIcon={{type: 'font-awesome-5', size: 15, name: 'key'}}
                style={[styles.input]}
                onChangeText={(pwd) => {
                  this.setState({pwd: pwd});
                }}
              />
            </View>

            <View
              style={{
                height: 30,
              }}></View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.authorize()}>
              <Text style={styles.buttonText}>ავტორიზაცია</Text>
            </TouchableOpacity>

            <View
              style={{
                height: 20,
              }}></View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
              }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  marginRight: 20,
                }}
                source={require('../img/fb.png')}
              />
              <Image
                style={{
                  width: 30,
                  height: 30,
                }}
                source={require('../img/google.png')}
              />
            </View>
            <View style={{height: 20}}></View>
            <View>
              <Text>ან</Text>
            </View>
            <View style={{height: 20}}></View>
            <View>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('newUser')}>
                <Text style={{color: '#187e92'}}>რეგისტრაცია</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
