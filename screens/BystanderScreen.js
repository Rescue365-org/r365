// screens/BystanderScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function BystanderScreen({
  location,
  getLocation,
  description,
  setDescription,
  animalType,
  setAnimalType,
  image,
  pickImage,
  submitRescueReport,
}) {
  return (
    <View style={{ width: '100%', alignItems: 'center' }}>
      <Text style={styles.label}>Animal Type:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter animal type (e.g., dog, cat)"
        value={animalType}
        onChangeText={setAnimalType}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description of the situation"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.actionButton} onPress={getLocation}>
        <Text style={styles.actionButtonText}>Get Location</Text>
      </TouchableOpacity>

      {location && (
        <>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Rescue Location"
              description={location.address} // Show address in the marker
            />
          </MapView>
          <Text style={styles.location}>
            {location.address || 'Address not available'}
          </Text>
        </>
      )}

      <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
        <Text style={styles.actionButtonText}>Upload a Photo</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
        onPress={submitRescueReport}
      >
        <Text style={styles.actionButtonText}>Submit Rescue Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: '#4a4a4a',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c4c4c4',
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#6bbf59',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 300,
    marginTop: 15,
    borderRadius: 8,
  },
  location: {
    fontSize: 16,
    color: '#3b7d3c',
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
  },
});
