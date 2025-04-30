// Finalized RoleSelectionScreen.js with centered larger logo and clean UI
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import NotificationScreen from './NotificationScreen';
import Rescue365Logo from '../Rescue365Logo.png';
import { supabase } from '../services/supabaseClient';

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  const [userEmail, setUserEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

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
    return <NotificationScreen goBackToRoleSelection={() => setShowNotifications(false)} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => setShowNotifications(true)} style={styles.notificationButton}>
          <FontAwesome5 name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.logoWrapper}>
          <Image source={Rescue365Logo} style={styles.logo} resizeMode="cover" />
        </View>

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
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    borderRadius: 100,
    overflow: 'hidden',
    width: 140,
    height: 140,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#3b7d3c',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  notificationButton: {
    backgroundColor: '#3b7d3c',
    padding: 12,
    borderRadius: 10,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
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
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    width: 120,
    height: 100,
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
