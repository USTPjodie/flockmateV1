import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Bird, Loader2, User, Wrench, Sprout, Eye, EyeOff } from "lucide-react-native";
import { useToast } from "../hooks/use-toast";
import { useTheme } from "../contexts/ThemeProvider";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"grower" | "technician" | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const handleSignIn = async () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !fullName || !role) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select a role",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await signUp(email, password, fullName, role);
      toast({
        title: "Account Created",
        description: "Please check your email to confirm your account",
      });
      // Switch to login view after signup
      setIsSignUp(false);
    } catch (error: any) {
      toast({
        title: "Signup Failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    // Reset form when toggling
    setEmail("");
    setPassword("");
    setFullName("");
    setRole(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '20' }]}>
            <Bird size={32} color={theme.primary} />
          </View>
          <Text style={[styles.title, { color: theme.text }]}>Flockmate</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Poultry Monitoring System</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          {isSignUp ? (
            <>
              <Text style={[styles.formTitle, { color: theme.text }]}>Create Account</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Full Name</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.textSecondary + '40'
                  }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.textSecondary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.textSecondary + '40'
                  }]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, { 
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.textSecondary + '40'
                    }]}
                    placeholder="Create a password"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="newPassword"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye size={20} color={theme.textSecondary} />
                    ) : (
                      <EyeOff size={20} color={theme.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>I am a:</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.roleButton, role === "grower" && styles.roleButtonSelected, { 
                      backgroundColor: role === "grower" ? theme.primary : theme.background,
                      borderColor: theme.textSecondary + '40'
                    }]}
                    onPress={() => setRole("grower")}
                  >
                    <Sprout size={20} color={role === "grower" ? "#fff" : theme.primary} />
                    <Text style={[styles.roleText, role === "grower" && styles.roleTextSelected, { 
                      color: role === "grower" ? "#fff" : theme.text 
                    }]}>Grower</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.roleButton, role === "technician" && styles.roleButtonSelected, { 
                      backgroundColor: role === "technician" ? theme.primary : theme.background,
                      borderColor: theme.textSecondary + '40'
                    }]}
                    onPress={() => setRole("technician")}
                  >
                    <Wrench size={20} color={role === "technician" ? "#fff" : theme.primary} />
                    <Text style={[styles.roleText, role === "technician" && styles.roleTextSelected, { 
                      color: role === "technician" ? "#fff" : theme.text 
                    }]}>Technician</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: theme.primary }]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <Loader2 size={16} color="#fff" />
                    <Text style={styles.buttonText}>Creating Account...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Create Account</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[styles.formTitle, { color: theme.text }]}>Sign In</Text>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Email</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.textSecondary + '40'
                  }]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={theme.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: theme.text }]}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[styles.passwordInput, { 
                      backgroundColor: theme.background,
                      color: theme.text,
                      borderColor: theme.textSecondary + '40'
                    }]}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                  />
                  <TouchableOpacity 
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <Eye size={20} color={theme.textSecondary} />
                    ) : (
                      <EyeOff size={20} color={theme.textSecondary} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled, { backgroundColor: theme.primary }]}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <View style={styles.buttonContent}>
                    <Loader2 size={16} color="#fff" />
                    <Text style={styles.buttonText}>Signing In...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleMode}
          >
            <Text style={[styles.toggleText, { color: theme.primary }]}>
              {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  card: {
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    paddingRight: 48,
    fontSize: 16,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    padding: 4,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    gap: 8,
  },
  roleButtonSelected: {
    borderWidth: 0,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  roleTextSelected: {
    color: '#fff',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});