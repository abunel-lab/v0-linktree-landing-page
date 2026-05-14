import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useColors } from "@/hooks/useColors";
import type { SiteSettings } from "@/lib/types";

type Tab = "profile" | "social" | "featured";

export default function AdminDashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  const styles = makeStyles(colors);

  useEffect(() => {
    checkSessionAndLoad();
  }, []);

  const checkSessionAndLoad = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.replace("/admin/login" as never);
      return;
    }
    setUserEmail(session.user.email ?? null);
    await loadSettings();
  };

  const loadSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();
    setLoading(false);
    if (error) {
      Alert.alert("Error", "Could not load settings: " + error.message);
      return;
    }
    setSettings(data as SiteSettings);
  };

  const updateField = (field: keyof SiteSettings, value: string) => {
    setSettings((prev) => (prev ? { ...prev, [field]: value || null } : prev));
  };

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    const { error } = await supabase
      .from("site_settings")
      .update({
        display_name: settings.display_name,
        bio: settings.bio,
        profile_image_url: settings.profile_image_url,
        featured_title: settings.featured_title,
        featured_description: settings.featured_description,
        featured_url: settings.featured_url,
        featured_image_url: settings.featured_image_url,
        social_x: settings.social_x,
        social_youtube: settings.social_youtube,
        social_tiktok: settings.social_tiktok,
        social_website: settings.social_website,
        social_whatsapp: settings.social_whatsapp,
        social_telegram: settings.social_telegram,
        whatsapp_number: settings.whatsapp_number,
      })
      .eq("id", settings.id);

    setSaving(false);

    if (error) {
      Alert.alert("Error", "Failed to save: " + error.message);
    } else {
      Alert.alert("Saved", "Your changes have been saved.");
    }
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/admin/login" as never);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "social", label: "Social" },
    { id: "featured", label: "Featured" },
  ];

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.card,
            borderBottomColor: colors.border,
            paddingTop: topPad + 12,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { color: colors.foreground }]}>
              Admin Panel
            </Text>
            {userEmail ? (
              <Text
                style={[styles.headerEmail, { color: colors.mutedForeground }]}
              >
                {userEmail}
              </Text>
            ) : null}
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={[styles.logoutText, { color: colors.destructive }]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    activeTab === tab.id ? colors.accent : colors.muted,
                },
              ]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab.id
                        ? colors.accentForeground
                        : colors.mutedForeground,
                    fontFamily:
                      activeTab === tab.id
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: bottomPad + 100 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "profile" && settings && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Profile Settings
            </Text>

            <Field
              label="Display Name"
              value={settings.display_name}
              onChangeText={(v) => updateField("display_name", v)}
              placeholder="Your display name"
              colors={colors}
            />

            <Field
              label="Bio / Tagline"
              value={settings.bio}
              onChangeText={(v) => updateField("bio", v)}
              placeholder="Your tagline"
              colors={colors}
            />

            <Field
              label="Profile Image URL"
              value={settings.profile_image_url ?? ""}
              onChangeText={(v) => updateField("profile_image_url", v)}
              placeholder="https://example.com/photo.jpg"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="WhatsApp Number (for contact)"
              value={settings.whatsapp_number ?? ""}
              onChangeText={(v) => updateField("whatsapp_number", v)}
              placeholder="256709331135 (no + sign)"
              keyboardType="phone-pad"
              colors={colors}
              hint="Country code + number, no spaces or special characters"
            />
          </View>
        )}

        {activeTab === "social" && settings && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Social Media Links
            </Text>
            <Text
              style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}
            >
              Leave blank to hide a link.
            </Text>

            <Field
              label="X (Twitter)"
              value={settings.social_x ?? ""}
              onChangeText={(v) => updateField("social_x", v)}
              placeholder="https://x.com/yourusername"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="YouTube"
              value={settings.social_youtube ?? ""}
              onChangeText={(v) => updateField("social_youtube", v)}
              placeholder="https://youtube.com/@yourchannel"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="TikTok"
              value={settings.social_tiktok ?? ""}
              onChangeText={(v) => updateField("social_tiktok", v)}
              placeholder="https://tiktok.com/@yourusername"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="Website"
              value={settings.social_website ?? ""}
              onChangeText={(v) => updateField("social_website", v)}
              placeholder="https://yourwebsite.com"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="WhatsApp"
              value={settings.social_whatsapp ?? ""}
              onChangeText={(v) => updateField("social_whatsapp", v)}
              placeholder="+256709331135"
              keyboardType="phone-pad"
              colors={colors}
            />

            <Field
              label="Telegram"
              value={settings.social_telegram ?? ""}
              onChangeText={(v) => updateField("social_telegram", v)}
              placeholder="https://t.me/yourusername"
              keyboardType="url"
              colors={colors}
            />
          </View>
        )}

        {activeTab === "featured" && settings && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Featured Card
            </Text>

            <Field
              label="Title"
              value={settings.featured_title}
              onChangeText={(v) => updateField("featured_title", v)}
              placeholder="Your Product Name"
              colors={colors}
            />

            <Field
              label="Description"
              value={settings.featured_description}
              onChangeText={(v) => updateField("featured_description", v)}
              placeholder="Describe your product or service..."
              multiline
              numberOfLines={3}
              colors={colors}
            />

            <Field
              label="Link URL"
              value={settings.featured_url}
              onChangeText={(v) => updateField("featured_url", v)}
              placeholder="https://yourproduct.com"
              keyboardType="url"
              colors={colors}
            />

            <Field
              label="Background Image URL (optional)"
              value={settings.featured_image_url ?? ""}
              onChangeText={(v) => updateField("featured_image_url", v)}
              placeholder="https://example.com/product-image.jpg"
              keyboardType="url"
              colors={colors}
              hint="Leave blank to use the default gradient background"
            />
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: bottomPad + 12,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.accent },
            saving && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color={colors.accentForeground} />
          ) : (
            <Text
              style={[styles.saveButtonText, { color: colors.accentForeground }]}
            >
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "url" | "phone-pad";
  multiline?: boolean;
  numberOfLines?: number;
  hint?: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  multiline = false,
  numberOfLines,
  hint,
  colors,
}: FieldProps) {
  return (
    <View style={fieldStyles.wrapper}>
      <Text style={[fieldStyles.label, { color: colors.foreground }]}>
        {label}
      </Text>
      <TextInput
        style={[
          fieldStyles.input,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
            color: colors.foreground,
          },
          multiline && {
            height: (numberOfLines ?? 3) * 24 + 24,
            textAlignVertical: "top",
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {hint ? (
        <Text style={[fieldStyles.hint, { color: colors.mutedForeground }]}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  hint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
});

function makeStyles(colors: ReturnType<typeof import("@/hooks/useColors").useColors>) {
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      borderBottomWidth: 1,
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    headerRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
    },
    headerEmail: {
      fontSize: 12,
      fontFamily: "Inter_400Regular",
      marginTop: 2,
    },
    logoutButton: {
      paddingVertical: 6,
      paddingHorizontal: 12,
    },
    logoutText: {
      fontSize: 14,
      fontFamily: "Inter_500Medium",
    },
    tabRow: {
      flexDirection: "row",
      gap: 8,
    },
    tab: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: "center",
    },
    tabText: {
      fontSize: 13,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 24,
    },
    section: {
      gap: 0,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: "Inter_700Bold",
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 13,
      fontFamily: "Inter_400Regular",
      marginBottom: 16,
    },
    footer: {
      borderTopWidth: 1,
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    saveButton: {
      borderRadius: 10,
      paddingVertical: 14,
      alignItems: "center",
    },
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveButtonText: {
      fontSize: 16,
      fontFamily: "Inter_600SemiBold",
    },
  });
}
