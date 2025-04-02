// components/DonateButton.js
import React, { useState } from 'react';
import { Alert, TouchableOpacity, Text, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const DonateButton = () => {
  const [donationAmount, setDonationAmount] = useState('10.00');

  const handleDonate = async () => {
    try {
      // Create the PayPal order
      const response = await fetch('http://168.122.129.121:3000/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ donationAmount })
      });

      const orderData = await response.json();

      if (orderData.approvalUrl) {
        // Open the PayPal checkout page
        const result = await WebBrowser.openAuthSessionAsync(orderData.approvalUrl, 'yourapp://donation-callback');
        
        // Check if the callback URL contains a token (orderID)
        if (result.type === 'success' && result.url) {
          // Example callback URL: yourapp://donation-callback?token=ORDER_ID
          const url = new URL(result.url);
          const orderID = url.searchParams.get('token');
          
          if (orderID) {
            // Now capture the order by calling your capture endpoint
            const captureResponse = await fetch('http://168.122.129.121:3000/capture-paypal-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID })
            });
            const captureData = await captureResponse.json();
            if (captureData.status === 'COMPLETED') {
              Alert.alert('Donation', 'Thank you for your donation!');
            } else {
              Alert.alert('Donation', 'Payment was not completed.');
            }
          } else {
            Alert.alert('Error', 'No order token found in the callback URL.');
          }
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
        style={{
          padding: 12,
          backgroundColor: '#0070ba',
          borderRadius: 8,
          alignItems: 'center'
        }}
        onPress={handleDonate}
      >
        <Text style={{ color: '#fff', fontSize: 16 }}>
          Donate via PayPal
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DonateButton;