import React, { useRef, useEffect } from "react";
import {
  Animated,
  View,
  StyleSheet,
  ViewProps,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { tailwindColors } from "@/lib/const";

const { width: screenWidth } = Dimensions.get("window");

interface SkeletonProps extends ViewProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ style, ...viewProps }) => {
  const translateX = useRef(new Animated.Value(-screenWidth)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(translateX, {
        toValue: screenWidth,
        duration: 1100,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [translateX]);

  return (
    <View
      {...viewProps} // <-- Spread all ViewProps here
      style={[styles.container, style]}
    >
      <View style={styles.base} />

      <Animated.View
        style={[styles.shimmerWrapper, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["#E1E9EE00", "#FFFFFF55", "#E1E9EE00"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tailwindColors.gray[300],
    overflow: "hidden",
  },
  base: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tailwindColors.gray[300],
  },
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: "150%",
  },
});

export default Skeleton;
