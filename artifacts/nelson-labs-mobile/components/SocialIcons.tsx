import React from "react";
import { View, Pressable, StyleSheet, Linking } from "react-native";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface Props {
  socialX: string | null | undefined;
  socialYoutube: string | null | undefined;
  socialTiktok: string | null | undefined;
  socialWebsite: string | null | undefined;
  socialWhatsapp: string | null | undefined;
  socialTelegram: string | null | undefined;
}

interface SocialLink {
  key: string;
  url: string | null | undefined;
  icon: React.ReactNode;
}

export function SocialIcons({
  socialX,
  socialYoutube,
  socialTiktok,
  socialWebsite,
  socialWhatsapp,
  socialTelegram,
}: Props) {
  const colors = useColors();

  const handlePress = async (url: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const links: SocialLink[] = [
    {
      key: "x",
      url: socialX,
      icon: <FontAwesome5 name="twitter" size={20} color={colors.foreground} />,
    },
    {
      key: "youtube",
      url: socialYoutube,
      icon: <FontAwesome5 name="youtube" size={20} color={colors.foreground} />,
    },
    {
      key: "tiktok",
      url: socialTiktok,
      icon: <FontAwesome5 name="tiktok" size={20} color={colors.foreground} />,
    },
    {
      key: "website",
      url: socialWebsite,
      icon: <Feather name="globe" size={20} color={colors.foreground} />,
    },
    {
      key: "whatsapp",
      url: socialWhatsapp,
      icon: <FontAwesome5 name="whatsapp" size={20} color={colors.foreground} />,
    },
    {
      key: "telegram",
      url: socialTelegram,
      icon: <FontAwesome5 name="telegram" size={20} color={colors.foreground} />,
    },
  ].filter((l) => !!l.url);

  if (links.length === 0) return null;

  return (
    <View style={styles.container}>
      {links.map((link) => (
        <Pressable
          key={link.key}
          onPress={() => link.url && handlePress(link.url)}
          style={({ pressed }) => [
            styles.iconButton,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
              transform: [{ scale: pressed ? 0.92 : 1 }],
            },
          ]}
          accessibilityLabel={link.key}
        >
          {link.icon}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
