import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { ErrorMessage, SuccessMessage } from "../components/Messages";
import { validate } from "../utils/validation";
import { storage } from "../utils/storage";
import * as Crypto from "expo-crypto";

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error, setError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    console.log("handleLogin called", { email });
    const validation = validate.login({ email, password });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    try {
      const bytes = await Crypto.getRandomBytesAsync(16);
      const deviceId = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      await storage.setDeviceId(deviceId);
      await login(email, password, deviceId);
      setSuccessMessage("Login successful!");
      setTimeout(() => {
        router.replace("/(app)/home");
      }, 1500);
    } catch (err: any) {
      // err may be a structured API error { message, data, status } or an AxiosError
      console.error("login failed", err);
      const apiErr = err?.response?.data ?? err;
      const msg = apiErr?.message || err?.message || String(err);
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
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={validationErrors.password}
          />

          <Button
            title={isLoading ? "" : "Sign In"}
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <Text style={styles.link}>Sign Up</Text>
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
    marginBottom: 32,
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
