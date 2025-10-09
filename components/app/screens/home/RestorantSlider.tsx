import AppText from "@/components/ui/AppText";
import { appColors, categories, tailwindColors } from "@/lib/const";
import * as React from "react";
import { Dimensions, View, TouchableOpacity, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = width * 0.8 - 10;
function RestaurantSlider() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

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
            stackInterval: 20, // spacing between items
          }}
          containerStyle={styles.carouselContainer}
          ref={ref}
          width={ITEM_WIDTH}
          height={ITEM_WIDTH / 2}
          data={categories}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <View style={[styles.carouselItem, { height: ITEM_WIDTH / 2 }]}>
              <AppText style={styles.itemText}>{item.name}</AppText>
            </View>
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
    flex: 1,
    justifyContent: "center",
  },
  carouselWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  carouselContainer: { gap: 10, borderRadius: 20 },
  carouselItem: {
    flex: 1,
    borderWidth: 0,
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: tailwindColors.neutral[50],
    marginHorizontal: 5,
  },
  itemText: {
    textAlign: "center",
    fontSize: 20,
  },
  paginationDot: {
    backgroundColor: tailwindColors.neutral[200],
    borderRadius: 50,
  },
  paginationContainer: {
    gap: 5,
    marginTop: 5,
  },
});

export default RestaurantSlider;
