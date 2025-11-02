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
  
  // Responsive column calculation
  const CONTAINER_PADDING = 10;
  const GAP = 10;
  const CARD_WIDTH = 160; // Base card width
  const MAX_COLUMNS = 4;
  
  const availableWidth = width - (CONTAINER_PADDING * 2);
  const possibleColumns = Math.floor(availableWidth / (CARD_WIDTH + GAP));
  const columns = Math.min(Math.max(possibleColumns, 1), MAX_COLUMNS);
  
  // Calculate actual card width to fit perfectly
  const totalGapWidth = (columns - 1) * GAP;
  const cardWidth = (availableWidth - totalGapWidth) / columns;

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <AppText style={styles.title}>Categories</AppText>
      </View>
      <View style={styles.cards_container}>
        <View style={[styles.gridContainer, { width: availableWidth }]}>
          {categories.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.card, 
                { 
                  width: cardWidth,
                  marginRight: (index % columns !== columns - 1) ? GAP : 0,
                  marginBottom: GAP
                }
              ]}
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
              <View style={styles.textContainer}>
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
    alignItems: "center", // Center the grid
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  textContainer: {
    flex: 1,
    justifyContent: "center",
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