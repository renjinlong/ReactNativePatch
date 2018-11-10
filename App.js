/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';


import UpdateComp from './app/UpdateComp';
import codepush from "react-native-sxf-patchclient";
import DeviceInfo from 'react-native-device-info';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  // componentWillMount() {
  //   // console.log(codePush);
  //   codepush.sync({
  //     updateDialog: true,
  //     installMode: codepush.InstallMode.IMMEDIATE,
  //     mandatoryInstallMode: codepush.InstallMode.IMMEDIATE,
  //     //deploymentKey为刚才生成的,打包哪个平台的App就使用哪个Key,这里用IOS的打包测试
  //     // deploymentKey: 'IjC3_iRGEZE8-9ikmBZ4ITJTz9wn6dec4087-57cf-4c9d-b0dc-ad38ce431e1d',
  //   });
  // }

  componentWillMount() {
    codepush.getUpdateMetadata(codepush.codePushUpdateStateRunning).then((update) => {
      if (update) {
        appVersion = update.appVersion + '.' + update.appointLable.replace('v', '');
      } else {
        appVersion = DeviceInfo.getVersion() + '.0';
      }

      console.log('appVersion:' + appVersion);
      setTimeout(() => {
        alert('appVersion:' + appVersion);
      }, 3000);

    }).catch((err) => {
      console.log("--------", err);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to test--!
        </Text>
        <Text style={styles.instructions}>
          To get started, edit App.js
        </Text>
        <Text style={styles.instructions}>
          {instructions}
        </Text>
        <TouchableOpacity style={{ backgroundColor: '#FFFFFF' }}
          onPress={() => { }}
        >
          <Text>点我</Text>
        </TouchableOpacity>

        <UpdateComp
          {...this.props}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
