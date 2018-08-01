import React, { PureComponent } from 'react'
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, Image, ToastAndroid } from 'react-native'
import Progress from '../app/UpdateProgressBar'
import CodePush from "react-native-sxf-patchclient"

/* 设备宽度 */
const deviceWidth = Dimensions.get('window').width;
/* 设备高度 */
const deviceHeight = Dimensions.get('window').height;

let codePushOptions = {
    updateDialog: {
        appendReleaseDescription: true,
        descriptionPrefix: '',
        mandatoryUpdateMessage: '',
        optionalUpdateMessage: '',
        mandatoryContinueButtonLabel: '立即更新',
        optionalIgnoreButtonLabel: '残忍拒绝',
        optionalInstallButtonLabel: '立即更新',
    },
    checkFrequency: CodePush.CheckFrequency.ON_NEXT_RESUME,
    installMode: CodePush.InstallMode.IMMEDIATE,
    mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,

}

class UpdateComp extends PureComponent {

    constructor(props) {
        super(props)
        this.currProgress = 0.0
        this.syncMessage = ''
        this.state = {
            modalVisible: false,
        }
    }

    codePushStatusDidChange(syncStatus) {
        switch (syncStatus) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                this.syncMessage = 'Checking for update'
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                this.syncMessage = 'Downloading package'
                this.setState({ modalVisible: true })
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                this.syncMessage = 'Awaiting user action'
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                this.syncMessage = 'Installing update'
                this.setState({ modalVisible: false })
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                this.syncMessage = 'App up to date.'
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                this.syncMessage = 'Update cancelled by user'
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                this.syncMessage = 'Update installed and will be applied on restart.'
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                this.syncMessage = 'An unknown error occurred'
                // Toast.showError('更新出错，请重启应用！')
                ToastAndroid.show('更新出错，请重启应用！', ToastAndroid.LONG);
                this.setState({ modalVisible: false })
                break;
        }
    }

    codePushDownloadDidProgress(progress) {
        if (this.state.modalVisible) {
            this.currProgress = parseFloat(progress.receivedBytes / progress.totalBytes).toFixed(2)
            this.refs.progressBar.progress = this.currProgress
        }
    }

    syncImmediate() {
        // CodePush.checkForUpdate().then((update) => {
        //     console.log('-------' + update)
        //     if (!update) {
        //         ToastAndroid.show('已是最新版本！', ToastAndroid.LONG);
        //         // Toast.showLongSuccess('已是最新版本！')
        //     } else {
        //         this.setState({ modalVisible: true, updateInfo: update, isMandatory: update.isMandatory })
        //     }
        // })
        CodePush.sync(codePushOptions,
            this.codePushStatusDidChange.bind(this),
            this.codePushDownloadDidProgress.bind(this));
    }

    componentWillMount() {
        CodePush.disallowRestart();
        this.syncImmediate();

    }

    componentDidMount() {
        CodePush.allowRestart();
    }

    renderModal() {

        return (
            <Modal
                animationType={"none"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => { }}>
                <View style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View>
                            <Image source={require('./assets/update/update_pb_bg.png')} />

                            <View style={{ position: 'absolute', bottom: 0, justifyContent: 'flex-end' }}>
                                <Progress
                                    ref="progressBar"
                                    progressColor={'#7CBEFA'}
                                    style={{
                                        marginTop: 20,
                                        height: 10,
                                        width: deviceWidth - 100,
                                        backgroundColor: '#F1F1F1',
                                        borderRadius: 10,
                                        marginLeft: 6
                                    }}
                                />
                                <View style={{ alignItems: 'center', marginVertical: 14 }}>
                                    <Text style={{ fontSize: 14, color: '#BFBFBF' }}>版本正在努力更新中，请等待</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 17, 17, 0.5)',
    },
    modal: {
        height: deviceHeight,
        width: deviceWidth,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    modalContainer: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }
})

export default UpdateComp