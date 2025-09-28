import AppText from "@/components/ui/AppText";
import { appColors, fonts, tailwindColors } from "@/const";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import defaultRestaurantImg from "@/assets/images/icons/default_restaurant_img.png";
import { formateMaxNumber, renderStars } from "@/lib/utils";
import { restaurantSliderData } from "@/const";
import { Link, useRouter } from "expo-router";
import LinearGradientCmp from "@/components/ui/LinearGradientCmp";

const width = Dimensions.get("window").width;

function RestaurantSlide() {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const { t, i18n } = useTranslation("");
  const router = useRouter();
  const [isAutoPlay, setIsAutoPlay] = React.useState(true); // controls autoPlay

  const pauseAutoPlay = () => {
    setIsAutoPlay(false);
    setTimeout(() => {
      setIsAutoPlay(true);
    }, 3000); // 3 seconds pause
  };

  const goPrev = () => {
    ref.current?.scrollTo({ count: -1, animated: true });
    pauseAutoPlay(); // pause when user interacts
  };

  const goNext = () => {
    ref.current?.scrollTo({ count: 1, animated: true });
    pauseAutoPlay(); // pause when user interacts
  };

  const isRtl = i18n.language === "ar";

  return (
    <View>
      <View style={styles.headerRow}>
        <View>
          <AppText style={styles.headerTitle}>
            {t(`screens.(tabs).index.horizontal_restaurant_scroll.title`)}
          </AppText>
        </View>
        <View style={styles.moreRow}>
          <AppText style={styles.moreText}>
            {t(`screens.(tabs).index.horizontal_restaurant_scroll.more`)}
          </AppText>
          {isRtl ? (
            <AntDesign name="arrow-left" />
          ) : (
            <AntDesign name="arrow-right" />
          )}
        </View>
      </View>

      <View style={styles.carouselWrapper}>
        <View style={styles.carouselContainer}>
          <Carousel
            autoPlay={isAutoPlay}
            autoPlayInterval={3000}
            loop
            windowSize={3}
            ref={ref}
            width={width}
            height={140}
            style={styles.carousel}
            containerStyle={styles.carouselInner}
            data={restaurantSliderData}
            onProgressChange={progress}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.8,
              parallaxScrollingOffset: width * 0.25,
            }}
            // scrollAnimationDuration={800}
            renderItem={({ item }) => (
              <Link href={"/bag"}>
                <View style={styles.card}>
                  <View>
                    <Image
                      source={defaultRestaurantImg}
                      style={styles.cardImage}
                    />
                  </View>

                  <View style={styles.cardContent}>
                    <AppText
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles.cardTitle}
                    >
                      {item.name}
                    </AppText>

                    <View
                      style={[
                        styles.ratingRow,
                        {
                          flexDirection: isRtl ? "row-reverse" : "row",
                          justifyContent: isRtl ? "flex-end" : "flex-start",
                        },
                      ]}
                    >
                      <AppText>{item.rating}</AppText>
                      <View
                        style={[
                          styles.starsRow,
                          { flexDirection: isRtl ? "row-reverse" : "row" },
                        ]}
                      >
                        {renderStars(item.rating).map((icon, i) => (
                          <FontAwesome
                            key={i}
                            name={icon}
                            size={20}
                            color={appColors.yellow}
                          />
                        ))}
                      </View>
                    </View>

                    <View style={styles.cardBottomRow}>
                      <View
                        style={[
                          styles.productsRow,
                          { flexDirection: isRtl ? "row-reverse" : "row" },
                        ]}
                      >
                        <AppText style={styles.productsText}>
                          {item.products_count}
                        </AppText>
                        <Ionicons
                          name="fast-food-outline"
                          size={14}
                          color={tailwindColors.neutral[300]}
                        />
                      </View>

                      <TouchableOpacity
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push("/profile");
                        }}
                        style={styles.offersBox}
                      >
                        <AppText style={styles.offersNumber}>
                          {formateMaxNumber(item.offers_count, 9)}
                        </AppText>
                        <AppText style={styles.offersText}>
                          {t(
                            `screens.(tabs).index.horizontal_restaurant_scroll.items.offers`
                          )}
                        </AppText>
                        <TouchableOpacity />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Link>
            )}
          />

          <TouchableOpacity onPress={goPrev} style={styles.arrowLeft}>
            {isRtl ? (
              <SimpleLineIcons name="arrow-right" />
            ) : (
              <SimpleLineIcons name="arrow-left" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={goNext} style={styles.arrowRight}>
            {isRtl ? (
              <SimpleLineIcons name="arrow-left" />
            ) : (
              <SimpleLineIcons name="arrow-right" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RestaurantSlide;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: 17,
  },
  moreRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  moreText: {
    fontFamily: fonts["Montserrat-SemiBold"],
    fontSize: 17,
  },
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    width: width,
    height: 140,
    justifyContent: "center",
  },
  carousel: {
    width: width,
  },
  carouselInner: {
    width: width,
  },
  card: {
    width: width * 0.9,
    flex: 1,
    marginHorizontal: "auto",
    borderWidth: 3,
    borderRadius: 20,
    backgroundColor: appColors.white,
    borderColor: tailwindColors.neutral[100],
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    gap: 10,
    position: "relative",
    overflow: "hidden",
    height: 140,
    // iOS shadow
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1, // light shadow
    // shadowRadius: 4,

    // // Android shadow
    // elevation: 3,
  },
  cardImage: {
    resizeMode: "contain",
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  cardContent: {
    flex: 1,
    alignSelf: "stretch",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 20,
  },
  ratingRow: {
    gap: 5,
    alignItems: "center",
  },
  starsRow: {
    gap: 3,
  },
  cardBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productsRow: {
    gap: 3,
    alignItems: "center",
  },
  productsText: {
    fontSize: 15,
    color: tailwindColors.neutral[300],
  },
  offersBox: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: tailwindColors.green[400],
    borderRadius: 10,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: tailwindColors.neutral[400],
  },
  offersNumber: {
    fontSize: 17,
    color: appColors.white,
    fontFamily: "SpaceMonoSemiBold",
  },
  offersText: {
    fontSize: 17,
    color: appColors.white,
    fontFamily: "SpaceMonoSemiBold",
  },
  arrowLeft: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -25 }],
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#dfdfdf44",
  },
  arrowRight: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -25 }],
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#dfdfdf44",
  },
});
