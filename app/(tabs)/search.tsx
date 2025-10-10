import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { tailwindColors } from "@/theme/colors";
import { fonts } from "@/lib/const";

const search = () => {
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const handleSearchChange = async (query: string) => {
    setIsSearchLoading(true);
    console.log("Searching for:", query);

    // fake async delay (simulate API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSearchLoading(false);
    console.log("Search finished");
  };
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.search_container}>
        <SearchBar
          placeholder="Search for anything..."
          onSearch={handleSearchChange}
          loading={isSearchLoading}
          containerStyle={styles.search_wrapper}
          inputStyle={styles.search_input}
          autoFocus={true}
        />
      </View>
    </ScrollView>
  );
};

export default search;

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
  search_input: {    fontFamily:fonts["Montserrat-Medium"],fontSize:14
  },
});
