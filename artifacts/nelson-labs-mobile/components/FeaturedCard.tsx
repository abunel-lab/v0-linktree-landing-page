import React from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Linking,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface Props {
  title: string;
  description: string;
  url: string;
  imageUrl: string | null | undefined;
  loading?: boolean;
}

export function FeaturedCard({ title, description, url, imageUrl, loading }: Props) {
  const colors = useColors();

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={[styles.skeletonImage, { backgroundColor: colors.muted }]} />
        <View style={styles.content}>
          <View style={[styles.skeletonTitle, { backgroundColor: colors.muted }]} />
          <View style={[styles.skeletonDesc, { backgroundColor: colors.muted }]} />
          <View style={[styles.skeletonDescShort, { backgroundColor: colors.muted }]} />
        </View>
      </View>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.primary + "50",
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <LinearGradient
          colors={[colors.primary + "30", colors.secondary + "20"]}
          style={styles.imagePlaceholder}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Feather name="terminal" size={32} color={colors.primary} />
        </LinearGradient>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.badgeText, { color: colors.primary }]}>Featured</Text>
          </View>
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>{title}</Text>
        <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={3}>
          {description}
        </Text>
        <View style={[styles.cta, { borderTopColor: colors.border }]}>
          <Text style={[styles.ctaText, { color: colors.primary }]}>Explore</Text>
          <Feather name="arrow-right" size={16} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  imagePlaceholder: {
    width: "100%",
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  header: {
    flexDirection: "row",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 20,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 12,
    marginTop: 4,
    borderTopWidth: 1,
  },
  ctaText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  skeletonImage: {
    width: "100%",
    height: 140,
  },
  skeletonTitle: {
    height: 20,
    width: "70%",
    borderRadius: 6,
    marginTop: 4,
  },
  skeletonDesc: {
    height: 14,
    width: "100%",
    borderRadius: 6,
  },
  skeletonDescShort: {
    height: 14,
    width: "60%",
    borderRadius: 6,
  },
});
