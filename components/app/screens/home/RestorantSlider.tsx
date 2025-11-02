import { categories, fonts, restaurantSliderData } from "@/lib/const";
import * as React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { Fontisto, Ionicons } from "@expo/vector-icons";
import { appColors, tailwindColors } from "@/theme/colors";
import AppText from "../../share/AppText";
import defaultRestaurantLogo from "@/assets/images/icons/default-restaurant-logo.png";
import {
  FONT_SIZE_MEDUIME,
  FONT_SIZE_NORMAL,
  FONT_SIZE_SEMI_TITLE,
  FONT_SIZE_SMALL,
} from "@/theme/globals";
import { Star } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import RatingStarts from "../../share/RatingStarts";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

function RestaurantSlider() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width } = useWindowDimensions();
  const { t, i18n } = useTranslation();
  
  // Check if current language is RTL (Arabic)
  const isRTL = i18n.language === 'ar';
  
  // Responsive ITEM_WIDTH
  const ITEM_WIDTH = width >= 800 ? 600 : width * 0.8 - 10;
  const ITEM_HEIGHT = width >= 800 ? 140 : 110;
  const IMAGE_SIZE = width >= 800 ? 120 : 80;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  
  const router = useRouter();
  
  const handlePrev = () => {
    ref.current?.scrollTo({
      count: -1,
      animated: true,
    });
  };

  const handleNext = () => {
    ref.current?.scrollTo({
      count: 1,
      animated: true,
    });
  };
  
  const handelNavigate = (id: string) => {
    router.push({
      pathname: "/(tabs)/(home)/restaurants/[id]",
      params: { id },
    });
  };

  // Render arrows based on RTL
  const renderArrows = () => {
    const prevArrow = (
      <TouchableOpacity onPress={handlePrev} activeOpacity={0.7}>
        <Ionicons
          name="chevron-back"
          size={28}
          color={tailwindColors.neutral[400]}
        />
      </TouchableOpacity>
    );

    const nextArrow = (
      <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
        <Ionicons
          name="chevron-forward"
          size={28}
          color={tailwindColors.neutral[400]}
        />
      </TouchableOpacity>
    );

    // For RTL languages, swap the arrow positions
    if (isRTL) {
      return (
        <>
          {nextArrow}
          <Carousel
            modeConfig={{
              snapDirection: "left",
              stackInterval: 20,
            }}
            containerStyle={[styles.carouselContainer, { width: ITEM_WIDTH }]}
            ref={ref}
            width={ITEM_WIDTH}
            height={ITEM_HEIGHT}
            data={restaurantSliderData}
            onProgressChange={progress}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.carouselItem, { height: ITEM_HEIGHT }]}
                onPress={() => handelNavigate(`${item.id}`)}
              >
                <Image
                  style={[
                    styles.card_restaurant_logo,
                    { width: IMAGE_SIZE, height: IMAGE_SIZE },
                  ]}
                  source={item.logo ? item.logo : defaultRestaurantLogo}
                />

                <View style={styles.card_text_container}>
                  <AppText
                    style={styles.card_text_title}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </AppText>
                  <View style={styles.card_rating}>
                    <AppText> {item.rating} </AppText>
                    <RatingStarts rating={item.rating} />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={styles.card_products_count_container}>
                      <AppText> {item.products_count} </AppText>
                      <Ionicons name="fast-food" size={14} color="black" />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "center",
                        gap: 10,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        backgroundColor:
                          item.offers_count > 0
                            ? tailwindColors.green[400]
                            : tailwindColors.gray[300],
                        borderRadius: 10,
                      }}
                    >
                      <AppText
                        style={{
                          fontSize: FONT_SIZE_SMALL,
                          color: item.offers_count > 0 ? "white" : "black",
                        }}
                      >
                        {item.offers_count}
                      </AppText>
                      <Fontisto
                        name="shopping-package"
                        size={14}
                        color={item.offers_count > 0 ? "white" : "black"}
                      />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
          {prevArrow}
        </>
      );
    }

    // For LTR languages (default)
    return (
      <>
        {prevArrow}
        <Carousel
          modeConfig={{
            snapDirection: "left",
            stackInterval: 20,
          }}
          containerStyle={[styles.carouselContainer, { width: ITEM_WIDTH }]}
          ref={ref}
          width={ITEM_WIDTH}
          height={ITEM_HEIGHT}
          data={restaurantSliderData}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.carouselItem, { height: ITEM_HEIGHT }]}
              onPress={() => handelNavigate(`${item.id}`)}
            >
              <Image
                style={[
                  styles.card_restaurant_logo,
                  { width: IMAGE_SIZE, height: IMAGE_SIZE },
                ]}
                source={item.logo ? item.logo : defaultRestaurantLogo}
              />

              <View style={styles.card_text_container}>
                <AppText
                  style={styles.card_text_title}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </AppText>
                <View style={styles.card_rating}>
                  <AppText> {item.rating} </AppText>
                  <RatingStarts rating={item.rating} />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.card_products_count_container}>
                    <AppText> {item.products_count} </AppText>
                    <Ionicons name="fast-food" size={14} color="black" />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 10,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      backgroundColor:
                        item.offers_count > 0
                          ? tailwindColors.green[400]
                          : tailwindColors.gray[300],
                      borderRadius: 10,
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: FONT_SIZE_SMALL,
                        color: item.offers_count > 0 ? "white" : "black",
                      }}
                    >
                      {item.offers_count}
                    </AppText>
                    <Fontisto
                      name="shopping-package"
                      size={14}
                      color={item.offers_count > 0 ? "white" : "black"}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
        {nextArrow}
      </>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <AppText style={styles.headerTitle}>
          {t(`screens.(tabs).index.horizontal_restaurant_scroll.title`)}
        </AppText>
      </View>
      <View style={styles.carouselWrapper}>
        {renderArrows()}
      </View>

      {/* Pagination dots */}
      <Pagination.Basic
        progress={progress}
        data={categories}
        dotStyle={styles.paginationDot}
        containerStyle={styles.paginationContainer}
        onPress={onPressPagination}
        activeDotStyle={{ backgroundColor: appColors.light_yellow }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    paddingHorizontal: 10,
    width: "100%",
  },
  headerTitle: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: FONT_SIZE_MEDUIME,
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  carouselWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 5,
  },
  carouselContainer: {
    gap: 10,
    borderRadius: 20,
  },
  carouselItem: {
    flex: 1,
    justifyContent: "flex-start",
    borderRadius: 20,
    backgroundColor: appColors.white,
    borderWidth: 2,
    borderColor: tailwindColors.neutral[100],
    marginHorizontal: 5,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },

  paginationDot: {
    backgroundColor: tailwindColors.neutral[200],
    borderRadius: 50,
    width: 8,
    height: 8,
  },
  paginationContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 5,
  },
  card_restaurant_logo: {
    resizeMode: "contain",
  },
  card_text_container: {
    flex: 1,
    marginLeft: 10,
    alignItems: "stretch",
    justifyContent: "space-between",
    alignSelf: "stretch",
  },
  card_text_title: {
    width: "100%",
    fontSize: FONT_SIZE_NORMAL,
    fontFamily: fonts["Montserrat-Medium"],
  },
  card_rating: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  card_rating_start_container: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 2,
  },
  card_products_count_container: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 3,
  },
});

export default RestaurantSlider;