// screens/SignInScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import googleLogo from '../google.png'; // <-- adjust if your google.png is elsewhere

export default function SignInScreen({ handleGoogleSignIn }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8f5', padding: 20 }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#3b7d3c', marginBottom: 10 }}>Rescue365</Text>
      <Text style={{ fontSize: 18, color: '#4a4a4a', marginBottom: 40, textAlign: 'center' }}>
        Save Lives, One Rescue at a Time!
      </Text>

      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          paddingVertical: 12,
          paddingHorizontal: 24,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={handleGoogleSignIn}
      >
        <Image source={googleLogo} style={{ width: 24, height: 24, marginRight: 12 }} />
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#4a4a4a' }}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
