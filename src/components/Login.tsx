import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useAuth } from "../contexts/AuthContext";
import { Bird, Loader2, User, Wrench, Sprout } from "lucide-react-native";
import { useToast } from "../hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"grower" | "technician" | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

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
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Bird size={32} color="#2d7a4f" />
          </View>
          <Text style={styles.title}>Flockmate</Text>
          <Text style={styles.subtitle}>Poultry Monitoring System</Text>
        </View>

        <View style={styles.card}>
          {isSignUp ? (
            <>
              <Text style={styles.formTitle}>Create Account</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  textContentType="name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="newPassword"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>I am a:</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity
                    style={[styles.roleButton, role === "grower" && styles.roleButtonSelected]}
                    onPress={() => setRole("grower")}
                  >
                    <Sprout size={20} color={role === "grower" ? "#fff" : "#2d7a4f"} />
                    <Text style={[styles.roleText, role === "grower" && styles.roleTextSelected]}>Grower</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.roleButton, role === "technician" && styles.roleButtonSelected]}
                    onPress={() => setRole("technician")}
                  >
                    <Wrench size={20} color={role === "technician" ? "#fff" : "#2d7a4f"} />
                    <Text style={[styles.roleText, role === "technician" && styles.roleTextSelected]}>Technician</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
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
              <Text style={styles.formTitle}>Sign In</Text>
              
              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="your.email@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="password"
                />
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
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
            style={styles.switchModeButton}
            onPress={toggleMode}
          >
            <Text style={styles.switchModeText}>
              {isSignUp 
                ? "Already have an account? Sign In" 
                : "Don't have an account? Create One"}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footerText}>
          Secure access for poultry technicians and farmers
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f9f4",
    padding: 16,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "rgba(45, 122, 79, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  roleContainer: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderWidth: 1,
    borderColor: "#2d7a4f",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  roleButtonSelected: {
    backgroundColor: "#2d7a4f",
  },
  roleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d7a4f",
    marginLeft: 8,
  },
  roleTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#2d7a4f",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  switchModeButton: {
    marginTop: 16,
    padding: 12,
    alignItems: "center",
  },
  switchModeText: {
    color: "#2d7a4f",
    fontSize: 16,
    fontWeight: "500",
  },
  footerText: {
    textAlign: "center",
    fontSize: 14,
    color: "#666",
    marginTop: 24,
  },
});