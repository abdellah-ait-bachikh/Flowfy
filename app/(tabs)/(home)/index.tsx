import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { appColors, tailwindColors } from "@/theme/colors";
import { useRouter } from "expo-router";
import Categories from "./.home/Categories";
import RestaurantSlider from "./.home/RestorantSlider";
import RankingFood from "./.home/RankingFood";
import { fonts } from "@/lib/const";
import { Spinner } from "@/components/ui/spinner";
import AppText from "@/components/app/share/AppText";
import ScreenLoading from "@/components/app/share/ScreenLoading";
const index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function waitLoading() {
      setLoading(true);
      await new Promise((res) => setTimeout(res, 1000));
      setLoading(false);
    }
    waitLoading();
  }, []);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        
      </View>
      {loading ? (
        <ScreenLoading />
      ) : (
        <>
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
          <RestaurantSlider />
          <RankingFood />
        </>
      )}
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Apply flex here
  },
  content: {
    paddingBottom: 40, // Add bottom space so last item isn't cut off
    position:"relative"
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
