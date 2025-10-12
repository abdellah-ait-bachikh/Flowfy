import AppText from "@/components/app/share/AppText";
import { fonts } from "@/lib/const";
import { tailwindColors } from "@/theme/colors";
import { FONT_SIZE_MEDUIME } from "@/theme/globals";
import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";

const items = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

const CARD_WIDTH = 160;
const GAP = 5;
const MAX_COLUMNS = 6;

const RankingFood = () => {
  const { width } = useWindowDimensions();

  const possibleColumns = Math.floor(width / (CARD_WIDTH + GAP));
  const columns = Math.min(possibleColumns, MAX_COLUMNS);

  const gridWidth = columns * CARD_WIDTH + (columns - 1) * GAP;

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <AppText style={styles.title}>Categories</AppText>
      </View>
      <View style={styles.cards_container}>
        <View style={[styles.gridWrapper, { width: gridWidth }]}>
          {items.map((item, index) => (
            <View
              key={index}
              style={[
                styles.card,
                {
                  width: CARD_WIDTH,
                  marginRight: (index + 1) % columns === 0 ? 0 : GAP,
                  marginBottom: GAP,
                },
              ]}
            >
              <AppText style={styles.itemText}>{item}</AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

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
    paddingBottom: 20,
    marginTop: 5,
    alignItems: "center",
  },
  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    height: 180,
//    backgroundColor: tailwindColors.neutral[50],
    borderWidth: 1,
    borderColor: tailwindColors.neutral[50],
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  itemText: {
    fontWeight: "bold",
  },
});

export default RankingFood;
