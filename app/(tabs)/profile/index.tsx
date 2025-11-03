import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { tailwindColors, appColors } from '@/theme/colors';
import { useToast } from '@/components/ui/toast';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from "@/redux/store"
import { loginUser, logoutUser, getCurrentUser } from '@/redux/apiCalls/authApiCalls';
import { initUserFromStore } from '@/redux/slices/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const { user, token } = useSelector((state: RootState) => state.auth);
  
  const [loginData, setLoginData] = useState({
    phone: '',
    password: '',
  });
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Initialize auth from storage
    const initializeAuth = async () => {
      try {
        await dispatch(initUserFromStore() as any);
      } finally {
        setInitializing(false);
      }
    };
    
    initializeAuth();
  }, [dispatch]);

  useEffect(() => {
    if (token && !user) {
      // If we have token but no user data, fetch user profile
      const fetchUserProfile = async () => {
        setLoading(true);
        try {
          await dispatch(getCurrentUser(setLoading, toast) as any);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserProfile();
    }
  }, [token, user, dispatch, toast]);

  const handleLogin = () => {
    if (!loginData.phone || !loginData.password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'error',
      });
      return;
    }

    dispatch(loginUser(
      loginData,
      setLoading,
      setValidationErrors,
      toast,
      () => {
        // Login success callback
        setLoginData({ phone: '', password: '' });
        setValidationErrors({});
      }
    ) as any);
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
            setLoading(true);
            dispatch(logoutUser(toast) as any);
            // Note: The loading state will be handled by the API call
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

  // Show loading indicator while initializing
  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={tailwindColors.blue[500]} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
          <TouchableOpacity 
            style={[styles.logoutButton, loading && styles.buttonDisabled]} 
            onPress={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.logoutButtonText}>Logout</Text>
            )}
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
            style={[styles.textInput, validationErrors.phone && styles.inputError]}
            placeholder="Enter your phone number"
            placeholderTextColor={tailwindColors.neutral[400]}
            value={loginData.phone}
            onChangeText={(text) => {
              setLoginData(prev => ({ ...prev, phone: text }));
              // Clear validation error when user starts typing
              if (validationErrors.phone) {
                setValidationErrors(prev => ({ ...prev, phone: undefined }));
              }
            }}
            keyboardType="phone-pad"
            autoCapitalize="none"
            editable={!loading}
          />
          {validationErrors.phone && (
            <Text style={styles.errorText}>{validationErrors.phone}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={[styles.textInput, validationErrors.password && styles.inputError]}
            placeholder="Enter your password"
            placeholderTextColor={tailwindColors.neutral[400]}
            value={loginData.password}
            onChangeText={(text) => {
              setLoginData(prev => ({ ...prev, password: text }));
              // Clear validation error when user starts typing
              if (validationErrors.password) {
                setValidationErrors(prev => ({ ...prev, password: undefined }));
              }
            }}
            secureTextEntry
            autoCapitalize="none"
            editable={!loading}
          />
          {validationErrors.password && (
            <Text style={styles.errorText}>{validationErrors.password}</Text>
          )}
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoTitle}>Demo Credentials:</Text>
          <Text style={styles.demoText}>Any phone number + Password: 123456</Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/* Additional Options */}
        <View style={styles.loginOptions}>
          <TouchableOpacity style={styles.optionButton} disabled={loading}>
            <Text style={[styles.optionText, loading && styles.optionTextDisabled]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} disabled={loading}>
            <Text style={[styles.optionText, loading && styles.optionTextDisabled]}>
              Create New Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.white,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: tailwindColors.neutral[600],
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: tailwindColors.neutral[50],
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
    gap: 16,
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
    minHeight: 50,
    justifyContent: 'center',
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
  inputError: {
    borderColor: tailwindColors.red[500],
  },
  errorText: {
    color: tailwindColors.red[500],
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
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
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonDisabled: {
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
  optionTextDisabled: {
    color: tailwindColors.neutral[400],
  },
});

export default ProfilePage;