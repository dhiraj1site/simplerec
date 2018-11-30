import React, { Component } from 'react';
import { View, Text } from 'react-native';

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', }}>
                <View>
                    <Text style={{ fontWeight: "bold", fontSize: 25, }}> {this.props.title} </Text>
                </View>
                <View>
                    <Text style={{ fontSize: 12, fontStyle: "italic", }}> {this.props.post} </Text>
                </View>
            </View>
        );
    }
}

export default Post;
