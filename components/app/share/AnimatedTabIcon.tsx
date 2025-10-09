// AnimatedTabIcon.tsx
import React, { useEffect, useRef } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
  withDelay,
} from "react-native-reanimated";
import { tailwindColors, appColors } from "@/theme/colors";

interface IconProps {
  size: number;
  color: string;
}

interface Props {
  focused: boolean;
  icon: React.ComponentType<IconProps>;
  /** optional customization */
  activeWidth?: number;
  inactiveWidth?: number;
  height?: number;
  activeScale?: number;
  timingDuration?: number; // background fade timing
  animationDelay?: number; // delay before animation starts
}

const AnimatedTabIcon: React.FC<Props> = ({
  focused,
  icon: Icon,
  activeWidth = 60,
  inactiveWidth = 40,
  height = 30,
  activeScale = 1.12,
  timingDuration = 180,
  animationDelay = 300, // default 300ms delay
}) => {
  // shared values (UI thread)
  const width = useSharedValue<number>(inactiveWidth);
  const progress = useSharedValue<number>(0); // 0 -> inactive, 1 -> active (for color interpolation)
  const scale = useSharedValue<number>(1);

  // ref to track if it's the initial render
  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      // On initial render, set values immediately without animation
      width.value = focused ? activeWidth : inactiveWidth;
      progress.value = focused ? 1 : 0;
      scale.value = focused ? activeScale : 1;
      isInitialRender.current = false;
      return;
    }

    // Only animate on subsequent changes (user interactions) with delay
    width.value = withDelay(
      animationDelay,
      withSpring(focused ? activeWidth : inactiveWidth, {
        damping: 12,
        stiffness: 120,
      })
    );

    progress.value = withDelay(
      animationDelay,
      withTiming(focused ? 1 : 0, { duration: timingDuration })
    );

    scale.value = withDelay(
      animationDelay,
      withSpring(focused ? activeScale : 1, {
        damping: 12,
        stiffness: 120,
      })
    );
  }, [
    focused,
    activeWidth,
    inactiveWidth,
    activeScale,
    timingDuration,
    animationDelay,
    width,
    progress,
    scale,
  ]);

  const containerStyle = useAnimatedStyle(() => {
    return {
      width: width.value,
      height,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: height / 2,
      // interpolateColor from transparent -> amber
      backgroundColor: interpolateColor(
        progress.value,
        [0, 1],
        ["transparent", appColors.light_yellow]
      ),
    } as ViewStyle;
  }, [height]);

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <Animated.View style={iconStyle}>
        <Icon
          size={24}
          color={focused ? appColors.black : tailwindColors.gray[400]}
          
        />
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedTabIcon;

const styles = StyleSheet.create({
  container: {
    overflow: "hidden", 
  },
});
