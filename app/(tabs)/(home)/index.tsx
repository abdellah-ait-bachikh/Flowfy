import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { SearchBar } from "@/components/ui/searchbar";
import { appColors, tailwindColors } from "@/theme/colors";
import { useFocusEffect, useRouter } from "expo-router";
import Categories from "../../../components/app/screens/home/Categories";
import RestaurantSlider from "../../../components/app/screens/home/RestorantSlider";
import RankingFood from "../../../components/app/screens/home/RankingFood";
import { fonts } from "@/lib/const";

import ScreenLoading from "@/components/app/share/ScreenLoading";
import { useTranslation } from "react-i18next";
const index = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      console.log("----------------------screen In-------------------------");

      async function waitLoading() {
        setLoading(true);
        await new Promise((res) => setTimeout(res, 1000));
        setLoading(false);
      }
      waitLoading();
      return () => {
        console.log(
          "----------------------screen OUT-------------------------"
        );
      };
    }, [])
  );
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View></View>
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
              placeholder={t("screens.(tabs).index.btn_search_placeholder")}
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
    position: "relative",
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
