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
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Vet Dashboard</Text>

        {rescueReports.length === 0 && (
          <Text style={{ marginTop: 20 }}>No active cases to review.</Text>
        )}

        {rescueReports.map((report) => (
          <TouchableOpacity
            key={report.id}
            onPress={() =>
              selectedReport?.id === report.id
                ? setSelectedReport(null)
                : setSelectedReport(report)
            }
            style={[
              styles.reportCard,
              selectedReport?.id === report.id && styles.selectedCard,
            ]}
          >
            <Text style={styles.reportText}>
              🐾 {report.animal_type} — {report.severity}
            </Text>
            <Text style={styles.address}>{report.address}</Text>
          </TouchableOpacity>
        ))}

        {selectedReport && (
          <View style={styles.actions}>
            <Text style={styles.selectedText}>Selected Report: {selectedReport.animal_type}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#4CAF50' }]}
              onPress={() => updateRescueStatus(selectedReport.id, 'Rescue Complete')}
            >
              <Text style={styles.buttonText}>Mark as Complete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#f39c12' }]}
              onPress={() => updateRescueStatus(selectedReport.id, 'Donations Needed')}
            >
              <Text style={styles.buttonText}>Needs Funding</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#3b7d3c', marginBottom: 15 },
  reportCard: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedCard: {
    borderColor: '#3b7d3c',
    borderWidth: 2,
    backgroundColor: '#e6f4ea',
  },
  reportText: { fontSize: 16, fontWeight: 'bold' },
  address: { fontSize: 14, color: '#555' },
  actions: { marginTop: 20, alignItems: 'center' },
  selectedText: { fontSize: 16, marginBottom: 10 },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
