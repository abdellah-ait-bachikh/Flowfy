import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { tailwindColors, appColors } from '@/theme/colors';

interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  createdAt: string;
  lastModified: string;
}

const staticUser: User = {
  id: '1',
  fullName: 'John Doe',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  createdAt: '2024-01-15T10:30:00Z',
  lastModified: '2024-03-20T14:45:00Z',
};

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(staticUser);
  const [isLogin, setIsLogin] = useState(false);
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!loginData.phone || !loginData.password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // For demo purposes, login with any phone and password "123456"
      if (loginData.password === '123456') {
        setUser(staticUser);
        setIsLogin(false);
        setLoginData({ phone: '', password: '' });
        Alert.alert('Success', 'Logged in successfully!');
      } else {
        Alert.alert('Error', 'Invalid phone number or password');
      }
    }, 1500);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            setUser(null);
            Alert.alert('Success', 'Logged out successfully!');
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (user) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar and User Info Row */}
          <View style={styles.userHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.fullName.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          </View>

          {/* Information Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>{formatDate(user.createdAt)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>{formatDate(user.lastModified)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>{user.id}</Text>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // Login Form
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome</Text>
        <Text style={styles.headerSubtitle}>Please login to continue</Text>
      </View>

      {/* Login Card */}
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>Login to Your Account</Text>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your phone number"
            placeholderTextColor={tailwindColors.neutral[400]}
            value={loginData.phone}
            onChangeText={(text) => setLoginData(prev => ({ ...prev, phone: text }))}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your password"
            placeholderTextColor={tailwindColors.neutral[400]}
            value={loginData.password}
            onChangeText={(text) => setLoginData(prev => ({ ...prev, password: text }))}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Any phone number + Password: 123456</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        {/* Additional Options */}
        <View style={styles.loginOptions}>
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton}>
            <Text style={styles.optionText}>Create New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: appColors.white,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    // backgroundColor: tailwindColors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: tailwindColors.neutral[200],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: tailwindColors.neutral[800],
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: tailwindColors.neutral[600],
    textAlign: 'center',
    marginTop: 8,
  },
  profileCard: {
    padding: 20,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16, // 10px gap between avatar and user info
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: tailwindColors.blue[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: tailwindColors.neutral[800],
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: tailwindColors.neutral[600],
  },
  section: {
    backgroundColor: tailwindColors.neutral[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: tailwindColors.neutral[800],
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: tailwindColors.neutral[600],
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '400',
    color: tailwindColors.neutral[800],
    flex: 2,
    textAlign: 'right',
  },
  logoutButton: {
    backgroundColor: tailwindColors.red[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginCard: {
    padding: 20,
    marginTop: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: tailwindColors.neutral[800],
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: tailwindColors.neutral[700],
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: tailwindColors.neutral[300],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: tailwindColors.neutral[800],
    backgroundColor: appColors.white,
  },
  demoInfo: {
    backgroundColor: tailwindColors.blue[50],
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: tailwindColors.blue[500],
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: tailwindColors.blue[700],
    marginBottom: 4,
  },
  demoText: {
    fontSize: 12,
    color: tailwindColors.blue[600],
  },
  loginButton: {
    backgroundColor: tailwindColors.green[500],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: tailwindColors.neutral[400],
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  optionButton: {
    padding: 8,
  },
  optionText: {
    fontSize: 14,
    color: tailwindColors.blue[600],
    fontWeight: '500',
  },
});

export default ProfilePage;