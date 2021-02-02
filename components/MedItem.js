import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import API from './API';
import {Row, Rows, Table} from 'react-native-table-component';
import React from 'react';
import styles from '../styles/style';
import {Button, Icon, Image, Input} from 'react-native-elements';
import getQ from './Helpers';

export default class MedItem extends React.Component {
  quan = '0';

  state = {
    quantity: 0,
    numInput: 0,
  };

  constructor(props) {
    super(props);
    let quan = this.props.data['quantity'];
    if (!isNaN(quan) && quan > 0) {
      this.state.quantity = quan + '';
      this.state.numInput = this.state.quantity;
    } else {
      this.state.quantity = getQ(this.props.data['name']);
      this.state.numInput = this.state.quantity;
    }
  }

  add(n) {
    if (!isNaN(this.state.numInput)) {
      let newNum = parseFloat(this.state.numInput) + parseFloat(n);
      if (newNum < 1) {
        newNum = 1;
      }
      this.setState({
        quantity: newNum + '',
        numInput: newNum,
      });
      this.detectChange(newNum);
    } else {
    }
  }

  detectChange(quantity) {
    if (this.props.callBackQ)
      this.props.callBackQ(this.props.parent, quantity, this.props.data);
  }

  render() {
    let spl = this.props.data['name'].split('#');
    if (!spl[1]) spl[1] = 1;
    let priceRoot = (
      parseFloat(this.props.data['price']) / parseFloat(spl[1])
    ).toFixed(2);
    let priceAll = (
      (parseFloat(this.props.data['price']) / parseFloat(spl[1])) *
      this.state.numInput
    ).toFixed(2);

    let found = this.props.myProducts.find(
      (el) => el['id'] === this.props.data['id'],
    );
    let addBtn = '<Text></Text>';
    if (this.props.compare === 0) {
      addBtn = !found ? (
        <TouchableOpacity
          style={styles.buttonSmall}
          onPress={() => {
            this.props.callBackFn(this.props.data);
          }}>
          <Text style={[styles.buttonText, styles.textSmall]}>დამატება</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.buttonSmall, styles.buttonWhite]}
          onPress={() => {
            this.props.callBackFn(this.props.data);
          }}>
          <Text
            style={[styles.buttonText, styles.textSmall, {color: '#187e92'}]}>
            წაშლა
          </Text>
        </TouchableOpacity>
      );
    } else if (this.props.compare === 1) {
      addBtn = (
        <Button
          icon={
            <Icon
              name="exchange-alt"
              size={15}
              type="font-awesome-5"
              color="#fff"
            />
          }
          iconRight={true}
          buttonStyle={[styles.buttonSmall]}
          title="შეცვლა"
          titleStyle={[styles.buttonText, {marginRight: 10}]}
          onPress={() => {
            this.props.callBackFn(this.props.parent, this.props.data);
          }}></Button>
      );
    } else if (this.props.compare === 2) {
      addBtn = (
        <Button
          icon={
            <Icon
              name="exchange-alt"
              size={15}
              type="font-awesome-5"
              color="#fff"
            />
          }
          iconRight={true}
          buttonStyle={[styles.buttonSmall]}
          title="ჩანაცვლება"
          titleStyle={[styles.buttonText, {marginRight: 10}]}
          onPress={() => {
            this.props.callBackFn(this.props.parent, this.props.data);
          }}></Button>
      );
    }

    let img =
      this.props.data['image_link'] === '' ? (
        <Image
          style={{
            width: 70,
            height: 70,
            marginRight: 10,
          }}
          source={require('../img/not-found.png')}
        />
      ) : (
        <Image
          style={{
            width: 70,
            height: 70,
            marginRight: 10,
          }}
          source={{uri: this.props.data['image_link']}}
        />
      );

    return (
      <View
        style={{
          padding: 16,
          paddingTop: 30,
          borderBottomColor: '#bbb',
          borderBottomWidth: 1,
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View style={local_styles.container}>
          {img}
          <View style={local_styles.vertical}>
            <View style={{marginBottom: 10}}>
              <Text style={[styles.textMedium, styles.bold, styles.Mtavruli]}>
                {this.props.data['name'] + ' - ' + this.props.data['price']} ₾
              </Text>
            </View>
            <View
              style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
              {this.props.data['EU'] === 'True' && (
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    marginRight: 10,
                    marginTop: 5,
                  }}
                  source={require('../img/EU.png')}
                />
              )}

              <Text
                style={[
                  styles.textSmall,
                  styles.Mrgvlovani,
                  {
                    color: '#aaa',
                    borderLeftColor: '#bbb',
                    borderLeftWidth: 1,
                    paddingLeft: 10,
                    lineHeight: 18,
                  },
                ]}>
                {this.props.data['country']}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.horizontal,
            {
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          <View style={{display: 'flex', flexDirection: 'column'}}>
            <Text
              style={{
                color: '#bbb',
              }}>
              ერთეულის ფასი
              <Text style={{color: '#000', marginLeft: 10}}>
                {' '}
                {priceRoot} ₾
              </Text>
            </Text>
            {this.props.quantity && (
              <Text
                style={{
                  color: '#bbb',
                }}>
                ჯამური ფასი
                <Text style={{color: '#000', marginLeft: 10}}>
                  {' '}
                  {priceAll} ₾
                </Text>
              </Text>
            )}
          </View>

          {addBtn}
        </View>
        {this.props.quantity && (
          <View
            style={[
              styles.horizontal,
              {
                width: 'auto',
                alignItems: 'center',
                flexDirection: 'row',
                marginTop: 10,
                justifyContent: 'flex-start',
              },
            ]}>
            <Text
              style={{
                color: '#111',
              }}>
              რაოდენობა:
            </Text>

            <Button
              icon={
                <Icon
                  name="minus"
                  size={12}
                  type="font-awesome-5"
                  color="#fff"
                />
              }
              iconRight={true}
              buttonStyle={[
                styles.button,
                {
                  width: 40,
                  height: 30,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                },
              ]}
              onPress={() => {
                this.add(-1);
              }}
            />

            <Input
              value={this.state.quantity}
              inputStyle={{fontSize: 14, borderWidth: 0, fontWeight: 'bold'}}
              inputContainerStyle={{borderBottomWidth: 0, marginTop: -6}}
              containerStyle={[
                styles.input,
                {
                  width: 60,
                  borderRadius: 5,
                  borderColor: '#555',
                  borderWidth: 1,
                  height: 30,
                },
              ]}
              onChangeText={(numInput) => {
                if (isNaN(numInput)) {
                  this.detectChange(spl[1]);
                  this.setState({numInput: spl[1], quantity: spl[1]});
                } else {
                  this.detectChange(numInput);
                  this.setState({numInput: numInput, quantity: numInput});
                }
              }}
            />

            <Button
              icon={
                <Icon
                  name="plus"
                  size={12}
                  type="font-awesome-5"
                  color="#fff"
                />
              }
              iconRight={true}
              buttonStyle={[
                styles.button,
                {
                  width: 40,
                  height: 30,
                  marginTop: 10,
                  marginLeft: 10,
                  marginRight: 10,
                },
              ]}
              onPress={() => {
                this.add(1);
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const local_styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  vertical: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
