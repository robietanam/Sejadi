import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { ErrorMessage, SuccessMessage } from "../components/Messages";
import { Ionicons } from "@expo/vector-icons";

export const SessionsScreen: React.FC = () => {
  const {
    sessions,
    isLoading,
    error,
    setError,
    loadSessions,
    revokeSession,
    revokeAllSessions,
  } = useAuthStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");

  useEffect(() => {
    loadSessions();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadSessions();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(sessionId);
      setSuccessMessage("Device logged out successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(error);
    }
  };

  const handleRevokeAll = async () => {
    try {
      await revokeAllSessions();
      setSuccessMessage("All devices logged out successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderSessionItem = ({ item }: { item: any }) => (
    <Card>
      <View style={styles.sessionHeader}>
        <View style={styles.deviceInfo}>
          <Ionicons name="phone-portrait" size={24} color="#007AFF" />
          <View style={styles.deviceText}>
            <Text style={styles.deviceName}>{item.deviceName}</Text>
            <Text style={styles.deviceIp}>{item.ipAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sessionDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Created</Text>
          <Text style={styles.detailValue}>{formatDate(item.createdAt)}</Text>
        </View>
        {item.lastActivityAt && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Active</Text>
            <Text style={styles.detailValue}>
              {formatDate(item.lastActivityAt)}
            </Text>
          </View>
        )}
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Expires</Text>
          <Text style={styles.detailValue}>{formatDate(item.expiresAt)}</Text>
        </View>
      </View>

      <Button
        title="Logout from This Device"
        onPress={() => handleRevokeSession(item.id)}
        variant="danger"
        style={styles.revokeButton}
      />
    </Card>
  );

  if (isLoading && sessions.length === 0) {
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
      <View style={styles.content}>
        {error && (
          <ErrorMessage message={error} onDismiss={() => setError(null)} />
        )}

        {successMessage && <SuccessMessage message={successMessage} />}

        <View style={styles.header}>
          <Text style={styles.title}>Active Sessions</Text>
          <Text style={styles.subtitle}>
            {sessions.length} device{sessions.length !== 1 ? "s" : ""} logged in
          </Text>
        </View>

        {sessions.length > 0 ? (
          <>
            <FlatList
              data={sessions}
              renderItem={renderSessionItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />

            {sessions.length > 1 && (
              <Button
                title="Logout from All Devices"
                onPress={handleRevokeAll}
                variant="danger"
                style={styles.logoutAllButton}
              />
            )}
          </>
        ) : (
          <Card>
            <Text style={styles.noSessions}>No active sessions</Text>
          </Card>
        )}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },
  sessionHeader: {
    marginBottom: 16,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceText: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deviceIp: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  sessionDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 13,
    color: "#666",
  },
  detailValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
  revokeButton: {
    marginTop: 12,
  },
  logoutAllButton: {
    marginTop: 16,
  },
  noSessions: {
    textAlign: "center",
    fontSize: 16,
    color: "#999",
    paddingVertical: 20,
  },
});
