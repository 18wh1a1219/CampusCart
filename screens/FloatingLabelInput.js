import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
} from 'react-native';

export class FloatingLabelInput extends Component {
    state = {
        isFocused: false,
    };

    componentDidMount() {
        if (this.props.value !== "") {
            this.setState({ isFocused: true });
        }
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.value !== this.props.value || this.state.isFocused !== previousState.isFocused) {
            this.setState({ isFocused: true });
        }
    }

    handleFocus = () => this.setState({ isFocused: true });
    handleBlur = () => this.setState({ isFocused: false });

    render() {
        const { label, ...props } = this.props;
        const { isFocused } = this.state;
        const labelStyle = {
            position: 'absolute',
            left: 0,
            top: !isFocused ? 18 : 0,
            fontSize: !isFocused ? 15 : 14,
            color: !isFocused ? '#aaa' : '#000',
        };
        return (
            <View style={{ paddingTop: 18 }}>
                <Text style={labelStyle}>
                    {label}
                </Text>
                <TextInput
                    {...props}
                    style={{marginBottom:15, height: 50,width:350, fontSize: 20, color: '#000', borderBottomWidth: 1, borderBottomColor: '#555' }}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    blurOnSubmit
                />
            </View>
        );
    }
}