// screens/RoleSelectionScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Rescue365Logo from '../Rescue365Logo.png';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import NotificationScreen from './NotificationScreen';  // Import NotificationScreen

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  const [userEmail, setUserEmail] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);  // State to toggle NotificationScreen

  const showNotificationScreen = () => setShowNotifications(true);
  const hideNotificationScreen = () => setShowNotifications(false);

  useEffect(() => {
    const fetchUser = async () => {
      // Fetch user logic here (if needed)
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
      {showNotifications ? (
        <NotificationScreen goBackToRoleSelection={hideNotificationScreen} />
      ) : (
        <>
          <View style={styles.logoContainer}>
            <Image source={Rescue365Logo} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>Welcome to Rescue365!</Text>
          <Text style={styles.email}>Logged in as: {userEmail}</Text>
          <Text style={styles.subtitle}>Select your role:</Text>

          <View style={styles.roleRow}>
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

          {/* Button to toggle notifications screen */}
          <TouchableOpacity onPress={showNotificationScreen} style={styles.notificationButton}>
            <Text style={{ fontSize: 24 }}>🔔</Text>  {/* Bell Icon */}
          </TouchableOpacity>
        </>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b7d3c',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#3b7d3c',
    textAlign: 'center',
    marginVertical: 10,
  },
  roleRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  iconButton: {
    backgroundColor: '#3b7d3c',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    margin: 10,
  },
  iconLabel: {
    color: '#fff',
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  signOutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  notificationButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#3b7d3c',
    padding: 10,
    borderRadius: 20,
  },
});