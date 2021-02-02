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

export default class Panel extends React.Component {
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

  searchProduct = (page) => {
    if (this.state.keyword.length > 2) {
      this.setState({initial: false});
      this.setState({loader: true});
      this.setState({curPage: page});
      API.search(this.state.keyword, page).then((res) => {
        let data = res.data['products'];
        this.setState({totalProducts: res.data['totalProducts']});
        this.setState({pages: res.data['pages']});
        let products = this.state.products;
        data.forEach((el) => {
          products.push({
            id: el['id'],
            name: el['name'] + ' // ' + el['generic'],
            country: el['manufacturer'] + '\n' + el['country'],
            price: el['price'],
            image_link: el['image_link'],
            EU: el['EU'],
          });
        });
        this.setState({loader: false});
        this.setState({products: products});
      });
    }
  };

  pagerCallBack = (pagerResut) => {
    this.searchProduct(this.state.curPage + pagerResut);
  };

  isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 200;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  loadMore = () => {
    if (this.state.curPage < this.state.pages - 1 && !this.state.loader) {
      this.searchProduct(this.state.curPage + 1);
    }
  };

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

  searchTimer = () => {
    clearTimeout(this.state.searchTimer);
    if (this.state.keyword.length > 1) {
      this.setState({
        searchTimer: setTimeout(() => {
          this.setState({products: []});
          this.searchProduct(0);
        }, 500),
      });
    }
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
    this.state.sumPrice = 0;
    this.state.myProducts.forEach((el) => {
      this.state.sumPrice += (el.price * el.quantity) / getQ(el['name']);
    });
    this.state.sumPrice = this.state.sumPrice.toFixed(2);

    let pages = this.state.pages;

    let pagesView = [];
    for (let i = 0; i < pages; i++) {
      pagesView.push(
        <TouchableOpacity
          key={i}
          style={styles.button}
          onPress={() => {
            this.searchProduct(i);
          }}>
          <Text style={styles.buttonText}>{i}</Text>
        </TouchableOpacity>,
      );
    }

    return (
      <View style={local_styles.container1}>
        <View style={[styles.horizontal, {height: 60, marginTop: 5}]}>
          <Input
            placeholder="შეიყვანე წამლის დასახელება"
            inputStyle={[
              styles.Mrgvlovani,
              {fontSize: 14, borderWidth: 0, fontWeight: 'bold'},
            ]}
            inputContainerStyle={{borderBottomWidth: 0, marginTop: -1}}
            leftIcon={{
              color: '#37AAAE',
              type: 'font-awesome-5',
              size: 17,
              name: 'search',
            }}
            containerStyle={[
              styles.input,
              {
                width: '100%',
                borderColor: '#37AAAE',
                borderWidth: 2,
                borderRadius: 3,
                height: 50,
              },
            ]}
            onChangeText={(keyword) => {
              this.setState({keyword: keyword});
              this.searchTimer();
            }}
          />
        </View>

        <View
          style={{
            height: 30,
            flex: 0,
            marginBottom: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: '#076475'}}>
            {this.state.totalProducts > 0
              ? 'ნაპოვნია ' + this.state.totalProducts + ' პროდუქტი'
              : ''}
          </Text>
          {this.state.loader && (
            <Image
              source={require('../img/loader1.gif')}
              style={{width: 30, height: 20}}
            />
          )}
        </View>

        {!this.state.initial && (
          <View style={[styles.container, {width: '100%'}]}>
            <SafeAreaView style={[styles.container, {width: '100%'}]}>
              <ScrollView
                style={styles.fill}
                onScroll={({nativeEvent}) => {
                  if (this.isCloseToBottom(nativeEvent)) {
                    this.loadMore();
                  }
                }}
                scrollEventThrottle={400}>
                {this.state.products.map((el, index) => (
                  <MedItem
                    myProducts={this.state.myProducts}
                    callBackQ={this.changeQuantity}
                    parent={this}
                    callBackFn={this.addProduct}
                    key={index}
                    compare={0}
                    quantity={false}
                    data={el}></MedItem>
                ))}
              </ScrollView>
            </SafeAreaView>
            <View style={{height: 10}}></View>
            <View
              style={[
                {
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                styles.horizontal,
              ]}>
              <Image
                style={{
                  width: 330,
                  height: 50,
                  borderRadius: 10,
                  marginTop: 10,
                }}
                source={require('../img/recipe.png')}
              />
              <TouchableOpacity
                style={{position: 'absolute', margin: 'auto'}}
                onPress={() => {
                  this.goToRecipe();
                }}>
                <Text
                  style={[
                    styles.Mrgvlovani,
                    {color: '#37AAAE', fontSize: 15, marginTop: 12},
                  ]}>
                  ჩემი რეცეპტი
                </Text>
              </TouchableOpacity>
              {/*{this.state.myProducts.length > 0 && (*/}
              {/*  <Badge*/}
              {/*    status="error"*/}
              {/*    containerStyle={{*/}
              {/*      position: 'absolute',*/}
              {/*      margin: 'auto',*/}
              {/*      left: 20,*/}
              {/*    }}*/}
              {/*    value={this.state.myProducts.length}*/}
              {/*  />*/}
              {/*)}*/}
            </View>
          </View>
        )}
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

  goToRecipe() {
    this.props.navigation.navigate('Recipe', {
      myProducts: this.state.myProducts,
    });
  }
}

const local_styles = StyleSheet.create({
  container1: {
    display: 'flex',
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'column',
    height: '100%',
  },
});
