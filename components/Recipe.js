import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import API from './API';
import React from 'react';
import styles from '../styles/style';
import MedItem from './MedItem';
import Modal from 'react-native-modal';

import {Badge, Button, Icon, Input} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getQ from './Helpers';

export default class Recipe extends React.Component {
  constructor() {
    super();
    setTimeout(() => {
      this.getData().then((phone) => {
        if (phone) this.setState({phone: phone});
      });
    }, 100);
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
    initial: true,
    keyword: '',
    pages: 0,
    products: [],
    myProducts: [],
    loader: false,
    curPage: 0,
    totalProducts: 0,
    isModalVisible: false,
    searchTimer: null,
    sumPrice: 0,
    saveVisible: false,
    recipeName: '',
    phone: '',
  };

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };

  toggleSaveModal() {
    this.setState({
      saveVisible: !this.state.saveVisible,
    });

    if (this.state.saveVisible)
      setTimeout(() => {
        this.nameInput.focus();
      }, 3000);
  }

  addProduct = (data) => {
    let myProducts = this.state.myProducts;
    let foundIndex = myProducts.findIndex((el) => el['id'] === data['id']);

    if (foundIndex >= 0) {
      myProducts.splice(foundIndex, 1);
    } else {
      data['quantity'] = getQ(data['name']);
      myProducts.push(data);
    }

    this.setState({
      myProducts: myProducts,
    });
  };

  changeQuantity(parent, quantity, data) {
    let foundIndex = parent.state.myProducts.findIndex(
      (el) => el['id'] === data['id'],
    );

    if (foundIndex > -1)
      parent.state.myProducts[foundIndex]['quantity'] = quantity;

    parent.state.sumPrice = 0;
    parent.state.myProducts.forEach((el) => {
      parent.state.sumPrice += (el.price * el.quantity) / getQ(el['name']);
    });
    parent.setState({sumPrice: parent.state.sumPrice.toFixed(2)});
  }

  render() {
    if (this.props.route.params) {
      let products = [];

      if (this.props.route.params.recipe) {
        API.getMedsByIDs(this.props.route.params.recipe).then((res) => {
          this.props.route.params = null;

          res.data.forEach((el) => {
            products.push({
              id: el['id'],
              name: el['name'],
              country: el['manufacturer'],
              price: el['price'],
              image_link: el['image_link'],
              EU: el['EU'],
              quantity: el['quantity'],
            });
          });
          this.setState({
            myProducts: products,
            initial: false,
          });
          this.toggleModal();
        });
      } else {
        this.state.myProducts = this.props.route.params.myProducts;
      }
    }

    this.state.sumPrice = 0;
    this.state.myProducts.forEach((el) => {
      this.state.sumPrice += (el.price * el.quantity) / getQ(el['name']);
    });
    this.state.sumPrice = this.state.sumPrice.toFixed(2);

    // let pages = this.state.pages;
    //
    // let pagesView = [];
    // for (let i = 0; i < pages; i++) {
    //   pagesView.push(
    //     <TouchableOpacity
    //       key={i}
    //       style={styles.button}
    //       onPress={() => {
    //         this.searchProduct(i);
    //       }}>
    //       <Text style={styles.buttonText}>{i}</Text>
    //     </TouchableOpacity>,
    //   );
    // }

    return (
      <View style={local_styles.container1}>
        <Modal isVisible={this.state.saveVisible}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              borderRadius: 5,
            }}>
            <Text style={{textAlign: 'center', margin: 10}}>
              შეიყვანე რეცეპტის დასახელება
            </Text>
            <Input
              ref={(input) => {
                this.nameInput = input;
              }}
              placeholder=""
              style={[styles.input]}
              onChangeText={(recipeName) => {
                this.setState({recipeName: recipeName});
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                padding: 10,
                justifyContent: 'space-around',
              }}>
              <Button
                buttonStyle={{backgroundColor: '#37AAAE', width: 150}}
                title="შენახვა"
                onPress={() => {
                  this.setState({saveVisible: false});
                  this.saveRecipe();
                }}
              />
            </View>
          </View>
        </Modal>
        <View
          style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
          <Text
            style={[
              styles.Mrgvlovani,
              {
                fontSize: 15,
                color: '#37AAAE',
                width: '100%',
                textAlign: 'center',
              },
            ]}>
            ჩემი რეცეპტი
          </Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              left: 1,
            }}
            onPress={() => {
              this.props.navigation.goBack();
            }}>
            <Image
              style={{width: 60, height: 20}}
              source={require('../img/arrow_back.png')}
            />
          </TouchableOpacity>

          <View style={[local_styles.container1]}>
            <SafeAreaView style={styles.container}>
              <ScrollView style={styles.fill}>
                {this.state.myProducts.map((el, index) => (
                  <MedItem
                    myProducts={this.state.myProducts}
                    callBackFn={this.addProduct}
                    callBackQ={this.changeQuantity}
                    parent={this}
                    key={index}
                    compare={0}
                    quantity={true}
                    data={el}></MedItem>
                ))}
              </ScrollView>
            </SafeAreaView>
            <View>
              <View
                style={{
                  marginBottom: 20,
                  paddingTop: 10,
                  marginTop: 5,
                  borderTopWidth: 2,
                  borderTopColor: '#37AAAE',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: '#37AAAE'}}>სულ ჯამი:</Text>
                <Text style={{color: '#37AAAE'}}>
                  {this.state.sumPrice} ლარი
                </Text>
              </View>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  width: '100%',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleSaveModal();
                  }}
                  style={[styles.button, {display: 'flex', width: '24%'}]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {textAlign: 'center', fontSize: 10},
                    ]}>
                    შეინახე რეცეპტი
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Compare', {
                      myProducts: this.state.myProducts,
                    });
                  }}
                  style={[styles.button, {width: '50%'}]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {textAlign: 'center', fontSize: 10},
                    ]}>
                    სხვა წამლები იგივე შემადგენლობით
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.toggleModal();
                    this.props.navigation.navigate('Pharmacy', {
                      meds: this.state.myProducts,
                    });
                  }}
                  style={[styles.button, {width: '24%'}]}>
                  <Text
                    style={[
                      styles.buttonText,
                      {textAlign: 'center', fontSize: 10},
                    ]}>
                    მაჩვენე აფთიაქში
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  saveRecipe() {
    let meds = [];
    this.state.myProducts.forEach((el) => {
      meds.push([el.id, el.quantity]);
    });

    API.addRecipe(
      this.state.phone,
      this.state.recipeName,
      meds,
    ).then((response) => {});
  }
}

const local_styles = StyleSheet.create({
  container1: {
    display: 'flex',
    flex: 1,
    padding: 10,
    paddingTop: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    height: '100%',
  },
});
