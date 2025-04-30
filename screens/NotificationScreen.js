// Combined NotificationScreen.js with UI improvements + delete button
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { supabase } from '../services/supabaseClient';

export default function NotificationScreen({ goBackToRoleSelection }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const markAllAsRead = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id) {
        await supabase
          .from('notifications')
          .update({ is_read: true })
          .or(`reporter_id.eq.${user.id},assigned_rescuer_id.eq.${user.id}`);
      }
    };
  
    markAllAsRead();
    fetchNotifications();
  }, []);
  

  const markAllAsRead = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .or(`reporter_id.eq.${user.id},assigned_rescuer_id.eq.${user.id}`);
    }
  };
  
  markAllAsRead();
  

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
        setNotifications(data || []);
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

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('notifications').delete().eq('id', id);
      if (error) {
        console.error('Failed to delete notification:', error.message);
        Alert.alert('Error', 'Failed to delete notification.');
      } else {
        setNotifications((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (e) {
      console.error('Delete error:', e);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.notificationImage} resizeMode="cover" />
      )}
      <View style={styles.textContent}>
        <Text style={styles.notificationTitle}>{item.title || 'Untitled'}</Text>
        <Text style={styles.notificationMessage}>{item.message || 'No message.'}</Text>
        {item.animal_type && (
          <Text style={styles.animalType}>Animal: {item.animal_type}</Text>
        )}
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.iconButton}>
        <Icon name="trash-2" size={20} color="#cc0000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBackToRoleSelection} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notifications</Text>
        </View>

        {isLoading ? (
          <Text style={styles.noNotificationsText}>Loading...</Text>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
            ListEmptyComponent={() => (
              <Text style={styles.noNotificationsText}>No notifications available.</Text>
            )}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8f5',
  },
  container: {
    flex: 1,
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
  noNotificationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginVertical: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b7d3c',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  animalType: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  iconButton: {
    padding: 8,
  },
});
