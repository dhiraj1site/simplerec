import React, { Component } from 'react';
import { View, Text, CameraRoll, Image, StyleSheet, Dimensions, ScrollView } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#eee',
  },
  imageWrap: {
    margin: 2,
    padding: 2,
    height: (Dimensions.get('window').height / 3) - 12,
    width: (Dimensions.get('window').width / 2) - 4,
    backgroundColor: '#fff',
  }
});

class Photogallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
  }

  async componentWillMount() {
    let photos = await CameraRoll.getPhotos({ first: 10 });
    await this.setState({ photos: photos.edges });
  }

  render() {
    let images = this.state.photos.map((photo, key) => {
      return (
        <View key={key} style={styles.imageWrap}>
          <Image source={{ uri: photo.node.image.uri }} style={{ flex: 1, width: null, alignSelf: 'stretch' }} />
        </View>
      )
    });
    return (
      <ScrollView>
        <View style={styles.container}>
          {images}
        </View>
      </ScrollView>
    );
  }
}

export default Photogallery;
