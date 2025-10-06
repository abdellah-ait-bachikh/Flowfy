import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { fonts, tailwindColors } from "@/lib/const";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import RestaurantSlider from "@/components/screens/home/RestorantSlider";
import CategoriesSlider from "@/components/screens/home/CategoriesSlider";
import Skeleton from "@/components/ui/Skeleton";
import loadingSCreen from "@/assets/animations/loading_animation.gif";
const index = () => {
  const random = Math.random();
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return isLoading ? (
    <View style={styles.loading_container}>
      <Image source={loadingSCreen} style={styles.loading_gif} />
    </View>
  ) : (
    <ScrollView style={styles.scroll_container}>
      <View style={styles.container}>
        <View style={styles.search_container}>
          <TouchableOpacity
            style={styles.search_bg}
            onPress={() => {
              router.push("/search");
            }}
          >
            <TextInput
              style={styles.search_btn_input}
              placeholder={t("screens.(tabs).index.btn_search_placehaulder")}
              readOnly
            />
          </TouchableOpacity>
        </View>

        <CategoriesSlider />
        <RestaurantSlider />
      </View>
    </ScrollView>
  );
};

export default index;

const styles = StyleSheet.create({
  scroll_container: { flex: 1 },
  container: { flex: 1, gap: 20 },
  search_container: { paddingHorizontal: 15 },
  search_bg: { backgroundColor: tailwindColors.gray["50"], borderRadius: 10 },
  search_btn_input: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontFamily: fonts["Montserrat-SemiBold"],
  },
  loading_container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  loading_gif: {
    width: 80,
    height: 80,
  },
});
