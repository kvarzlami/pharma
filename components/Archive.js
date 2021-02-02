import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import API from './API';
import React from 'react';
import styles from '../styles/style';

import {Badge, Button, Icon, Input, Text} from 'react-native-elements';
import Loader from './Loader';
import PharmacyItem from './PharmacyItem';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeItem from './RecipeItem';
import Modal from 'react-native-modal';

export default class Archive extends React.Component {
  constructor() {
    super();
    setTimeout(() => {
      this.getData().then((phone) => {
        API.getRecipes(phone).then((res) => {
          this.setState({phone: phone, recipes: res.data, loading: false});
        });
      });
    }, 1000);
  }

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

  state = {
    phone: '',
    recipes: [],
    loading: true,
    youSure: false,
    deleteID: '',
  };

  toggleModal = (parent, id) => {
    parent.setState({
      youSure: !this.state.youSure,
      deleteID: id,
    });
  };

  render() {
    // if (this.state.firstLoad) {
    //     this.getPharmacies(this.props.route.params.meds);
    //     this.state.firstLoad = false;
    // }

    return (
      <View style={[local_styles.container1, {padding: 0, margin: 0}]}>
        <Modal isVisible={this.state.youSure}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRadius: 5,
            }}>
            <Text style={{textAlign: 'center', margin: 10}}>
              დარწმუნებული ხარ?
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'space-around',
              }}>
              <Button
                buttonStyle={{backgroundColor: '#37AAAE', width: 100}}
                title="კი"
                onPress={() => {
                  this.setState({youSure: false});
                  API.deleteRecipe(this.state.phone, this.state.deleteID).then(
                    (x) => {
                      this.setState({
                        loading: true,
                      });
                      API.getRecipes(this.state.phone).then((res) => {
                        this.setState({
                          recipes: res.data,
                          loading: false,
                        });
                      });
                    },
                  );
                }}
              />
              <Button
                buttonStyle={{backgroundColor: '#37AAAE', width: 100}}
                title="არა"
                onPress={() => this.setState({youSure: false})}
              />
            </View>
          </View>
        </Modal>

        <Text
          style={{
            backgroundColor: '#fff',
            height: 40,
            width: '100%',
            textAlign: 'center',
            color: '#37AAAE',
            marginTop: -10,
            paddingTop: 10,
            borderBottomColor: '#eee',
            borderBottomWidth: 1,
          }}>
          არქივი
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 5,
            top: 10,
          }}
          onPress={() => {
            this.props.navigation.goBack();
          }}>
          <Image
            style={{width: 60, height: 20}}
            source={require('../img/arrow_back.png')}
          />
        </TouchableOpacity>
        {this.state.loading ? (
          <View style={{height: '100%', width: '100%'}}>
            <Loader></Loader>
          </View>
        ) : (
          <View></View>
        )}

        <View style={[styles.container]}>
          <SafeAreaView
            style={[
              styles.container,
              {backgroundColor: '#eee', width: '100%'},
            ]}>
            <ScrollView style={styles.fill}>
              {this.state.recipes.map((el, index) => (
                <RecipeItem
                  callbackFn={this.toggleModal}
                  parent={this}
                  key={index}
                  data={el}
                  navigation={this.props.navigation}
                />
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    );
  }
}

const local_styles = StyleSheet.create({
  container1: {
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
});
