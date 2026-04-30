import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/Messages";

export const HomeScreen: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, error, setError, loadUser, logout } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadUser();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      setError(error);
    }
  };

  if (isLoading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {error && (
        <ErrorMessage message={error} onDismiss={() => setError(null)} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome!</Text>
          <Text style={styles.userName}>{user?.firstName || user?.email}</Text>
        </View>

        <Card
          title="Profile Information"
          onPress={() => router.push("/(app)/profile")}
          rightIcon
        >
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>
          {user?.firstName && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>First Name</Text>
              <Text style={styles.value}>{user.firstName}</Text>
            </View>
          )}
          {user?.lastName && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Name</Text>
              <Text style={styles.value}>{user.lastName}</Text>
            </View>
          )}
        </Card>

        <Card
          title="Your Devices"
          subtitle="Manage active sessions"
          onPress={() => router.push("/(app)/sessions")}
          rightIcon
        />

        <View style={styles.actions}>
          <Button
            title="Edit Profile"
            onPress={() => router.push("/(app)/profile")}
            variant="secondary"
          />
          <Button title="Logout" onPress={handleLogout} variant="danger" />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: "#999",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  label: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  actions: {
    marginTop: 16,
    gap: 12,
  },
});
