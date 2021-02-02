import 'react-native-gesture-handler';
import React, {Component} from 'react';
import Panel from './components/Panel';
import styles from './styles/style';
import * as ReadSms from 'react-native-read-sms/ReadSms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import newUser from './components/NewUser';
import Login from './components/Login';
import Compare from './components/Compare';
import Pharmacy from './components/Pharmacy';
import Archive from './components/Archive';
import Home from './components/Home';
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import Modal from 'react-native-modal';
import API from './components/API';
import Recipe from './components/Recipe';
import getQ from './components/Helpers';

const Stack = createStackNavigator();

class App extends Component {
  state = {
    verified: false,
    sms: '',
    phone: '',
    showBottom: false,
    isModalVisible: false,
    digits: ['', '', '', ''],
  };

  navigation = null;

  constructor(props) {
    super(props);

    setTimeout(() => {
      this.setState({showBottom: true});
    }, 2000);
  }

  storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@phone', value);
    } catch (e) {
      // saving error
    }
  };

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@phone');
      if (value !== null) {
        return value;
      } else return false;
    } catch (e) {
      // error reading value
    }
  };

  componentWillMount = () => {
    this.startReadSMS();
  };

  startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();
    if (hasPermission) {
      ReadSms.startReadSMS((status, sms, error) => {
        if (status == 'success') {
          this.setState({sms: sms});
          if (sms.substr(0, 6) === 'Code: ') {
            let code = sms.substr(6);
            let digits = [];
            for (var i = 0; i < code.length; i++) {
              digits[i] = code.charAt(i);
            }
            this.componentWillUnmount();
            this.setState({digits: digits});
          }
        }
      });
    }
  };

  componentWillUnmount = () => {
    ReadSms.stopReadSMS();
  };

  callDoctor() {
    this.getData().then((x) => {
      if (!x) this.toggleModal();
      else this.callPhone();
    });
  }

  sendSMS() {
    API.sendSMS(this.state.phone).then((res) => {
      this.componentWillMount();
    });
  }

  checkSMS() {
    let code = '';
    this.state.digits.forEach((el) => {
      code += el;
    });

    API.checkSMS(this.state.phone, code).then((res) => {
      if (res.data === 'ok') {
        this.setState({verified: true, isModalVisible: false});
        this.storeData(this.state.phone);
        this.callPhone();
      }
    });
  }

  setDigit(digit, index) {
    let digits = this.state.digits;
    digits[index] = digit;

    this.setState({
      digits: digits,
    });
  }

  callPhone() {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${0322241505}';
    } else {
      phoneNumber = 'telprompt:${0322241505}';
    }

    Linking.openURL(phoneNumber)
      .then((el) => {
        console.log(el);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  toggleModal = () => {
    if (this.state.verified) {
      this.callPhone();
    } else {
      this.setState({
        isModalVisible: !this.state.isModalVisible,
      });
    }
  };

  goHome() {
    this.navigation.navigate('Panel');
  }

  render() {
    return (
      <NavigationContainer>
        <Modal
          style={{margin: 0, marginTop: '10%'}}
          isVisible={this.state.isModalVisible}>
          <SafeAreaView style={styles.container}>
            <ScrollView style={styles.fill}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <View
                  style={[
                    {
                      width: 30,
                      position: 'absolute',
                      top: 5,
                      right: 15,
                      zIndex: 100,
                    },
                  ]}>
                  <Button
                    icon={
                      <Icon
                        name="times"
                        size={20}
                        type="font-awesome-5"
                        color="#187e92"
                      />
                    }
                    type="clear"
                    onPress={() => {
                      this.toggleModal();
                    }}
                  />
                </View>

                <View
                  style={{
                    marginTop: 50,
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                  }}>
                  <Image
                    style={{
                      width: 100,
                      height: 100,
                      marginRight: 10,
                    }}
                    source={require('./img/doc.png')}
                  />
                  <Text
                    style={[
                      styles.Mrgvlovani,
                      {
                        flex: 1,
                        marginTop: 20,
                        textAlign: 'center',
                        fontSize: 18,
                        color: '#00ACAE',
                      },
                    ]}>
                    გაააქტიურე ექიმთან კონსულტაციის სერვისი
                  </Text>
                </View>

                <Text
                  style={[
                    styles.Mrgvlovani,
                    {
                      marginLeft: 20,
                      height: 40,
                      marginTop: 40,
                      textAlign: 'left',
                      fontSize: 18,
                      color: '#555',
                    },
                  ]}>
                  შეიყვანე ტელეფონის ნომერი
                </Text>
                <View style={{}}>
                  <Input
                    placeholder="მაგ: 555123456"
                    inputStyle={{
                      fontSize: 14,
                      borderWidth: 0,
                      fontWeight: 'bold',
                    }}
                    inputContainerStyle={{borderBottomWidth: 0, marginTop: -1}}
                    leftIcon={{
                      color: '#37AAAE',
                      type: 'font-awesome-5',
                      size: 17,
                      name: 'phone',
                    }}
                    containerStyle={[
                      styles.input,
                      {
                        width: '90%',
                        borderColor: '#37AAAE',
                        borderWidth: 2,
                        borderRadius: 7,
                        height: 50,
                        margin: 10,
                      },
                    ]}
                    onChangeText={(phone) => {
                      this.setState({phone: phone});
                    }}
                  />
                </View>
                <View
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    buttonStyle={[
                      styles.button,
                      {width: 150, backgroundColor: '#00ACAE'},
                    ]}
                    title="გაგზავნა"
                    titleStyle={[styles.buttonText, {marginRight: 10}]}
                    onPress={() => {
                      this.sendSMS();
                    }}></Button>
                </View>

                <Text
                  style={[
                    styles.Mrgvlovani,
                    {
                      marginLeft: 20,
                      height: 40,
                      marginTop: 40,
                      textAlign: 'left',
                      fontSize: 18,
                      color: '#555',
                    },
                  ]}>
                  შეიყვანე კოდი
                </Text>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <TextInput
                    value={this.state.digits[0]}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      height: 40,
                      textAlign: 'center',
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                    onChangeText={(digit) => {
                      this.setDigit(digit, 0);
                      this.secondTextInput.focus();
                    }}
                  />
                  <TextInput
                    ref={(input) => {
                      this.secondTextInput = input;
                    }}
                    value={this.state.digits[1]}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      height: 40,
                      textAlign: 'center',
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                    onChangeText={(digit) => {
                      this.setDigit(digit, 1);
                      this.thirdTextInput.focus();
                    }}
                  />
                  <TextInput
                    ref={(input) => {
                      this.thirdTextInput = input;
                    }}
                    value={this.state.digits[2]}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      height: 40,
                      textAlign: 'center',
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                    onChangeText={(digit) => {
                      this.setDigit(digit, 2);
                      this.fourthTextInput.focus();
                    }}
                  />
                  <TextInput
                    ref={(input) => {
                      this.fourthTextInput = input;
                    }}
                    value={this.state.digits[3]}
                    style={{
                      marginRight: 10,
                      marginLeft: 10,
                      height: 40,
                      textAlign: 'center',
                      borderColor: 'gray',
                      borderWidth: 1,
                    }}
                    onChangeText={(digit) => this.setDigit(digit, 3)}
                  />
                </View>

                <View
                  style={{
                    marginTop: 10,
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Button
                    buttonStyle={[
                      styles.button,
                      {width: 150, backgroundColor: '#00ACAE'},
                    ]}
                    title="დადასტურება"
                    titleStyle={[styles.buttonText, {marginRight: 10}]}
                    onPress={() => {
                      this.checkSMS();
                    }}></Button>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>

        {this.state.showBottom && (
          <View>
            <View
              style={{
                position: 'absolute',
                height: 70,
                top: 0,
                left: 0,
                width: '120%',
                backgroundColor: '#37AAAE',
              }}></View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity onPress={() => this.goHome()}>
                <Image
                  style={{
                    width: 35,
                    height: 30,
                    marginTop: 0,
                    marginBottom: 5,
                    marginLeft: 5,
                  }}
                  source={require('./img/home.png')}
                />
              </TouchableOpacity>

              <Image
                style={{
                  width: 260,
                  height: 35,
                  marginTop: 5,
                  marginBottom: 5,
                }}
                source={require('./img/logo_long.png')}
              />

              <TouchableOpacity onPress={() => this.goArchive()}>
                <Image
                  style={{
                    marginTop: 5,
                    width: 30,
                    height: 30,
                    marginRight: 10,
                    marginBottom: 5,
                  }}
                  source={require('./img/chat-icon.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Stack.Navigator
          screenOptions={({navigation}) => {
            this.setNavigation(navigation);
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Panel"
            component={Panel}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Recipe"
            component={Recipe}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="newUser"
            component={newUser}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Compare"
            component={Compare}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Pharmacy"
            component={Pharmacy}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Archive"
            component={Archive}
            options={{headerShown: false}}
          />
        </Stack.Navigator>

        {this.state.showBottom && (
          <View
            style={{
              height: 45,
              left: 0,
              bottom: 0,
              width: '100%',
              backgroundColor: '#00ACAE',
            }}>
            <TouchableOpacity
              style={{
                isplay: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                paddingTop: 5,
              }}
              onPress={() => this.callDoctor()}>
              <Image
                style={{
                  width: 35,
                  height: 35,
                  marginRight: 10,
                  marginTop: -5,
                }}
                source={require('./img/phone.png')}
              />
              <Text
                style={[
                  styles.Mrgvlovani,
                  {textAlign: 'center', color: '#fff', fontSize: 17},
                ]}>
                ექიმის უფასო კონსულტაცია
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </NavigationContainer>
    );
  }

  setNavigation(navigation) {
    this.navigation = navigation;
  }

  goArchive() {
    this.getData().then((x) => {
      if (!x) this.toggleModal();
      else this.navigation.navigate('Archive');
    });
  }
}

export default App;
