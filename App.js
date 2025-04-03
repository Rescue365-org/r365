// App.js
import React, { useState, useEffect } from 'react';
import { Text, View, Alert, Platform, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { supabase } from './services/supabaseClient';
import { getDistance } from 'geolib';

// Import your new screens:
import SignInScreen from './screens/SignInScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import BystanderScreen from './screens/BystanderScreen';
import RescuerScreen from './screens/RescuerScreen';
import VetScreen from './screens/VetScreen';
import DonationScreen from './screens/DonationScreen';
import RescuerProfileScreen from './screens/RescuerProfileScreen';


export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [location, setLocation] = useState(null);
  const [description, setDescription] = useState('');
  const [animalType, setAnimalType] = useState('');
  const [severity, setSeverity] = useState('');
  const [image, setImage] = useState(null);
  const [rescueReports, setRescueReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [rescuerProfileExists, setRescuerProfileExists] = useState(false);
  const [reporterInfo, setReporterInfo] = useState(null);
  const [isVerifiedVet, setIsVerifiedVet] = useState(false);
  const [acceptedReportIds, setAcceptedReportIds] = useState([]);

  const developerOverrideEmails = [
    'jraphino@bu.edu',
    'kbyun1@bu.edu',
    'sjzuniga@bu.edu',
    'ramondon@bu.edu'
  ];

  useEffect(() => {
    const checkVetVerification = async () => {
      if (user && role === 'vet') {
        const { data: vetData, error } = await supabase
          .from('vets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (vetData || developerOverrideEmails.includes(user.email)) {
          setIsVerifiedVet(true);
        } else {
          setIsVerifiedVet(false);
          Alert.alert("Access Denied", "You are not verified to access Vet tools.");
          setRole(null);
        }
      }
    };

    checkVetVerification();
  }, [role, user]);

  // ------------------------
  // 1. AUTH & SESSION LOGIC
  // ------------------------
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (data?.session) {
          setUser(data.session.user);
        } else if (error) {
          // Attempt refresh if there's an error
          const { data: refreshedSession } = await supabase.auth.refreshSession();
          if (refreshedSession?.session) {
            setUser(refreshedSession.session.user);
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        registerForPushNotifications(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      listener.subscription?.unsubscribe();
    };
  }, []);

  WebBrowser.maybeCompleteAuthSession();

  const handleGoogleSignIn = async () => {
    try {
      const redirectUri = Linking.createURL("/auth/callback");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectUri },
      });

      if (error) {
        console.error("Google Sign-In Error:", error);
        return;
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
        if (result.type === "success") {
          const { access_token, refresh_token } = extractTokensFromUrl(result.url);
          if (access_token && refresh_token) {
            const { data: sessionData } = await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
            if (sessionData?.session) {
              const loggedInUser = sessionData.session.user;
              setUser(loggedInUser);
              registerForPushNotifications(loggedInUser.id);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error with Google Sign-In:", err);
    }
  };

  const extractTokensFromUrl = (url) => {
    const params = new URLSearchParams(url.split("#")[1]);
    return {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
    };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  useEffect(() => {
    const handleDeepLink = async ({ url }) => {
      const { access_token, refresh_token } = extractTokensFromUrl(url);
      if (access_token && refresh_token) {
        const { data: sessionData } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        if (sessionData?.session) {
          setUser(sessionData.session.user);
        }
      }
    };

    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => subscription.remove();
  }, []);

  const registerForPushNotifications = async (userId) => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log("Final notification status:", finalStatus);
        Alert.alert('Permission not granted for push notifications!');
        return;
      }
  
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
  
      // Save token to Supabase
      await supabase
        .from('device_tokens')
        .upsert({ user_id: userId, push_token: token }, { onConflict: ['user_id'] });
    } else {
      Alert.alert('Push notifications only work on physical devices');
    }
  };
  
  // ------------------------
  // 2. LOCATION & IMAGE LOGIC
  // ------------------------
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission to access location was denied");
      return;
    }
    let currentLocation = await Location.getCurrentPositionAsync({});
    const coords = {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    };
    const address = await Location.reverseGeocodeAsync(coords);

    setLocation({
      ...coords,
      address: `${address[0].name}, ${address[0].city}, ${address[0].region}`,
    });
  };

  const pickImage = async () => {
    Alert.alert("Choose an option", "Would you like to take a photo or upload one?", [
      {
        text: "Take a Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert("Permission Denied", "Camera permission is required.");
            return;
          }
          let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
            Alert.alert("Photo Taken", "Your photo has been successfully taken.");
          }
        },
      },
      {
        text: "Upload from Gallery",
        onPress: async () => {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          });
          if (!result.canceled) {
            setImage(result.assets[0].uri);
            Alert.alert("Image Selected", "Your photo has been successfully selected.");
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  // ------------------------
  // 3. RESCUE REPORT LOGIC
  // ------------------------
  
  const submitRescueReport = async () => {
    try {
      if (!location || !description || !animalType || !image || !severity) {
        Alert.alert("Missing Information", "Please fill in all fields, add a photo, and get your location.");
        return;
      }
  
      console.log("Compressing image...");
      const compressed = await ImageManipulator.manipulateAsync(
        image,
        [{ resize: { width: 800 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
  
      const imageUri = compressed.uri;
      const imageName = `rescue-${Date.now()}.jpg`;
  
      console.log("Uploading to Supabase Storage...");
  
      const { data, error: uploadError } = await supabase.storage
        .from('rescue_images')
        .upload(imageName, {
          uri: imageUri,
          type: 'image/jpeg',
          name: imageName,
        });
  
      if (uploadError) {
        console.error("Upload error:", uploadError);
        Alert.alert("Error", "Image upload failed.");
        return;
      }
  
      const { data: publicUrlData, error: urlError } = supabase.storage
        .from('rescue_images')
        .getPublicUrl(imageName);
  
      if (urlError || !publicUrlData?.publicUrl) {
        console.error("URL error:", urlError);
        Alert.alert("Error", "Failed to retrieve image URL.");
        return;
      }
  
      const imageUrl = publicUrlData.publicUrl;
  
      console.log("Inserting into database...");
      const { error: dbError } = await supabase.from('rescue_reports').insert([
        {
          animal_type: animalType,
          severity: severity,
          description: description,
          location_lat: location.latitude,
          location_lng: location.longitude,
          address: location.address,
          image_url: imageUrl,
          status: "Pending",
          reporter_id: user.id,
        },
      ]);
  
      if (dbError) {
        console.error("DB insert error:", dbError);
        Alert.alert("Error", "Failed to save report.");
      } else {
        Alert.alert("Success", "Your rescue report has been submitted!");
        setImage(null);
      }
    } catch (err) {
      console.error("Unhandled error during report submission:", err);
      Alert.alert("Unexpected Error", "Something went wrong. Try again.");
    }
  };

  const navigateToLocation = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps://?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}`,
    });
    Linking.openURL(url);
  };

  const updateRescueStatus = async (reportId, status) => {
    const { data, error } = await supabase
      .from('rescue_reports')
      .update({ status })
      .eq('id', reportId);
  
    if (error) {
      console.error("Error updating rescue status:", error);
      Alert.alert("Error", "Unable to update rescue status.");
      return;
    }
  
    Alert.alert("Status Updated", `Rescue status set to "${status}".`);
  
    if (status === "Rescue Complete") {
      setRescueReports(currentReports =>
        currentReports.filter(report => report.id !== reportId)
      );
    }
  
    const { data: reportDetails, error: reportError } = await supabase
      .from('rescue_reports')
      .select('reporter_id')
      .eq('id', reportId)
      .single();
  
    if (reportDetails?.reporter_id) {
      const { data: tokenRow, error: tokenError } = await supabase
        .from('device_tokens')
        .select('push_token')
        .eq('user_id', reportDetails.reporter_id)
        .single();
  
      const pushToken = tokenRow?.push_token;
  
      if (pushToken) {
        await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: pushToken,
            title: 'Rescue Update',
            body: `Your rescue is now marked: ${status}`,
          }),
        });
      }
    }
  };
  

  const acceptRescue = async (reportId) => {
    const { error } = await supabase
      .from('rescue_reports')
      .update({
        assigned_rescuer_id: user.id,
        status: 'Rescue Accepted',
      })
      .eq('id', reportId);
  
    if (error) {
      console.error('Error accepting rescue:', error);
      Alert.alert("Error", "Could not accept this rescue.");
    } else {
      Alert.alert("Accepted", "You’ve claimed this rescue.");
      fetchReports();
  
      // Get reporter info
      const { data: report } = await supabase
        .from('rescue_reports')
        .select('reporter_id')
        .eq('id', reportId)
        .single();
  
      if (report?.reporter_id) {
        const info = await fetchReporterInfo(report.reporter_id);
        setReporterInfo(info);
      }
    }
  };
  
  
  const unassignRescue = async (reportId) => {
    const { error } = await supabase
      .from('rescue_reports')
      .update({
        assigned_rescuer_id: null,
        status: 'Pending'
      })
      .eq('id', reportId);
  
    if (error) {
      console.error("Error unassigning rescue:", error);
      Alert.alert("Error", "Could not unassign the rescue.");
    } else {
      Alert.alert("Rescue Unassigned", "You’ve unassigned this case.");
      fetchReports(); // Refresh the list
    }
  };
  
  const postStatusUpdate = async (reportId, message) => {
    const { error } = await supabase.from('rescue_status_updates').insert([
      {
        report_id: reportId,
        rescuer_id: user.id,
        message: message,
      },
    ]);
  
    if (error) {
      console.error('Error posting status update:', error);
      Alert.alert("Error", "Failed to post status update.");
    } else {
      Alert.alert("Status Posted", "Your update was saved!");
    }
  };
  
  const fetchReporterInfo = async (reporterId) => {
    const { data, error } = await supabase
      .from('auth.users')
      .select('email') // By default, only email is available in auth.users
      .eq('id', reporterId)
      .single();
  
    if (error) {
      console.error("Error fetching reporter info:", error);
      return null;
    }
  
    return data;
  };
  
  const confirmRescue = (report) => {
    Alert.alert(
      "Confirm Rescue",
      `Are you sure you want to navigate to this location?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            navigateToLocation(report.location_lat, report.location_lng);
          },
        },
      ]
    );
  };

  // ------------------------
  // 4. FETCHING REPORTS FOR ROLES
  // ------------------------
  useEffect(() => {
    const fetchReports = async () => {
      const { data: reports, error } = await supabase.from('rescue_reports').select('*');
      if (error) {
        console.error("Error fetching rescue reports:", error);
        Alert.alert("Error", "Unable to fetch rescue reports.");
        return;
      }
      if (role === 'rescuer' && location && user) {
        const nearbyReports = reports.filter((report) => {
          const distance = getDistance(
            { latitude: location.latitude, longitude: location.longitude },
            { latitude: report.location_lat, longitude: report.location_lng }
          );
      
          const isUnassigned = !report.assigned_rescuer_id;
          const isAssignedToMe = report.assigned_rescuer_id === user.id;
      
          return (
            distance <= 10 * 1609.34 &&
            report.status !== 'Rescue Complete' &&
            (isUnassigned || isAssignedToMe)
          );
        });
      
        setRescueReports(nearbyReports);
        
        const accepted = nearbyReports
          .filter((r) =>
            r.assigned_rescuer_id === user.id &&
            r.reporter_id !== user.id
          )
          .map((r) => r.id);

        setAcceptedReportIds(accepted);

        if (selectedReport && !nearbyReports.some(r => r.id === selectedReport.id)) {
          setSelectedReport(null);
        }
      } else if (role === 'vet') {
        const inProgressReports = reports.filter(
          (report) =>
            report.status === "Rescue In Progress" ||
            report.status === "Donations Needed"
        );
        setRescueReports(inProgressReports);
        if (selectedReport && !inProgressReports.some(r => r.id === selectedReport.id)) {
          setSelectedReport(null);
        }
      } else {
        setRescueReports([]);
        setSelectedReport(null);
      }
    };

    if ((role === 'rescuer' || role === 'vet') && user) {
      fetchReports();
    }
  }, [role, location, user, selectedReport]);

  useEffect(() => {
    const checkRescuerProfile = async () => {
      if (user && role === 'rescuer') {
        const { data, error } = await supabase
          .from('rescuers')
          .select('*')
          .eq('id', user.id)
          .single();
  
        if (data) setRescuerProfileExists(true);
        else setRescuerProfileExists(false);
      }
    };
    
    if (role === 'rescuer' && user) {
        checkRescuerProfile();
    }
  }, [role, user]);
  

  // ------------------------
  // 5. RENDER LOGIC
  // ------------------------
  // (A) If the user is not logged in, show SignInScreen
  if (!user) {
    return <SignInScreen handleGoogleSignIn={handleGoogleSignIn} />;
  }

  // (B) If user logged in but hasn't selected a role, show RoleSelectionScreen
  if (!role) {
    return (
      <RoleSelectionScreen
        setRole={setRole}
        handleSignOut={handleSignOut}
      />
    );
  }


  // (C) If user has selected a role, show the appropriate screen
  return (
    <ScrollView 
    style={{ flex: 1, backgroundColor: '#f0f8f5', padding: 20 }}
    contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={{ marginTop: 40, alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#3b7d3c', textAlign: 'center', marginBottom: 10 }}>
          Rescue365
        </Text>
        <Text style={{ fontSize: 20, color: '#4a4a4a', marginBottom: 20 }}>
          Your Role: {role.charAt(0).toUpperCase() + role.slice(1)}
        </Text>
      </View>

      {role === 'bystander' && (
        <BystanderScreen
          location={location}
          getLocation={getLocation}
          description={description}
          setDescription={setDescription}
          animalType={animalType}
          setAnimalType={setAnimalType}
          severity={severity}
          setSeverity={setSeverity}
          image={image}
          pickImage={pickImage}
          submitRescueReport={submitRescueReport}
        />
      )}

      {role === 'rescuer' && !rescuerProfileExists && (
        <RescuerProfileScreen
          userId={user.id}
          onProfileComplete={() => setRescuerProfileExists(true)}
        />
      )}

      {role === 'rescuer' && rescuerProfileExists && (
        <RescuerScreen
          rescueReports={rescueReports}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          confirmRescue={confirmRescue}
          updateRescueStatus={updateRescueStatus}
          acceptRescue={acceptRescue}
          postStatusUpdate={postStatusUpdate}
          unassignRescue={unassignRescue}
          reporterInfo={reporterInfo}
          currentUserId={user.id}
        />
      )}

      {role === 'vet' && isVerifiedVet && (
        <VetScreen
          rescueReports={rescueReports}
          selectedReport={selectedReport}
          setSelectedReport={setSelectedReport}
          updateRescueStatus={updateRescueStatus}
        />
      )}

      {role === 'donor' && (
        <DonationScreen/>
      )}

    <View style={{ alignItems: 'center', marginTop: 40, marginBottom: 60 }}>
      <TouchableOpacity onPress={() => setRole(null)}>
        <Text style={{ color: '#3b7d3c', fontSize: 16, textDecorationLine: 'underline' }}>
          Change Role
        </Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}