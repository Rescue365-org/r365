// screens/RoleSelectionScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { supabase } from '../services/supabaseClient';
import Rescue365Logo from '../Rescue365Logo.png';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';

export default function RoleSelectionScreen({ setRole, handleSignOut }) {
  const [userEmail, setUserEmail] = React.useState('');

  React.useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    borderWidth: 2,
    borderColor: '#3b7d3c',
    borderRadius: 16,
    padding: 8,
    marginBottom: 20,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3b7d3c',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    color: '#555',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#3b7d3c',
    borderRadius: 10,
    width: '42%',
    marginVertical: 12,
  },
  iconLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
  },
  signOutButton: {
    marginTop: 40,
  },
  signOutText: {
    color: '#ff0000',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});
