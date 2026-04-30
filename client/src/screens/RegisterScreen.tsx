import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { ErrorMessage, SuccessMessage } from "../components/Messages";
import { validate } from "../utils/validation";
import { storage } from "../utils/storage";

export const RegisterScreen: React.FC = () => {
  const router = useRouter();
  const { register, isLoading, error, setError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async () => {
    console.log("handleRegister called", { email, firstName, lastName });
    const validation = validate.register({
      email,
      password,
      passwordConfirm,
    });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    try {
      await register(email, password);
      setSuccessMessage("Account created successfully! Please sign in.");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("register failed", err);
      const msg = err?.response?.data?.message || err?.message || String(err);
      setError(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join us today</Text>
        </View>

        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {successMessage && <SuccessMessage message={successMessage} />}

        <View style={styles.form}>
          <InputField
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={validationErrors.email}
          />

          <InputField
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={validationErrors.password}
          />

          <Text style={styles.passwordHint}>
            At least 8 characters, 1 uppercase, 1 number, 1 special character
          </Text>

          <InputField
            label="Confirm Password"
            placeholder="Confirm your password"
            value={passwordConfirm}
            onChangeText={setPasswordConfirm}
            secureTextEntry
            error={validationErrors.passwordConfirm}
          />

          <Button
            title={isLoading ? "" : "Create Account"}
            onPress={handleRegister}
            loading={isLoading}
            disabled={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  form: {
    width: "100%",
  },
  passwordHint: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
    marginTop: -8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#666",
  },
  link: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});
