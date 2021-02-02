import {
  CheckBox,
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
import Loader from './Loader';
import PharmacyItem from './PharmacyItem';
import MapView, {Marker} from 'react-native-maps';
import GetLocation from 'react-native-get-location';

export default class Pharmacy extends React.Component {
  constructor() {
    super();
    setTimeout(() => {
      if (this.state.firstLoad) {
        this.getPharmacies(this.props.route.params.meds);
        this.state.firstLoad = false;
      }
    }, 1000);
  }

  state = {
    isModalVisible: false,
    loading: true,
    error: '',
    firstLoad: true,
    pharmacies: [],
    all: true,
    coords: [0, 0],
    curPharm: {adress: '', tel: '', distance: ''},
  };

  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };

  showMap(parent, coords, data) {
    parent.setState({coords: coords, curPharm: data});
    parent.toggleModal();
  }

  getPharmacies(meds) {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then((location) => {
        API.getPharmacies(meds, location, this.state.all)
          .then((r) => {
            this.setState({loading: false, pharmacies: r.data});
          })
          .catch((err) => {
            this.setState({error: err});
          });
      })
      .catch((error) => {
        const {code, message} = error;
      });
  }

  render() {
    // if (this.state.firstLoad) {
    //     this.getPharmacies(this.props.route.params.meds);
    //     this.state.firstLoad = false;
    // }

    return (
      <View style={local_styles.container1}>
        <Modal
          style={{margin: 0, marginTop: '10%'}}
          isVisible={this.state.isModalVisible}>
          <View style={[local_styles.container1, {flex: 0, paddingTop: 50}]}>
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
            <MapView
              style={{width: '100%', height: '70%'}}
              initialRegion={{
                latitude: parseFloat(this.state.coords[0]),
                longitude: parseFloat(this.state.coords[1]),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}>
              <Marker
                key={0}
                coordinate={{
                  latitude: parseFloat(this.state.coords[0]),
                  longitude: parseFloat(this.state.coords[1]),
                }}
                title={'დეპო'}
                description={'depo'}
              />
            </MapView>

            <View
              style={{
                marginTop: 20,
                display: 'flex',
                flexDirection: 'column',
              }}>
              <View style={{display: 'flex', flexDirection: 'row'}}>
                <Image
                  style={{
                    width: 30,
                    height: 30,
                    marginRight: 15,
                    borderRadius: 10,
                    marginTop: 0,
                  }}
                  source={require('../img/pin.png')}
                />
                <Text style={{}}>{this.state.curPharm.adress}</Text>
              </View>

              <View
                style={{display: 'flex', flexDirection: 'row', marginTop: 20}}>
                <Image
                  style={{
                    width: 25,
                    height: 25,
                    marginRight: 20,
                    borderRadius: 10,
                  }}
                  source={require('../img/phone-logo.png')}
                />
                <Text>{this.state.curPharm.tel}</Text>
              </View>
            </View>
          </View>
        </Modal>

        {this.state.loading ? (
          <View style={{height: '100%', width: '100%'}}>
            <Loader></Loader>
          </View>
        ) : (
          <View></View>
        )}

        <View style={[styles.container, {width: '100%'}]}>
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <CheckBox
              value={this.state.all}
              onValueChange={() => this.changeAll()}
              style={{alignSelf: 'center'}}
            />
            <TouchableOpacity
              onPress={() => {
                this.changeAll();
              }}>
              <Text style={[styles.Mrgvlovani, {color: '#37AAAE'}]}>
                მაჩვენე ყველა წამალი ერთ აფთიაქში
              </Text>
            </TouchableOpacity>
          </View>

          <SafeAreaView style={[styles.container, {width: '100%'}]}>
            <ScrollView style={styles.fill}>
              {this.state.pharmacies.map((el, index) => (
                <PharmacyItem
                  callbackFn={this.showMap}
                  parent={this}
                  key={index}
                  data={{
                    latitude: el['details']['latitude'],
                    longitude: el['details']['longitude'],
                    distance: el['distance'].toFixed(2),
                    adress: el['details']['sawy_misamarti'],
                    tel: el['details']['sawy_tel'],
                    quant: el['quant'],
                    sum: this.props.route.params.meds.length,
                  }}
                />
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </View>
    );
  }

  changeAll() {
    this.setState({
      all: !this.state.all,
      firstLoad: true,
      loading: true,
    });
    this.getPharmacies(this.props.route.params.meds);
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
