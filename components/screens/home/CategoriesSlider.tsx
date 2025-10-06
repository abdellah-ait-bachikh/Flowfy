import AppText from "@/components/ui/AppText";
import { appColors, categories, fonts, tailwindColors } from "@/lib/const";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, View, Image, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { Link } from "expo-router";

const width = Dimensions.get("window").width;
const CARD_HEIGHT = 100;

function CategoriesSlider() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { t, i18n } = useTranslation("");
  const [isAutoPlay, setIsAutoPlay] = React.useState(true);

  const isRtl = i18n.language === "ar";

  return (
    <View>
      <View style={styles.headerRow}>
        <AppText style={styles.headerTitle}>
          {t(`screens.(tabs).index.horizontal_categories_scroll.title`)}
        </AppText>
      </View>

      <View style={styles.carouselContainer}>
        <Carousel
          loop
          ref={ref}
          width={width}
          height={CARD_HEIGHT}
          data={categories}
          onProgressChange={progress}
          style={[styles.carousel]}
          containerStyle={[styles.carouselContainerStyle]}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 1,
            parallaxScrollingOffset: width * 0.34,
            parallaxAdjacentItemScale: 0.7,
          }}
          renderItem={({ item }) => (
            <View style={{ width: width * 0.75 }}>
              <Link
                href={`/(tabs)/(home)/${item.href}`}
                style={{ marginLeft: 20 }}
                key={item.id}
              >
                <View style={[styles.card]}>
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
              </Link>
            </View>
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

  carouselContainer: {
    width,
    height: 113,
    overflow: "hidden",
  },

  carousel: {
    paddingVertical: 0,
    marginVertical: 0,
  },

  carouselContainerStyle: {
    paddingVertical: 0,
    marginVertical: 0,
    height: CARD_HEIGHT,
  },

  card: {
    width: width * 0.75,
    height: CARD_HEIGHT,
    borderWidth: 3,
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
