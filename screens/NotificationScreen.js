import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import { supabase } from '../services/supabaseClient';

export default function NotificationScreen({ goBackToRoleSelection }) {
  const [rescuerNotifications, setRescuerNotifications] = useState([]);
  const [reporterNotifications, setReporterNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error('Error fetching user:', userError.message);
        return;
      }

      const userId = user.id;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`assigned_rescuer_id.eq.${userId},reporter_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error.message);
      } else {
        const rescuerNotifs = data.filter(notif => notif.assigned_rescuer_id === userId);
        const reporterNotifs = data.filter(notif => notif.reporter_id === userId);

        setRescuerNotifications(rescuerNotifs);
        setReporterNotifications(reporterNotifs);
      }
    } catch (e) {
      console.error('Fetch failed:', e);
    } finally {
      if (showRefreshing) setRefreshing(false);
      else setIsLoading(false);
    }
  };

  const onRefresh = () => {
    fetchNotifications(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationMessage}>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBackToRoleSelection} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Notifications</Text>
      </View>

      {isLoading ? (
        <Text style={styles.noNotificationsText}>Loading...</Text>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Rescuer Notifications */}
          <Text style={styles.sectionHeader}>Rescuer Notifications</Text>
          {rescuerNotifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No rescuer notifications.</Text>
          ) : (
            <FlatList
              data={rescuerNotifications}
              renderItem={renderItem}
              keyExtractor={(item) => `rescuer-${item.id}`}
              scrollEnabled={false}  // Let ScrollView handle scrolling
            />
          )}

          {/* Reporter Notifications */}
          <Text style={styles.sectionHeader}>Reporter Notifications</Text>
          {reporterNotifications.length === 0 ? (
            <Text style={styles.noNotificationsText}>No reporter notifications.</Text>
          ) : (
            <FlatList
              data={reporterNotifications}
              renderItem={renderItem}
              keyExtractor={(item) => `reporter-${item.id}`}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#3b7d3c',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginLeft: 20,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginVertical: 10,
  },
  noNotificationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b7d3c',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});
