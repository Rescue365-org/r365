// screens/RoleSelectionScreen.js
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import Rescue365Logo from '../Rescue365Logo.png';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import NotificationScreen from './NotificationScreen';

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  const [showNotifications, setShowNotifications] = useState(false);

  const showNotificationScreen = () => setShowNotifications(true);
  const hideNotificationScreen = () => setShowNotifications(false);

  if (showNotifications) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <NotificationScreen goBackToRoleSelection={hideNotificationScreen} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image source={Rescue365Logo} style={styles.logo} />
        <Text style={styles.title}>Welcome to Rescue365!</Text>
      </View>

      <View style={styles.roleContainer}>
        <Text style={styles.subtitle}>Select your role:</Text>

        <View style={styles.grid}>
          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => setRole('bystander')}
          >
            <FontAwesome5 name="paw" size={28} color="#fff" />
            <Text style={styles.gridLabel}>Bystander</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => setRole('rescuer')}
          >
            <MaterialIcons name="volunteer-activism" size={28} color="#fff" />
            <Text style={styles.gridLabel}>Rescuer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => setRole('vet')}
          >
            <FontAwesome5 name="clinic-medical" size={28} color="#fff" />
            <Text style={styles.gridLabel}>Vet Staff</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.gridButton}
            onPress={() => setRole('donor')}
          >
            <MaterialIcons name="attach-money" size={28} color="#fff" />
            <Text style={styles.gridLabel}>Donor</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSignOut}
          style={styles.signOutButton}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notifyButton}
          onPress={showNotificationScreen}
        >
          <FontAwesome5 name="bell" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b7d3c',
  },

  roleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#3b7d3c',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '90%',
  },
  gridButton: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: '#3b7d3c',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridLabel: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#d9534f',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 16,
  },
  signOutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  notifyButton: {
    position: 'absolute',
    top: -10,
    right: 20,
    backgroundColor: '#3b7d3c',
    padding: 10,
    borderRadius: 20,
  },
});
