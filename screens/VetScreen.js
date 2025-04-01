// screens/VetScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function VetScreen({
  rescueReports,
  selectedReport,
  setSelectedReport,
  updateRescueStatus,
}) {
  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={styles.header}>In-Progress Rescue Reports</Text>
      {rescueReports.length === 0 ? (
        <Text>No rescue reports currently in progress.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }}>
          {rescueReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportCard}
              onPress={() => setSelectedReport(report)}
            >
              <Text style={styles.label}>Animal Type: {report.animal_type}</Text>
              <Text>Description: {report.description}</Text>
              <Text>Location: {report.address || 'Address not available'}</Text>

              {selectedReport?.id === report.id && (
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: '#3b7d3c' }]}
                  onPress={() => updateRescueStatus(report.id, 'Rescue Complete')}
                >
                  <Text style={styles.actionButtonText}>Mark as Complete</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
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
