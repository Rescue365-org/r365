import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { supabase } from '../services/supabaseClient';
import DonateButton from '../components/DonateButton';

export default function DonationScreen() {
  const [donationCases, setDonationCases] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDonationsNeeded = async () => {
    const { data, error } = await supabase
      .from('rescue_reports')
      .select('*')
      .eq('status', 'Donations Needed');

    if (error) {
      console.error("Error fetching donation cases:", error);
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

  return (
    <ScrollView 
      style={{ padding: 20, backgroundColor: '#f0f8f5' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#3b7d3c' }}>
        Rescues Needing Donations
      </Text>

      {donationCases.length === 0 ? (
        <Text>No cases currently need donations.</Text>
      ) : (
        donationCases.map((report) => (
          <View
            key={report.id}
            style={{
              backgroundColor: 'white',
              padding: 15,
              borderRadius: 10,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 5,
              elevation: 3,
            }}
          >
            {report.image_url && (
              <Image
                source={{ uri: report.image_url }}
                style={{ width: '100%', height: 200, borderRadius: 10, marginBottom: 10 }}
              />
            )}
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>
              {report.animal_type} - {report.severity}
            </Text>
            <Text style={{ marginBottom: 5 }}>{report.description}</Text>
            <Text style={{ fontStyle: 'italic', color: '#555', marginBottom: 10 }}>
              Location: {report.address}
            </Text>
            <DonateButton reportId={report.id} />
          </View>
        ))
      )}
    </ScrollView>
  );
}
