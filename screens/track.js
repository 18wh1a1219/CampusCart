import React, { useEffect, useState } from 'react';
import { View, ImageBackground, TextInput, ScrollView, Image, Text, StyleSheet, Alert} from 'react-native';

import StepIndicator from 'react-native-step-indicator';
export default function Track({ navigation }) {
  
  const labels = ["Order Confirmed","Packed","Shipping","Out for Delivery","Delivered"];
  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize:30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013'
  }

  return (
    <View style={styles.container} >
    <StepIndicator
         customStyles={customStyles}
         currentPosition={1}
         labels={labels}
    />
    </View>
  );
}

const styles = {
    container: {
        top: '40%'
    }
}

