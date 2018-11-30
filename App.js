import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StatusBar, Image, TouchableWithoutFeedback, StyleSheet, CameraRoll, } from 'react-native';
import { Camera, Permissions } from 'expo';
import { Feather, Entypo, FontAwesome, Foundation, } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  countDownStyle: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#e1e1e1',
    paddingTop: 20,
  },
  countDownGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#808080',
    alignItems: 'center',
    width: 80,
    height: 25,
    borderRadius: 12,
  },
  footerStyle: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentRecordStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  recordButtonStyle: {
    backgroundColor: '#e4e4e4',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonStyle: {
    alignSelf: 'center',
    justifyContent: 'center',
    marginRight: 20,
  }
})

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPause: false,
      isStartedRecord: false,
      secondLabel: '00',
      minuteLabel: '00',
      count: 0,
      timer: '',
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL,
      Permissions.AUDIO_RECORDING
    );
    let imageUri = await CameraRoll.getPhotos({ first: 1 });

    this.setState({
      hasPermission: status === 'granted',
      imageUri: imageUri,
    });
  }

  async recordVideo() {
    this.setState({
      isStartedRecord: !this.state.isStartedRecord,
    });
    let timer = setInterval(() => {
      if (this.state.isStartedRecord) {
        this.setState({
          count: this.state.count + 1,
          secondLabel: this.pad(this.state.count % 60),
          minuteLabel: this.pad(parseInt(this.state.count / 60)),
          timer: timer,
          isPause: false,
        });
      }
      else {
        this.setState({
          count: 0,
          secondLabel: '00',
          minuteLabel: '00',
          timer: '',
          isPause: false,
        });
        clearInterval(timer);
      }
    }, 1000);
    if (this.state.isStartedRecord) {
      let video = await this.camera.recordAsync();
      await CameraRoll.saveToCameraRoll(video.uri, 'video');
    }
    else {
      await this.camera.stopRecording();
    }
  }

  switchPauseRecord() {
    this.setState({ isPause: !this.state.isPause });
    if (!this.state.isPause) {
      clearInterval(this.state.timer);
    }
    else {
      let timer = setInterval(() => {
        this.setState({
          count: this.state.count + 1,
          secondLabel: this.pad(this.state.count % 60),
          minuteLabel: this.pad(parseInt(this.state.count / 60)),
          timer: timer,
        })
      }, 1000);
    }

    if (!this.state.isPause) {
      this.camera.pausePreview();
    }
    else {
      this.camera.resumePreview();
    }
  }

  pad(val) {
    var valString = val + "";
    if (valString.length < 2) {
      return "0" + valString;
    } else {
      return valString;
    }
  }

  render() {
    let recordLayout = this.state.isStartedRecord
      ? <TouchableOpacity
        onPress={() => this.recordVideo()}
      >
        <FontAwesome name="square" size={32} style={{ color: 'red', }} />
      </TouchableOpacity>
      : <TouchableOpacity
        onPress={() => this.recordVideo()}
      >
        <Feather name="video" size={32} />
      </TouchableOpacity>
    let switchLayout = this.state.isPause
      ? <View style={styles.recordButtonStyle}>
        <TouchableWithoutFeedback
          onPress={() => this.switchPauseRecord()}
        >
          <Entypo name="triangle-right" size={32} />
        </TouchableWithoutFeedback>
      </View>
      : <View style={styles.recordButtonStyle}>
        <TouchableWithoutFeedback
          onPress={() => this.switchPauseRecord()}
        >
          <Foundation name="pause" size={32} style={this.state.isStartedRecord ? {} : { display: 'none', }} />
        </TouchableWithoutFeedback>
      </View>
    let countDownLayout = <View style={styles.countDownGroup}>
                            <Entypo name="controller-record" size={20} style={{ color: 'red', }} />
                            <Text style={{ color: '#000', }}>{this.state.minuteLabel}:{this.state.secondLabel}</Text>
                          </View>
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <Camera style={styles.countDownStyle}
          ref={(cam) => this.camera = cam}
        >
          {countDownLayout}
        </Camera>
        {/* Footer */}
        <View style={styles.footerStyle}>
          <View style={[styles.currentRecordStyle, styles.recordButtonStyle]}>
            <Image
              source={require('./assets/images/expo.png')} // get the latest image from camera roll
              resizeMode="contain"
              style={{ height: 32, width: 32, }}
            />
          </View>
          <View style={styles.recordButtonStyle}>
            {recordLayout}
          </View>
          <View style={styles.pauseButtonStyle}>
            {switchLayout}
          </View>
        </View>
      </View >
    );
  }
}

export default App;
