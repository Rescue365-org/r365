// screens/BystanderScreen.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Picker } from '@react-native-picker/picker';

const { width } = Dimensions.get('window');
const PICKER_WIDTH = width * 0.9;
const levels = ['Mild', 'Moderate', 'Severe', 'Critical'];

export default function BystanderScreen({
  location,
  getLocation,
  description,
  setDescription,
  animalType,
  setAnimalType,
  image,
  severity,
  setSeverity,
  pickImage,
  submitRescueReport,
}) {
  const severityColors = {
    Mild: '#81c784',
    Moderate: '#fff176',
    Severe: '#ffb74d',
    Critical: '#e57373',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose Animal Type:</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={animalType}
          onValueChange={setAnimalType}
          style={styles.picker}
        >
          <Picker.Item label="-- Select an option --" value="" color="#999" />
          <Picker.Item label="Dog" value="dog" />
          <Picker.Item label="Cat" value="cat" />
          <Picker.Item label="Bird" value="bird" />
          <Picker.Item label="Injured Wildlife" value="wildlife" />
          <Picker.Item label="Other" value="other" />
        </Picker>
      </View>

      <Text style={styles.label}>Severity:</Text>
      <View style={styles.severityContainer}>
        {levels.map((level) => {
          const isSelected = severity === level;
          return (
            <TouchableOpacity
              key={level}
              style={[
                styles.severityButton,
                isSelected && {
                  backgroundColor: severityColors[level],
                  borderColor: severityColors[level],
                },
              ]}
              onPress={() => setSeverity(level)}
            >
              <Text
                style={[
                  styles.severityText,
                  isSelected && { color: '#fff', fontWeight: '600' },
                ]}
              >
                {level}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Brief description of the situation..."
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
              description={location.address}
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
        style={[styles.actionButton, styles.submitButton]}
        onPress={submitRescueReport}
      >
        <Text style={styles.actionButtonText}>Submit Rescue Report</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f8f5',
    paddingBottom: 40,
  },
  label: {
    fontSize: 18,
    color: '#4a4a4a',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  dropdown: {
    width: PICKER_WIDTH,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 50,
  },

  severityContainer: {
    width: PICKER_WIDTH,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  severityButton: {
    width: '48%',
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f7f7f7',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityText: {
    color: '#333',
    fontSize: 15,
  },

  input: {
    width: PICKER_WIDTH,
    borderWidth: 1,
    borderColor: '#c4c4c4',
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  actionButton: {
    width: PICKER_WIDTH,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#6bbf59',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3b7d3c',
    marginTop: 20,
  },

  map: {
    width: PICKER_WIDTH,
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
