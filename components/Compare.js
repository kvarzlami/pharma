import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/style';
import React from 'react';
import {Button, Card, Icon, Input, Text} from 'react-native-elements';
import Loader from './Loader';
import API from './API';
import MedItem from './MedItem';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getQ from './Helpers';

export default class Compare extends React.Component {
  myProducts = [];

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

  toggleModal = (index) => {
    let modals = this.state.Modals;
    modals[index] = !modals[index];

    this.setState({
      Modals: modals,
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

  showProducts(which, header) {
    let modalHeaders = this.state.ModalHeaders;
    modalHeaders[0] = header;
    which = JSON.parse(JSON.stringify(which));

    this.setState({
      detailed: which,
      ModalHeaders: modalHeaders,
    });

    this.toggleModal(0);
  }

  changeProduct(parent, data) {
    let index = parent.state.detailed.findIndex(
      (el) => el['id'] === data['id'],
    );
    let modalElements = [
      parent.state.myProducts[index],
      parent.state.cheap[index],
      parent.state.expensive[index],
    ];

    modalElements.splice(
      modalElements.findIndex((el) => el.id === data.id),
      1,
    );

    this.parent.setState({
      modalElements: modalElements,
      elToChange: data,
    });

    parent.toggleModal(1);
  }

  saveRecipe() {
    let meds = [];
    this.state.detailed.forEach((el) => {
      meds.push([el.id, el.quantity]);
    });

    API.addRecipe(
      this.state.phone,
      this.state.recipeName,
      meds,
    ).then((response) => {});
  }

  replaceProduct(parent, data) {
    let index = parent.state.detailed.findIndex(
      (el) => el['id'] === parent.state.elToChange['id'],
    );

    let detailed = parent.state.detailed;
    detailed[index] = data;

    parent.setState({
      detailed: detailed,
    });

    parent.toggleModal(1);
  }

  calculatePrice() {
    let cheapPrice = 0;
    let expensivePrice = 0;
    let myPrice = 0;

    this.state.cheap.forEach((el, i) => {
      let rootQuantity = getQ(el['name']);
      el['quantity'] = this.myProducts[i]['quantity'];
      cheapPrice += parseFloat((el['quantity'] * el['price']) / rootQuantity);
    });
    this.state.expensive.forEach((el, i) => {
      let rootQuantity = getQ(el['name']);
      el['quantity'] = this.myProducts[i]['quantity'];
      expensivePrice += parseFloat(
        (el['quantity'] * el['price']) / rootQuantity,
      );
    });

    this.myProducts.forEach((el, i) => {
      let rootQuantity = getQ(el['name']);
      myPrice += parseFloat((el['quantity'] * el['price']) / rootQuantity);
    });

    cheapPrice = cheapPrice.toFixed(2);
    expensivePrice = expensivePrice.toFixed(2);
    myPrice = myPrice.toFixed(2);

    this.setState({
      cheapPrice: cheapPrice,
      expensivePrice: expensivePrice,
      myPrice: myPrice,
    });
  }

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

    parent.calculatePrice();
  }

  constructor(props) {
    super(props);

    setTimeout(() => {
      this.getData().then((phone) => {
        if (phone) this.setState({phone: phone});
      });
    }, 100);

    this.myProducts = this.props.route.params.myProducts;

    API.getAlternatives(this.myProducts)
      .then((result) => {
        result.data['cheap'].forEach((el, i) => {
          let rootQuantity = getQ(el['name']);
          el['quantity'] = this.myProducts[i]['quantity'];
        });
        result.data['medium'].forEach((el, i) => {
          let rootQuantity = getQ(el['name']);
          el['quantity'] = this.myProducts[i]['quantity'];
        });
        result.data['expensive'].forEach((el, i) => {
          let rootQuantity = getQ(el['name']);
          el['quantity'] = this.myProducts[i]['quantity'];
        });
        this.myProducts.forEach((el, i) => {
          let rootQuantity = getQ(el['name']);
        });

        this.setState({
          cheap: result.data['cheap'],
          medium: result.data['medium'],
          expensive: result.data['expensive'],
          myProducts: this.myProducts,
          loading: false,
        });

        this.calculatePrice();
      })
      .catch((err) => console.log(err));
  }

  state = {
    Modals: [false, false],
    loading: true,
    cheap: [],
    cheapPrice: 0,
    medium: [],
    mediumPrice: 0,
    expensive: [],
    expensivePrice: 0,
    myProducts: [],
    myPrice: 0,
    detailed: [],
    modalElements: [],
    ModalHeaders: [],
    elToChange: null,
    nameInput: '',
    phone: '',
    saveVisible: false,
  };

  render() {
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

        <Modal
          style={{margin: 0, marginTop: '10%'}}
          isVisible={this.state.Modals[0]}>
          <View style={[local_styles.container1, {paddingTop: 50}]}>
            <View
              style={{
                flex: 0,
                position: 'absolute',
                top: 20,
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text
                style={{
                  fontWeight: '900',
                  fontFamily: 'BPGMrgvlovani',
                  fontSize: 18,
                }}>
                {this.state.ModalHeaders[0]}
              </Text>
            </View>
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
                  this.toggleModal(0);
                }}
              />
            </View>

            <SafeAreaView style={styles.container}>
              <ScrollView style={styles.fill}>
                {this.state.detailed.map((el, index) => (
                  <MedItem
                    myProducts={this.state.detailed}
                    callBackFn={this.changeProduct}
                    callBackQ={this.changeQuantity}
                    parent={this}
                    key={index}
                    compare={1}
                    quantity={true}
                    quan={el.quantity}
                    data={el}></MedItem>
                ))}
              </ScrollView>
            </SafeAreaView>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Button
                iconRight={true}
                buttonStyle={[styles.button, {width: 200}]}
                title="მოძებნე აფთიაქში"
                titleStyle={[styles.buttonText, {marginRight: 10}]}
                onPress={() => {
                  this.toggleModal(0);
                  this.props.navigation.navigate('Pharmacy', {
                    meds: this.state.detailed,
                  });
                }}
              />
              <Button
                buttonStyle={[styles.button, {width: '50%', minWidth: 150}]}
                title="შენახვა"
                titleStyle={[styles.buttonText, {marginRight: 10}]}
                onPress={() => {
                  this.toggleSaveModal();
                }}
              />
            </View>
          </View>
        </Modal>

        <Modal
          style={{margin: 0, marginTop: '10%'}}
          isVisible={this.state.Modals[1]}>
          <View style={[local_styles.container1, {paddingTop: 50}]}>
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
                  this.toggleModal(1);
                }}
              />
            </View>

            <SafeAreaView style={styles.container}>
              <ScrollView style={styles.fill}>
                {this.state.modalElements.map((el, index) => (
                  <MedItem
                    myProducts={this.state.detailed}
                    callBackFn={this.replaceProduct}
                    callBackQ={this.changeQuantity}
                    parent={this}
                    key={index}
                    quantity={false}
                    compare={2}
                    data={el}></MedItem>
                ))}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>

        <SafeAreaView style={[styles.container, {height: '100%'}]}>
          <ScrollView style={styles.fill}>
            {this.state.loading ? (
              <View>
                <Loader></Loader>
              </View>
            ) : (
              <View>
                <View style={local_styles.cards_container}>
                  <TouchableOpacity
                    style={{
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
                  <Card containerStyle={local_styles.cards}>
                    <Card.Title>
                      <Text
                        style={[
                          styles.Mrgvlovani,
                          {color: '#00ACAE', fontSize: 15},
                        ]}>
                        ჩემი რეცეპტი
                      </Text>
                    </Card.Title>
                    <Card.Divider />
                    {/*<Card.Image source={require('../img/drug.jpg')} />*/}
                    <Text
                      style={{
                        marginTop: 20,
                        marginBottom: 40,
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#00ACAE',
                      }}>
                      {this.state.myPrice} ₾
                    </Text>
                    <Button
                      buttonStyle={[
                        styles.button,
                        {height: 30, backgroundColor: '#00ACAE'},
                      ]}
                      titleStyle={[styles.buttonText, {fontSize: 9}]}
                      onPress={() =>
                        this.showProducts(this.state.myProducts, 'ორიგინალი')
                      }
                      title="დეტალურად"
                    />
                  </Card>
                </View>
                <View style={{width: '100%', marginTop: 15}}>
                  <Text
                    style={[
                      styles.Mrgvlovani,
                      {textAlign: 'center', color: '#00ACAE', fontSize: 15},
                    ]}>
                    ჩემი რეცეპტი სხვა მწარმოებლისგან (წამლების შემადგენლობა
                    იგივეა)
                  </Text>
                </View>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    paddingBottom: 20,
                  }}>
                  <View style={[local_styles.cards_container, {width: '50%'}]}>
                    <Card containerStyle={[local_styles.smallCards]}>
                      <Card.Title style={styles.Mrgvlovani}>
                        <Text
                          style={[
                            styles.Mrgvlovani,
                            {color: '#fff', fontSize: 15},
                          ]}>
                          ვარიანტი I
                        </Text>
                      </Card.Title>
                      <Card.Divider />
                      {/*<Card.Image source={require('../img/drug.jpg')} />*/}
                      <Text
                        style={{
                          marginTop: 20,
                          marginBottom: 40,
                          textAlign: 'center',
                          fontSize: 16,
                          color: '#fff',
                        }}>
                        {this.state.cheapPrice} ₾
                      </Text>
                      <Button
                        buttonStyle={[
                          styles.button,
                          {height: 30, backgroundColor: '#fff'},
                        ]}
                        titleStyle={[
                          styles.buttonText,
                          {fontSize: 9, color: '#00ACAE'},
                        ]}
                        onPress={() =>
                          this.showProducts(this.state.cheap, 'ვარიანტი I')
                        }
                        title="დეტალურად"
                      />
                    </Card>
                  </View>
                  {/*<View style={local_styles.cards_container}>*/}
                  {/*    <Card containerStyle={local_styles.cards}>*/}
                  {/*        <Card.Title style={styles.Mrgvlovani}>საშუალო ფასი</Card.Title>*/}
                  {/*        <Card.Divider/>*/}
                  {/*        /!*<Card.Image source={require('../img/drug.jpg')} />*!/*/}
                  {/*        <Text style={{marginBottom: 20, textAlign: 'center'}}>*/}
                  {/*            {this.state.mediumPrice} ₾*/}
                  {/*        </Text>*/}
                  {/*        <Button*/}
                  {/*            buttonStyle={[styles.button, {height: 30}]}*/}
                  {/*            titleStyle={[styles.buttonText, {fontSize: 9}]}*/}
                  {/*            onPress={() => this.showProducts(this.state.medium, 'საშუალო')}*/}
                  {/*            title='დეტალურად'/>*/}
                  {/*    </Card>*/}
                  {/*</View>*/}

                  <View style={[local_styles.cards_container, {width: '50%'}]}>
                    <Card containerStyle={local_styles.smallCards}>
                      <Card.Title style={styles.Mrgvlovani}>
                        <Text
                          style={[
                            styles.Mrgvlovani,
                            {color: '#fff', fontSize: 15},
                          ]}>
                          ვარიანტი II
                        </Text>
                      </Card.Title>
                      <Card.Divider />
                      {/*<Card.Image source={require('../img/drug.jpg')} />*/}
                      <Text
                        style={{
                          marginTop: 20,
                          marginBottom: 40,
                          textAlign: 'center',
                          fontSize: 16,
                          color: '#fff',
                        }}>
                        {this.state.expensivePrice} ₾
                      </Text>
                      <Button
                        buttonStyle={[
                          styles.button,
                          {height: 30, backgroundColor: '#fff'},
                        ]}
                        titleStyle={[
                          styles.buttonText,
                          {fontSize: 9, color: '#00ACAE'},
                        ]}
                        onPress={() =>
                          this.showProducts(this.state.expensive, 'ვარიანტი II')
                        }
                        title="დეტალურად"
                      />
                    </Card>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
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
    height: '100%',
  },
  cards_container: {
    width: '100%',
  },
  cards: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
    flex: 0,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCF4F4',
  },

  smallCards: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    borderRadius: 10,
    flex: 0,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00ACAE',
  },
});
