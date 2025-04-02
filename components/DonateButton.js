// components/DonateButton.js
import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const DonateButton = () => {
  const [donationAmount, setDonationAmount] = useState("10.00");

  const handleDonate = async () => {
    try {
      const response = await fetch('https://your-backend.com/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationAmount })
      });
      const data = await response.json();
      if (data.approvalUrl) {
        const result = await WebBrowser.openAuthSessionAsync(data.approvalUrl, 'yourapp://donation-callback');
        if (result.type === 'success') {
          Alert.alert('Donation', 'Thank you for your donation!');
        } else {
          Alert.alert('Donation Cancelled', 'Donation process was cancelled.');
        }
      } else {
        Alert.alert('Error', 'Unable to create PayPal order.');
      }
    } catch (error) {
      console.error('Donation error:', error);
      Alert.alert('Error', 'An error occurred during the donation process.');
    }
  };

  return (
    <View style={{ marginTop: 20, alignItems: 'center' }}>
      <TextInput
        value={donationAmount}
        onChangeText={setDonationAmount}
        keyboardType="numeric"
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          width: '80%',
          marginBottom: 10,
          borderRadius: 5,
        }}
        placeholder="Enter donation amount"
      />
      <TouchableOpacity
        style={{ padding: 12, backgroundColor: '#0070ba', borderRadius: 8, alignItems: 'center' }}
        onPress={handleDonate}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>Donate via PayPal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DonateButton;
