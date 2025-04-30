// screens/VetScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function VetScreen({
  rescueReports,
  selectedReport,
  setSelectedReport,
  updateRescueStatus, // still used for “Rescue Complete”
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [amountInput, setAmountInput] = useState('');

  // New in-file function to mark a case as needing funding
  const updateFundingNeeded = async (id, amount) => {
    const { error } = await supabase
      .from('rescue_reports')
      .update({
        status: 'Donations Needed',
        donations_needed: amount,
      })
      .eq('id', id);

    if (error) {
      console.error('Error marking funding needed:', error);
      Alert.alert('Update Failed', error.message);
    } else {
      Alert.alert('Success', 'Case updated to Funding Needed.');
      setModalVisible(false);
      setSelectedReport(null);
    }
  };

  const onNeedsFunding = () => {
    setAmountInput('');
    setModalVisible(true);
  };

  const submitFunding = () => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      return Alert.alert('Invalid Amount', 'Please enter a positive number.');
    }
    updateFundingNeeded(selectedReport.id, amount);
  };

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
            <Text style={styles.selectedText}>
              Selected Report: {selectedReport.animal_type}
            </Text>

            {selectedReport.status === 'Donations Needed' ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
                onPress={() =>
                  updateRescueStatus(selectedReport.id, 'Rescue Complete')
                }
              >
                <Text style={styles.buttonText}>Close Donation</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#4CAF50' }]}
                onPress={() =>
                  updateRescueStatus(selectedReport.id, 'Rescue Complete')
                }
              >
                <Text style={styles.buttonText}>Mark as Complete</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#f39c12' }]}
              onPress={onNeedsFunding}
            >
              <Text style={styles.buttonText}>Needs Funding</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Funding Amount Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Amount Needed</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="$0.00"
              value={amountInput}
              onChangeText={setAmountInput}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={submitFunding}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginBottom: 15,
  },
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end' },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: { backgroundColor: '#888' },
  submitButton: { backgroundColor: '#3b7d3c' },
});
