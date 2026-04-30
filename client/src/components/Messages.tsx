import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="alert-circle" size={20} color="#ff6b6b" />
        <Text style={styles.text}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={20} color="#ff6b6b" />
        </TouchableOpacity>
      )}
    </View>
  );
};

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  onDismiss,
}) => {
  if (!message) return null;

  return (
    <View style={styles.successContainer}>
      <View style={styles.content}>
        <Ionicons name="checkmark-circle" size={20} color="#51cf66" />
        <Text style={[styles.text, styles.successText]}>{message}</Text>
      </View>
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss}>
          <Ionicons name="close" size={20} color="#51cf66" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff5f5",
    borderLeftWidth: 4,
    borderLeftColor: "#ff6b6b",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  successContainer: {
    backgroundColor: "#f1fdf0",
    borderLeftWidth: 4,
    borderLeftColor: "#51cf66",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  text: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#ff6b6b",
  },
  successText: {
    color: "#51cf66",
  },
});
