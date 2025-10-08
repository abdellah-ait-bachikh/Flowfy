import AppText from "@/components/ui/AppText";
import { appColors, categories, fonts, tailwindColors } from "@/lib/const";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 100;

function CategoriesSlider() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { t, i18n } = useTranslation("");
  const isRtl = i18n.language === "ar";

  return (
    <View>
      {/* Header */}
      <View style={styles.headerRow}>
        <AppText style={styles.headerTitle}>
          {t(`screens.(tabs).index.horizontal_categories_scroll.title`)}
        </AppText>
      </View>
      <View style={{ width, paddingHorizontal: 10 }}>
        {/* Carousel */}
        <Carousel
          ref={ref}
          loop
          width={width * 0.6 + 10} 
          height={CARD_HEIGHT}
          autoPlay
          autoPlayInterval={2500}
          data={categories}
          scrollAnimationDuration={800}
          style={{ width: "100%" }}
          pagingEnabled={true}
          snapEnabled={true}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.cardWrapper,
                { width: width * 0.6, marginRight: 10 },
              ]} // 👈 spacing between cards
              activeOpacity={0.8}
            >
              <View style={styles.card}>
                <Image source={item.image} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <AppText
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.cardTitle}
                  >
                    {t(
                      `screens.(tabs).index.horizontal_categories_scroll.name.${item.name}`
                    )}
                  </AppText>
                  <AppText
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles.description}
                  >
                    {t(
                      `screens.(tabs).index.horizontal_categories_scroll.description.${item.name}`
                    )}
                  </AppText>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

export default CategoriesSlider;

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: 17,
  },

  cardWrapper: {
    justifyContent: "center",
  },

  card: {
    height: CARD_HEIGHT,
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: appColors.white,
    borderColor: tailwindColors.neutral[100],
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
    overflow: "hidden",
  },

  cardImage: {
    resizeMode: "contain",
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: fonts["Montserrat-Medium"],
  },
  description: {
    fontSize: 10,
    color: tailwindColors.gray[400],
  },
});
