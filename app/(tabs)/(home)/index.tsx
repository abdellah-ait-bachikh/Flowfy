import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { tailwindColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import Categories from "./.home/Categories";
import { fonts } from "@/lib/const";
const index = () => {
  const router = useRouter();
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <TouchableOpacity
        style={styles.search_container}
        onPress={() => {
          router.push("/(tabs)/search");
        }}
      >
        <SearchBar
          placeholder="Search for anything..."
          loading={false}
          containerStyle={styles.search_wrapper}
          inputStyle={styles.search_input}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <Categories />
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  search_container: {
    paddingHorizontal: 10,
  },
  search_wrapper: {
    backgroundColor: tailwindColors.gray[50],
    borderWidth: 2,
    borderColor: tailwindColors.gray[300],
  },
  search_input: {
    fontFamily: fonts["Montserrat-Medium"],
    fontSize: 14,
  },
});
