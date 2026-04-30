import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/authStore";
import { InputField } from "../components/InputField";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { ErrorMessage, SuccessMessage } from "../components/Messages";
import { validate } from "../utils/validation";

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user, isLoading, error, setError, updateProfile, changePassword } =
    useAuthStore();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [successMessage, setSuccessMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    setFirstName(user?.firstName || "");
    setLastName(user?.lastName || "");
  }, [user]);

  const handleUpdateProfile = async () => {
    const validation = validate.updateProfile({ firstName, lastName });

    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    try {
      await updateProfile(firstName, lastName);
      setSuccessMessage("Profile updated successfully!");
      setEditMode(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(error);
    }
  };

  const handleChangePassword = async () => {
    const validation = validate.changePassword({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validation.valid) {
      setPasswordErrors(validation.errors);
      return;
    }

    setPasswordErrors({});

    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError(error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {error && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {successMessage && <SuccessMessage message={successMessage} />}

          <Card title="Profile Information">
            <View style={styles.profileSection}>
              {editMode ? (
                <>
                  <InputField
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={validationErrors.firstName}
                  />

                  <InputField
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    error={validationErrors.lastName}
                  />

                  <View style={styles.buttonGroup}>
                    <Button
                      title={isLoading ? "" : "Save Changes"}
                      onPress={handleUpdateProfile}
                      loading={isLoading}
                      disabled={isLoading}
                    />
                    <Button
                      title="Cancel"
                      onPress={() => setEditMode(false)}
                      variant="secondary"
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Email</Text>
                    <Text style={styles.value}>{user?.email}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>First Name</Text>
                    <Text style={styles.value}>
                      {user?.firstName || "Not set"}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.label}>Last Name</Text>
                    <Text style={styles.value}>
                      {user?.lastName || "Not set"}
                    </Text>
                  </View>

                  <Button
                    title="Edit Profile"
                    onPress={() => setEditMode(true)}
                    variant="secondary"
                  />
                </>
              )}
            </View>
          </Card>

          {!showPasswordForm && (
            <View style={styles.section}>
              <Button
                title="Change Password"
                onPress={() => setShowPasswordForm(true)}
                variant="secondary"
              />
            </View>
          )}

          {showPasswordForm && (
            <Card title="Change Password">
              <InputField
                label="Current Password"
                placeholder="Enter current password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry
                error={passwordErrors.currentPassword}
              />

              <InputField
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                error={passwordErrors.newPassword}
              />

              <Text style={styles.passwordHint}>
                At least 8 characters, 1 uppercase, 1 number, 1 special
                character
              </Text>

              <InputField
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={passwordErrors.confirmPassword}
              />

              <View style={styles.buttonGroup}>
                <Button
                  title={isLoading ? "" : "Update Password"}
                  onPress={handleChangePassword}
                  loading={isLoading}
                  disabled={isLoading}
                />
                <Button
                  title="Cancel"
                  onPress={() => setShowPasswordForm(false)}
                  variant="secondary"
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  profileSection: {
    marginTop: 8,
  },
  section: {
    marginTop: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
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
  buttonGroup: {
    gap: 12,
    marginTop: 16,
  },
  passwordHint: {
    fontSize: 12,
    color: "#999",
    marginBottom: 16,
    marginTop: -8,
  },
});
