import React, { useCallback, useRef } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";

import { fonts, tailwindColors } from "@/lib/const";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const search = () => {
  const { t } = useTranslation();
  const inputRef = useRef<TextInput>(null);
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => {
        clearTimeout(timer);
        inputRef.current?.blur();
      };
    }, [])
  );
  return (
    <ScrollView style={styles.scroll_container}>
      <View style={styles.container}>
        <View style={styles.search_container}>
          <View style={styles.search_bg}>
            <TextInput
              ref={inputRef}
              style={styles.search_btn_input}
              placeholder={t("screens.(tabs).index.btn_search_placehaulder")}
              autoFocus
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default search;

const styles = StyleSheet.create({
  scroll_container: { flex: 1 },
  container: { flex: 1, gap: 15 },
  search_container: { paddingHorizontal: 15 },
  search_bg: { backgroundColor: tailwindColors.gray["50"], borderRadius: 10 },
  search_btn_input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontFamily: fonts["Montserrat-SemiBold"],
  },
});
