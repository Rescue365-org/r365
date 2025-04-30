// screens/DonationScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Alert,
  StyleSheet,
  Modal,
  TextInput,
} from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function DonationScreen() {
  const [donationCases, setDonationCases] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [amountInput, setAmountInput] = useState('');

  const fetchDonationsNeeded = async () => {
    const { data, error } = await supabase
      .from('rescue_reports')
      .select('id, animal_type, severity, description, address, image_url, donations_needed, donations_received')
      .eq('status', 'Donations Needed');

    if (error) {
      console.error("Error fetching donation cases:", error);
      Alert.alert('Error', 'Could not load donation cases.');
    } else {
      setDonationCases(data);
    }
  };

  useEffect(() => {
    fetchDonationsNeeded();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDonationsNeeded();
    setRefreshing(false);
  };

  const openDonateModal = (report) => {
    setSelectedReport(report);
    setAmountInput('');
    setModalVisible(true);
  };

  const submitDonation = async () => {
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      return Alert.alert('Invalid Amount', 'Please enter a positive number.');
    }
    try {
      const paypalUrl = `https://www.paypal.me/Rescue365Project/${amount}`;
      await Linking.openURL(paypalUrl);

      // Update donations_received
      const newTotal = (selectedReport.donations_received || 0) + amount;
      const { error: updateError } = await supabase
        .from('rescue_reports')
        .update({ donations_received: newTotal })
        .eq('id', selectedReport.id);
      if (updateError) throw updateError;

      setModalVisible(false);
      fetchDonationsNeeded();
      Alert.alert('Thank you!', `You donated $${amount.toFixed(2)}.`);
    } catch (err) {
      console.error('Donation error:', err);
      Alert.alert('Error', err.message);
    }
  };

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.heading}>Rescues Needing Donations</Text>

        {donationCases.length === 0 ? (
          <Text>No cases currently need donations.</Text>
        ) : (
          donationCases.map((report) => {
            const needed = report.donations_needed || 0;
            const received = report.donations_received || 0;
            const progress = needed > 0 ? Math.min(received / needed, 1) : 0;

            return (
              <View key={report.id} style={styles.card}>
                {report.image_url && (
                  <Image source={{ uri: report.image_url }} style={styles.image} />
                )}
                <Text style={styles.title}>
                  {report.animal_type} — {report.severity}
                </Text>
                <Text style={styles.description}>{report.description}</Text>
                <Text style={styles.location}>Location: {report.address}</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    ${received.toFixed(2)} / ${needed.toFixed(2)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.donateButton}
                  onPress={() => openDonateModal(report)}
                >
                  <Text style={styles.donateButtonText}>Donate</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Donation Amount Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Donation Amount</Text>
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
                onPress={submitDonation}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f0f8f5' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#3b7d3c' },
  card: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  description: { marginBottom: 5 },
  location: { fontStyle: 'italic', color: '#555', marginBottom: 10 },
  progressContainer: { marginBottom: 15 },
  progressBarBackground: {
    width: '100%',
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b7d3c',
  },
  progressText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'right',
    color: '#555',
  },
  donateButton: {
    backgroundColor: '#0070ba',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
  modalButton: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, marginLeft: 10 },
  cancelButton: { backgroundColor: '#888' },
  submitButton: { backgroundColor: '#3b7d3c' },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
