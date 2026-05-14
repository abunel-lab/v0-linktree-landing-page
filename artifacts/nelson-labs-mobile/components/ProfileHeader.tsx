import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useColors } from "@/hooks/useColors";

interface Props {
  displayName: string;
  bio: string;
  profileImageUrl: string | null | undefined;
  loading?: boolean;
}

export function ProfileHeader({ displayName, bio, profileImageUrl, loading }: Props) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={[styles.avatarWrapper, { borderColor: colors.primary }]}>
        <LinearGradient
          colors={[colors.primary + "40", colors.secondary + "30"]}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : profileImageUrl ? (
          <Image
            source={{ uri: profileImageUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: colors.muted }]}>
            <Text style={[styles.avatarInitial, { color: colors.primary }]}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.textContainer}>
        {loading ? (
          <>
            <View style={[styles.skeletonName, { backgroundColor: colors.muted }]} />
            <View style={[styles.skeletonBio, { backgroundColor: colors.muted }]} />
            <View style={[styles.skeletonBioShort, { backgroundColor: colors.muted }]} />
          </>
        ) : (
          <>
            <Text style={[styles.name, { color: colors.foreground }]}>
              {displayName}
            </Text>
            <Text style={[styles.bio, { color: colors.mutedForeground }]}>
              {bio}
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 16,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  avatarFallback: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: {
    fontSize: 36,
    fontFamily: "Inter_700Bold",
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  bio: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 280,
  },
  skeletonName: {
    width: 160,
    height: 24,
    borderRadius: 6,
  },
  skeletonBio: {
    width: 240,
    height: 14,
    borderRadius: 6,
  },
  skeletonBioShort: {
    width: 180,
    height: 14,
    borderRadius: 6,
  },
});
