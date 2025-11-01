import {
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import React from "react";
import AppText from "@/components/app/share/AppText";
import {
  FONT_SIZE_EXTRA_SMALL,
  FONT_SIZE_MEDUIME,
  FONT_SIZE_SMALL,
} from "@/theme/globals";
import { categories, fonts } from "@/lib/const";
import { appColors, tailwindColors } from "@/theme/colors";
import { useRouter } from "expo-router";

const Categories = () => {
  const { width } = useWindowDimensions();
  const router = useRouter();
  // Determine number of columns based on screen width
  let numColumns = 2;
  if (width >= 800) numColumns = 4;
  else if (width <= 350) numColumns = 1;

  const containerPadding = 10;
  const cardMargin = 5;
  const cardWidth =
    (width - containerPadding * 2 - cardMargin * 2 * numColumns) / numColumns;

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <AppText style={styles.title}>Categories</AppText>
      </View>
      <View style={styles.cards_container}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { width: cardWidth, margin: cardMargin }]}
            onPress={() => {
              router.push(`/(tabs)/(home)/${item.href}`);
            }}
          >
            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <AppText
                style={styles.cardText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </AppText>
              <AppText
                style={styles.cardDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.name + " "}
                {item.name} {item.name}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  title_container: {},
  title: {
    fontSize: FONT_SIZE_MEDUIME,
    fontFamily: fonts["Montserrat-SemiBold"],
  },
  cards_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  card: {
    flexDirection: "row",
    backgroundColor: appColors.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 10,
    borderWidth: 2,
    borderColor: tailwindColors.neutral[100],
  },
  imageContainer: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardText: {
    fontSize: FONT_SIZE_SMALL,
    fontFamily: fonts["Montserrat-Medium"],
  },
  cardDescription: {
    fontSize: FONT_SIZE_EXTRA_SMALL,
    fontFamily: fonts["Montserrat-Light"],
  },
});
