import React from "react";
import { View, Text, Pressable, StyleSheet, Linking } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useColors } from "@/hooks/useColors";

interface Props {
  whatsappNumber: string | null | undefined;
  socialTelegram: string | null | undefined;
  displayName: string;
}

export function ContactSection({ whatsappNumber, socialTelegram, displayName }: Props) {
  const colors = useColors();

  const openWhatsApp = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const number = whatsappNumber?.replace(/\D/g, "");
    const msg = encodeURIComponent(`Hi ${displayName}!`);
    const url = `whatsapp://send?phone=${number}&text=${msg}`;
    const fallback = `https://wa.me/${number}?text=${msg}`;
    const supported = await Linking.canOpenURL(url);
    await Linking.openURL(supported ? url : fallback);
  };

  const openTelegram = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (socialTelegram) {
      await Linking.openURL(socialTelegram);
    }
  };

  const hasWhatsApp = !!whatsappNumber;
  const hasTelegram = !!socialTelegram;

  if (!hasWhatsApp && !hasTelegram) return null;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.mutedForeground }]}>
        Get in touch
      </Text>
      <View style={styles.buttons}>
        {hasWhatsApp && (
          <Pressable
            onPress={openWhatsApp}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: "#25D366" + "18",
                borderColor: "#25D366" + "60",
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <FontAwesome5 name="whatsapp" size={20} color="#25D366" />
            <Text style={[styles.buttonText, { color: "#25D366" }]}>
              WhatsApp
            </Text>
          </Pressable>
        )}
        {hasTelegram && (
          <Pressable
            onPress={openTelegram}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: "#2AABEE" + "18",
                borderColor: "#2AABEE" + "60",
                opacity: pressed ? 0.7 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
          >
            <FontAwesome5 name="telegram" size={20} color="#2AABEE" />
            <Text style={[styles.buttonText, { color: "#2AABEE" }]}>
              Telegram
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
