// screens/DonationScreen.js
import React from 'react';
import { View, Text } from 'react-native';
import DonateButton from '../components/DonateButton';

export default function DonationScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 20, backgroundColor: '#f0f8f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#3b7d3c' }}>
        Donate to Rescue365
      </Text>
      <DonateButton />
    </View>
  );
}