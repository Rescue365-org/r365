// Restored original RoleSelectionScreen layout with notification bell, centered logo, and email display
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import Rescue365Logo from '../Rescue365Logo.png';
import NotificationScreen from './NotificationScreen';
import { supabase } from '../services/supabaseClient';

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    fetchUser();
  }, []);

  if (showNotifications) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NotificationScreen goBackToRoleSelection={() => setShowNotifications(false)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <View style={styles.logoWrapper}>
          <Image source={Rescue365Logo} style={styles.logo} resizeMode="cover" />
        </View>
        <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.notificationButton}>
          <FontAwesome5 name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.welcome}>Welcome to Rescue365!</Text>
        <Text style={styles.email}>Logged in as: {userEmail || 'Loading...'}</Text>
        <Text style={styles.subtitle}>Select your role:</Text>

        <View style={styles.roleGrid}>
          <TouchableOpacity style={styles.iconButton} onPress={() => setRole('bystander')}>
            <FontAwesome5 name="paw" size={24} color="#fff" />
            <Text style={styles.iconLabel}>Bystander</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => setRole('rescuer')}>
            <MaterialIcons name="volunteer-activism" size={24} color="#fff" />
            <Text style={styles.iconLabel}>Rescuer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => setRole('vet')}>
            <FontAwesome5 name="clinic-medical" size={24} color="#fff" />
            <Text style={styles.iconLabel}>Vet Staff</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={() => setRole('donor')}>
            <MaterialIcons name="attach-money" size={24} color="#fff" />
            <Text style={styles.iconLabel}>Donor</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8f5',
  },
  headerRow: {
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    position: 'relative'
  },
  logoWrapper: {
    backgroundColor: '#fff',
    borderRadius: 0,
    overflow: 'hidden',
    width: 160,
    height: 160,
    marginTop: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#3b7d3c',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  notificationButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    backgroundColor: '#3b7d3c',
    padding: 12,
    borderRadius: 10,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    color: '#3b7d3c',
    marginBottom: 20,
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 30,
  },
  iconButton: {
    backgroundColor: '#3b7d3c',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    width: 140,
    height: 120,
  },
  iconLabel: {
    color: '#fff',
    marginTop: 5,
    fontSize: 14,
    fontWeight: '500',
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
