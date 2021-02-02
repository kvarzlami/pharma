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
          {
            margin: 10,
            flexDirection: 'column',
          },
        ]}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
          }}>
          <Image
            style={{
              width: 50,
              height: 50,
              marginRight: 15,
              borderRadius: 10,
              marginTop: 10,
            }}
            source={require('../img/person1.png')}
          />
          <View style={[local_styles.vertical]}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={[styles.textMedium, styles.bold, styles.Mtavruli]}>
                ჩემი რეცეპტი
              </Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <View
                style={{
                  marginBottom: 10,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'row',
                }}>
                <Image
                  style={{
                    width: 15,
                    height: 15,
                    marginRight: 5,
                  }}
                  source={require('../img/calendar.png')}
                />
                <Text style={[styles.textSmall, styles.Mtavruli]}>
                  {this.props.data['CreateDate']}
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
                  borderTopWidth: 1,
                  borderColor: '#eee',
                },
              ]}>
              <Text
                style={[
                  styles.textMedium,
                  styles.Mrgvlovani,
                  {
                    color: '#37AAAE',
                    marginBottom: 20,
                    marginTop: 10,
                  },
                ]}>
                {this.props.data['Name']}
              </Text>
            </View>
          </View>
        </View>
        <View style={{display: 'flex', flexDirection: 'row', paddingTop: 10}}>
          <TouchableOpacity
            style={[
              local_styles.contextMenu,
              {borderRightWidth: 1, borderColor: '#eee'},
            ]}
            onPress={() => this.detailed()}>
            <Image
              style={{
                width: 17,
                height: 15,
                marginRight: 7,
                marginTop: 2,
              }}
              source={require('../img/recepti.png')}
            />
            <Text style={styles.textSmall}>რეცეპტი</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={local_styles.contextMenu}
            onPress={() => this.removeRecipe()}>
            <Image
              style={{
                width: 15,
                height: 18,
                marginRight: 5,
              }}
              source={require('../img/bin.png')}
            />
            <Text style={styles.textSmall}>წაშლა</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  removeRecipe() {
    this.props.callbackFn(this.props.parent, this.props.data['ID']);
  }
  detailed() {
    this.props.navigation.navigate('Recipe', {recipe: this.props.data['Meds']});
  }
}

const local_styles = StyleSheet.create({
  contextMenu: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    padding: 10,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  vertical: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});
