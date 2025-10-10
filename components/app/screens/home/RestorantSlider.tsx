import { categories, restaurantSliderData } from "@/lib/const";
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
import { Ionicons } from "@expo/vector-icons";
import { appColors, tailwindColors } from "@/theme/colors";
import AppText from "../../share/AppText";
import defaultRestaurantLogo from "@/assets/images/icons/default-restaurant-logo.png";
import {
  FONT_SIZE_MEDUIME,
  FONT_SIZE_NORMAL,
  FONT_SIZE_SMALL,
} from "@/theme/globals";
import { Star } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import RatingStarts from "../../share/RatingStarts";
function RestaurantSlider() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { width } = useWindowDimensions();

  // Responsive ITEM_WIDTH
  const ITEM_WIDTH = width >= 800 ? 600 : width * 0.8 - 10;
  const ITEM_HEIGHT = width >= 800 ? 140 : 100;
  const IMAGE_SIZE = width >= 800 ? 120 : 80;

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

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

  return (
    <View style={styles.container}>
      {/* Carousel with arrows */}
      <View style={styles.carouselWrapper}>
        {/* Prev Arrow */}
        <TouchableOpacity onPress={handlePrev} activeOpacity={0.7}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={tailwindColors.neutral[400]}
          />
        </TouchableOpacity>

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
            <TouchableOpacity style={[styles.carouselItem, { height: ITEM_HEIGHT }]}>
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
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </AppText>
                <View style={styles.card_rating}>
                  <AppText> {item.rating} </AppText>
                  <RatingStarts rating={item.rating} />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Next Arrow */}
        <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
          <Ionicons
            name="chevron-forward"
            size={28}
            color={tailwindColors.neutral[400]}
          />
        </TouchableOpacity>
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
  },
  carouselContainer: {
    gap: 10,
    borderRadius: 20,
  },
  carouselItem: {
    flex: 1,
    justifyContent: "flex-start",
    borderRadius: 20,
    backgroundColor: tailwindColors.neutral[50],
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
    justifyContent: "flex-start",
    alignSelf: "stretch",
  },
  card_text_title: {
    width: "100%",
    fontSize: FONT_SIZE_NORMAL,
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
});

export default RestaurantSlider;
