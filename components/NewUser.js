import {Image, SafeAreaView, ScrollView, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import styles from '../styles/style';
import React from 'react';
import API from './API';
import {Input} from 'react-native-elements';

export default class newUser extends React.Component {
    constructor(props) {
        super(props);
    }

    createUser() {
        API.createUser(this.state).then((result) => {
            ToastAndroid.show(result.data,2000);
        })
    }

    state = {
        PN: '',
        pwd: '',
        pwdRepeat: '',
    };

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.fill}>
                    <View style={styles.container}>
                        <Image style={
                            {
                                width: 250,
                                height: 250,
                            }
                        }
                               source={require('../img/pharmacist.png')}
                        />
                        <View style={{
                            height: 20,
                        }}></View>
                        <View style={{paddingLeft: 20, paddingRight: 20, width: '100%'}}>
                            <Input
                                placeholder="პირადი ნომერი"
                                leftIcon={{type: 'font-awesome-5', size: 15, name: 'user'}}
                                style={[styles.input]}
                                onChangeText={pn => {
                                    this.setState({PN: pn});
                                }}
                            />
                        </View>
                        <View style={{paddingLeft: 20, paddingRight: 20, width: '100%'}}>
                            <Input
                                placeholder="პაროლი"
                                leftIcon={{type: 'font-awesome-5', size: 15, name: 'key'}}
                                style={[styles.input]}
                                onChangeText={pwd => {
                                    this.setState({pwd: pwd});
                                }}
                            />
                        </View>
                        <View style={{paddingLeft: 20, paddingRight: 20, width: '100%'}}>
                            <Input
                                placeholder="გაიმეორეთ პაროლი"
                                leftIcon={{type: 'font-awesome-5', size: 15, name: 'key'}}
                                style={[styles.input]}
                                onChangeText={pwd => {
                                    this.setState({pwdRepeat: pwd});
                                }}
                            />
                        </View>
                        <View style={{
                            height: 60,
                        }}></View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() =>
                                this.createUser('Login')
                            }
                        >
                            <Text style={{color: 'white'}}>რეგისტრაცია</Text>
                        </TouchableOpacity>
                        <View style={{height: 20}}></View>
                        <View>
                            <Text>ან</Text>
                        </View>
                        <View style={{height: 20}}></View>
                        <View>
                            <TouchableOpacity
                                onPress={() =>
                                    this.props.navigation.navigate('Login')
                                }
                            >
                                <Text style={{color: '#187e92'}}>ავტორიზაცია</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
};
