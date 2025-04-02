// screens/RescuerProfileScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function RescuerProfileScreen({ userId, onProfileComplete }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = async () => {
    if (!name || !phone || !experience) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    const { error } = await supabase
    .from('rescuers')
    .upsert({
        id: userId,
        name,
        phone,
        experience,
    }, { onConflict: 'id' });


    if (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Could not save your profile. Please try again.');
    } else {
      Alert.alert('Profile Saved', 'Thank you! Your rescuer profile is complete.');
      onProfileComplete();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rescuer Profile Setup</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Experience or Affiliation (optional details)"
        value={experience}
        onChangeText={setExperience}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    color: '#3b7d3c',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#3b7d3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
