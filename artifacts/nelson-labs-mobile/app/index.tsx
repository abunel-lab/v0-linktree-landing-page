import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Platform,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { ProfileHeader } from "@/components/ProfileHeader";
import { SocialIcons } from "@/components/SocialIcons";
import { FeaturedCard } from "@/components/FeaturedCard";
import { ContactSection } from "@/components/ContactSection";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: settings, isLoading, refetch, isRefetching } = useSiteSettings();
  const scrollY = useRef(new Animated.Value(0)).current;

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.card + "80", colors.background, colors.background]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        pointerEvents="none"
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        <View style={styles.inner}>
          <ProfileHeader
            displayName={settings?.display_name ?? "Nelson_Labs"}
            bio={settings?.bio ?? "Building the future of trading"}
            profileImageUrl={settings?.profile_image_url}
            loading={isLoading}
          />

          <SocialIcons
            socialX={settings?.social_x}
            socialYoutube={settings?.social_youtube}
            socialTiktok={settings?.social_tiktok}
            socialWebsite={settings?.social_website}
            socialWhatsapp={settings?.social_whatsapp}
            socialTelegram={settings?.social_telegram}
          />

          <FeaturedCard
            title={settings?.featured_title ?? "SMC TERMINAL"}
            description={
              settings?.featured_description ??
              "Advanced Smart Money Concepts trading terminal."
            }
            url={settings?.featured_url ?? "#"}
            imageUrl={settings?.featured_image_url}
            loading={isLoading}
          />

          <ContactSection
            whatsappNumber={settings?.whatsapp_number}
            socialTelegram={settings?.social_telegram}
            displayName={settings?.display_name ?? "Nelson_Labs"}
          />

          <Text style={[styles.footer, { color: colors.mutedForeground }]}>
            Powered by passion
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  inner: {
    gap: 28,
    alignItems: "stretch",
  },
  footer: {
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    opacity: 0.6,
  },
});
