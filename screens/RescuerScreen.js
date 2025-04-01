// screens/RescuerScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';

export default function RescuerScreen({
  rescueReports,
  selectedReport,
  setSelectedReport,
  confirmRescue,
  updateRescueStatus,
}) {
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={styles.header}>Nearby Rescue Reports</Text>
      {rescueReports.length === 0 ? (
        <Text>No rescue reports within 10 miles of your location.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {rescueReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={[
                styles.reportCard,
                selectedReport?.id === report.id ? { backgroundColor: '#dff0d8' } : {},
              ]}
              onPress={() => setSelectedReport(report)}
            >
              <Text style={styles.label}>Animal Type: {report.animal_type}</Text>
              <Text>Description: {report.description}</Text>
              <Text>Location: {report.address || 'Address not available'}</Text>
              {report.image_url && (
                <Image source={{ uri: report.image_url }} style={styles.image} />
              )}

              {selectedReport?.id === report.id && (
                <View>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => confirmRescue(report)}
                  >
                    <Text style={styles.actionButtonText}>Navigate to Location</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => updateRescueStatus(report.id, 'Rescue In Progress')}
                  >
                    <Text style={styles.actionButtonText}>Mark as In Progress</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
                    onPress={() => updateRescueStatus(report.id, 'Rescue Complete')}
                  >
                    <Text style={styles.actionButtonText}>Mark as Complete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {selectedReport && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'green' }}>
            You have selected a report!
          </Text>
          <Text>Animal Type: {selectedReport.animal_type}</Text>
          <Text>Description: {selectedReport.description}</Text>
          <Text>Location: {selectedReport.address}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b7d3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    width: '100%',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 15,
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
});
