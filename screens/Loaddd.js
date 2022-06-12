import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function Loaddd() {
 

  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='darkblue' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff00',
    alignItems: 'center',
    justifyContent: 'center',
  
  },
});