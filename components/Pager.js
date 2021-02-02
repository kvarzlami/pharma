import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import React from 'react';
import styles from '../styles/style';


export default class Pager extends React.Component {
    constructor(props) {
        super(props);

    }

    state = {};

    getStyle(pageToWrite) {
        let styles = pageToWrite < 1 || pageToWrite > this.props.pages ? [local_styles.pages, local_styles.white] : [local_styles.pages];

        if (pageToWrite === this.props.curPage + 1) {
            styles.push(local_styles.bigPage);
        }

        return styles;
    }

    render() {
        let noMoreLeft = false;
        let noMoreRight = false;
        if (this.props.curPage === 0) {
            noMoreLeft = true;
        }
        if (this.props.curPage === this.props.pages - 1) {
            noMoreRight = true;
        }

        let pages = [];
        let curPageShift = -1;
        for (let i = 0; i < 3; i++) {
            let pageToWrite = this.props.curPage + i + curPageShift + 1;
            pages.push(
                <Text style={this.getStyle(pageToWrite)} key={pageToWrite}>
                    {pageToWrite}
                </Text>,
            );
        }

        return (
            <View style={[local_styles.container, styles.horizontal]}>
                <TouchableOpacity key={0}
                                  style={noMoreLeft ? styles.buttonDisabled : styles.button}
                                  onPress={() => {
                                      if (!noMoreLeft) {
                                          this.props.pagerCallBack(-1);
                                          this.forceUpdate();
                                      }
                                  }}
                >
                    <Text style={{color: '#FFF'}}>წინა</Text>
                </TouchableOpacity>
                <View style={styles.horizontal}>
                    {pages}
                </View>
                <TouchableOpacity key={1}
                                  style={noMoreRight ? styles.buttonDisabled : styles.button}
                                  onPress={() => {
                                      if (!noMoreRight) {
                                          this.props.pagerCallBack(1);
                                          this.forceUpdate();
                                      }
                                  }}
                >
                    <Text style={{color: '#FFF'}}>შემდეგი</Text>
                </TouchableOpacity>
            </View>
        );
    }

};

const local_styles = StyleSheet.create({
    container: {
        borderColor: '#fff',
        borderWidth: 1,
        height: 50,
        width: '100%',
        flex: 1,
        justifyContent: 'space-between',
    },
    pages: {
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 20,
        color: '#ccc',
    },
    white: {
        color: '#fff',
    },
    bigPage: {
        paddingTop: 0,
        fontSize: 26,
        color: '#000',
    }
});
