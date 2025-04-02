// screens/RoleSelectionScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#f0f8f5', padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b7d3c', textAlign: 'center' }}>
        Select Your Role:
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 }}>
        <TouchableOpacity
          style={{ alignItems: 'center', padding: 15, backgroundColor: '#3b7d3c', borderRadius: 8, width: '22%' }}
          onPress={() => setRole('bystander')}
        >
          <FontAwesome5 name="paw" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Bystander</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: 'center', padding: 15, backgroundColor: '#3b7d3c', borderRadius: 8, width: '22%' }}
          onPress={() => setRole('rescuer')}
        >
          <MaterialIcons name="volunteer-activism" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Rescuer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: 'center', padding: 15, backgroundColor: '#3b7d3c', borderRadius: 8, width: '22%' }}
          onPress={() => setRole('vet')}
        >
          <FontAwesome5 name="clinic-medical" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Vet Staff</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ alignItems: 'center', padding: 15, backgroundColor: '#3b7d3c', borderRadius: 8, width: '22%' }}
          onPress={() => setRole('donor')}
        >
          <MaterialIcons name="attach-money" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, marginTop: 5 }}>Donor</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: '#e57373',
          paddingVertical: 10,
          paddingHorizontal: 25,
          borderRadius: 8,
          alignItems: 'center',
          marginTop: 60,
          marginBottom: 20,
          alignSelf: 'center',
          width: '40%',
        }}
        onPress={handleSignOut}
      >
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}
