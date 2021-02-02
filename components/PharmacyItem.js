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
import {Button, Icon, Image} from 'react-native-elements';

export default class PharmacyItem extends React.Component {
  constructor(props) {
    super(props);
  }

  state = {};

  render() {
    return (
      <View
        style={[
          local_styles.container,
          {borderBottomWidth: 1, borderColor: '#bbb'},
        ]}>
        <Image
          style={{
            width: 50,
            height: 50,
            marginRight: 15,
            borderRadius: 10,
            marginTop: 10,
          }}
          source={require('../img/pharma.png')}
        />
        <View style={local_styles.vertical}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <Text style={[styles.textMedium, styles.bold, styles.Mtavruli]}>
              ფარმადეპო
            </Text>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={[
                  styles.textSmall,
                  styles.Mtavruli,
                  {textDecorationLine: 'underline'},
                ]}>
                {this.props.data['distance']} კმ
              </Text>
              <Image
                style={{
                  width: 15,
                  height: 15,
                  marginLeft: 10,
                }}
                source={require('../img/distance.png')}
              />
            </View>
          </View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}>
            <View style={{marginBottom: 10, flex: 1}}>
              <Text style={[styles.textSmall, styles.Mtavruli]}>
                {this.props.data['adress']}
              </Text>
            </View>
            <Button
              icon={
                <Icon
                  name="map-marker-alt"
                  size={15}
                  type="font-awesome-5"
                  color="#fff"
                />
              }
              iconRight={true}
              buttonStyle={[styles.buttonSmall, {height: 40}]}
              titleStyle={[styles.buttonText, {marginRight: 10}]}
              onPress={() => {
                this.props.callbackFn(
                  this.props.parent,
                  [this.props.data['latitude'], this.props.data['longitude']],
                  this.props.data,
                );
              }}></Button>
          </View>
          <View style={{marginBottom: 0}}>
            <View style={{display: 'flex', flexDirection: 'row'}}>
              <Text
                style={[
                  styles.textSmall,
                  styles.Dejavu,
                  {color: '#000', marginTop: 0, fontWeight: 'bold'},
                ]}>
                მოიძებნა
              </Text>
              <Text
                style={[
                  styles.Mrgvlovani,
                  {
                    color: '#37AAAE',
                    fontSize: 14,
                    marginLeft: 10,
                  },
                ]}>
                {this.props.data['sum']} დან {this.props.data['quant']}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.horizontal,
              {
                width: '100%',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              },
            ]}></View>
        </View>
      </View>
    );
  }
}

const local_styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  vertical: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
