import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppText from "@/components/ui/AppText";
import { appColors, categories, fonts, tailwindColors } from "@/const";
import defaultRestauranLogo from "@/assets/images/icons/default_restaurant.png";
import Carousel from "react-native-reanimated-carousel";
import { useSharedValue } from "react-native-reanimated";
import { useRouter } from "expo-router";
const { width } = Dimensions.get("screen");
const CategorySlider = ({ t }: { t: (text: string) => string }) => {
  const progress = useSharedValue<number>(0);
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.header_title}>
          {t("screens.(tabs).index.horizontal_categories_scroll.title")}
        </AppText>
      </View>
      <View style={styles.curousel_container}>
        <Carousel
          width={width}
          height={150}
          pagingEnabled
          snapEnabled
          mode="parallax"
          containerStyle={{ width: "100%", height: 150 }}
          onProgressChange={progress}
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: 57,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.item, { width: width * 0.78 }]}
              onPress={() => {
                router.push(`/(tabs)/home/${item.href}`);
              }}
            >
              <Image
                source={item.image || defaultRestauranLogo}
                style={styles.image}
              />
              <View style={styles.card_body}>
                <AppText style={styles.title}>
                  {t(
                    `screens.(tabs).index.horizontal_categories_scroll.name.${item.name}`
                  )}
                </AppText>
                <AppText style={styles.description}>
                  {t(
                    `screens.(tabs).index.horizontal_categories_scroll.description.${item.name}`
                  )}
                </AppText>
              </View>
            </TouchableOpacity>
          )}
          data={categories}
        />
      </View>
    </View>
  );
};

export default CategorySlider;

const styles = StyleSheet.create({
  container: { gap: 5 },
  header: { alignItems: "center" },
  header_title: { fontSize: 20, fontFamily: fonts["Montserrat-SemiBold"] },
  curousel_container: { height: 100 },
  item: {
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
    borderRadius: 20,
    flexDirection: "row",
    backgroundColor: appColors.white,
    borderWidth: 2,
    borderColor: tailwindColors.neutral[100],
    overflow: "hidden",
    height: 100,
    padding: 10,
    marginLeft: 10,

    // elevation: 6,
    // // ✅ iOS shadow
    // shadowColor: tailwindColors.amber[400],
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.15,
    // shadowRadius: 20,
  },
  image: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 15,
  },
  card_body: { flex: 1, flexDirection: "column", alignItems: "flex-start" },
  title: {
    fontSize: 20,
    fontFamily: fonts["Montserrat-Medium"],
  },
  description: { fontSize: 13, color: tailwindColors.zinc[400] },
});
