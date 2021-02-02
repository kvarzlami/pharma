import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default class Loader extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {};

    render() {

        return (
            <View style={local_styles.container}>
                <Image style={
                    {
                        width: 100,
                        height: 100,
                        marginRight: 10,
                    }
                }
                       source={require('../img/loader.gif')}
                />
            </View>
        );
    }

};

const local_styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        flex: 1,
        padding: 16,
        paddingTop: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
