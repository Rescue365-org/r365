import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, TextInput, Alert } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function RescuerScreen({
  rescueReports,
  selectedReport,
  setSelectedReport,
  confirmRescue,
  updateRescueStatus,
  acceptRescue,
  postStatusUpdate,
  unassignRescue,
  currentUserId
}) {
  const [acceptedReportIds, setAcceptedReportIds] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [reporterInfo, setReporterInfo] = useState(null);

  useEffect(() => {
    const accepted = rescueReports
      .filter((r) => 
      r.assigned_rescuer_id === currentUserId &&
      r.reporter_id !== currentUserId
      )
      .map((r) => r.id);
    setAcceptedReportIds(accepted);
  }, [rescueReports]);

  useEffect(() => {
    const fetchReporterInfo = async () => {
      if (selectedReport?.reporter_id) {
        const { data, error } = await supabase.rpc('get_user_email', {
          user_id: selectedReport.reporter_id,
        });
  
        if (error) {
          console.log("Error fetching reporter info:", error);
          setReporterInfo(null);
        } else if (data && data.length > 0) {
          setReporterInfo(data[0]);
        }
      } else {
        setReporterInfo(null);
      }
    };
  
    fetchReporterInfo();
  }, [selectedReport]);
  

  return (
    <View style={{ alignItems: 'center', width: '100%' }}>
      <Text style={styles.header}>Nearby Rescue Reports</Text>
      {rescueReports.length === 0 ? (
        <Text>No rescue reports within 10 miles of your location.</Text>
      ) : (
        <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 120 }}>
          {rescueReports.map((report) => {
            const isSelected = selectedReport?.id === report.id;
            const isAccepted = acceptedReportIds.includes(report.id);

            return (
              <TouchableOpacity
                key={report.id}
                style={[
                  styles.reportCard,
                  isSelected ? { backgroundColor: '#dff0d8' } : {},
                ]}
                onPress={() => {
                  if (isSelected && !isAccepted) {
                    setSelectedReport(null);
                  } else {
                    setSelectedReport(report);
                  }
                }}
              >
                <Text style={styles.label}>Animal Type: {report.animal_type}</Text>
                <Text>Description: {report.description}</Text>
                <Text>Location: {report.address || 'Address not available'}</Text>
                {report.image_url && (
                  <Image source={{ uri: report.image_url }} style={styles.image} />
                )}

                {isSelected && !isAccepted && (
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => {
                      Alert.alert(
                        'Accept Rescue',
                        'Are you sure you want to accept this case?',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          {
                            text: 'Accept',
                            onPress: () => {
                              acceptRescue(report.id);
                              setAcceptedReportIds((prev) => [...prev, report.id]);
                            },
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.buttonText}>Accept Rescue</Text>
                  </TouchableOpacity>
                )}

                {isSelected && isAccepted && (
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

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: '#f44336' }]}
                      onPress={() => {
                        Alert.alert(
                          'Cancel Rescue',
                          'Are you sure you want to unassign this rescue?',
                          [
                            { text: 'No', style: 'cancel' },
                            {
                              text: 'Yes, Unassign',
                              onPress: () => {
                                unassignRescue(report.id);
                                setSelectedReport(null);
                                setAcceptedReportIds((prev) => prev.filter(id => id !== report.id));
                              }
                            },
                          ]
                        );
                      }}
                    >
                      <Text style={styles.actionButtonText}>Cancel Rescue</Text>
                    </TouchableOpacity>

                    <View style={{ marginTop: 20 }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Post a Status Update</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g. Transporting animal now..."
                        value={statusMessage}
                        onChangeText={setStatusMessage}
                      />
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => {
                          postStatusUpdate(report.id, statusMessage);
                          setStatusMessage('');
                        }}
                      >
                        <Text style={styles.actionButtonText}>Send Update</Text>
                      </TouchableOpacity>

                      {reporterInfo && (
                        <View style={{ marginTop: 20 }}>
                          <Text style={{ fontWeight: 'bold' }}>Submitted By:</Text>
                          <Text>Email: {reporterInfo.email}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
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
  acceptButton: {
    backgroundColor: '#0070ba',
    padding: 10,
    marginTop: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    width: 300,
  },
});