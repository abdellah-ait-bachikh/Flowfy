import AppText from "@/components/app/share/AppText";
import { fonts } from "@/lib/const";
import { tailwindColors } from "@/theme/colors";
import { FONT_SIZE_MEDUIME } from "@/theme/globals";
import React from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import FoodCard from "@/components/app/share/FoodCard";

const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Food Item ${i + 1}`,
  price: (20 + i * 0.5).toFixed(2),
  rating: (4 + Math.random() * 1).toFixed(1),
}));

const CARD_WIDTH = 160;
const GAP = 12;
const MAX_COLUMNS = 6;

const RankingFood: React.FC = () => {
  const { width } = useWindowDimensions();
  const possibleColumns = Math.floor(width / (CARD_WIDTH + GAP));
  const columns = Math.min(possibleColumns, MAX_COLUMNS);

  const gridWidth = columns * CARD_WIDTH + (columns - 1) * GAP;
 
  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <AppText style={styles.title}>Most popular</AppText>
      </View>

      <View style={styles.cards_container}>
        <View style={[styles.gridWrapper, { width: gridWidth }]}>
          {items.map((item, index) => (
            <FoodCard key={item.id} item={item} width={CARD_WIDTH} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  title_container: {
    marginBottom: 16,
  },
  title: {
    fontSize: FONT_SIZE_MEDUIME,
    fontFamily: fonts["Montserrat-SemiBold"],
    color: tailwindColors.neutral[800],
  },
  cards_container: {
    paddingBottom: 20,
    alignItems: "center",
  },
  gridWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});

export default RankingFood;
