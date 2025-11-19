// WheelMenu.tsx
import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: W, height: H } = Dimensions.get("window");

type Item = {
  key: string;
  label: string;
};

const ITEMS: Item[] = [
  { key: "fruits_and_vegetibals", label: "fruits and vegetibals" },
  { key: "hanot", label: "hanote" },
  { key: "Custem", label: "Custem" },
  { key: "food", label: "Food" },
];

interface WheelMenuProps {
  size?: number; // قطر الدونات
  donutThickness?: number; // سماكة المنطقة التي توضع بها الأيقونات
}

export default function WheelMenu({
  size = 320,
  donutThickness = 290,
}: WheelMenuProps) {
  const centerRef = useRef<{ x: number; y: number }>({ x: W / 2, y: H / 3 });
  const rotation = useRef(new Animated.Value(0)).current; // قيمة الزاوية بالراديان
  const lastRotation = useRef(0);
  const startAngleRef = useRef(0);

  const [layoutReady, setLayoutReady] = useState(false);

  // تحويل الراديان إلى تدوير نصي ل Animated
  const rotateDeg = rotation.interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ["-180deg", "180deg"],
  });

  // عكس التدوير (حتى تبقى الأيقونات بشكل ثابت)
  const inverseRotate = Animated.multiply(rotation, -1).interpolate({
    inputRange: [-Math.PI, Math.PI],
    outputRange: ["-180deg", "180deg"],
  });

  // حساب مواضع العناصر حول دائرة نصف قطرها r
  const radius = (size - donutThickness) / 2 + donutThickness / 2;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const { pageX, pageY } = evt.nativeEvent;
        const dx = pageX - centerRef.current.x;
        const dy = pageY - centerRef.current.y;
        startAngleRef.current = Math.atan2(dy, dx);
        lastRotation.current = (rotation as any).__getValue?.() ?? 0;
      },

      onPanResponderMove: (
        evt: GestureResponderEvent,
        gestureState: PanResponderGestureState
      ) => {
        const { moveX, moveY } = gestureState; // ✅ هنا التعديل
        const dx = moveX - centerRef.current.x;
        const dy = moveY - centerRef.current.y;
        const currentAngle = Math.atan2(dy, dx);

        let delta = currentAngle - startAngleRef.current;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        else if (delta < -Math.PI) delta += 2 * Math.PI;

        const newRotation = lastRotation.current + delta;
        rotation.setValue(newRotation);
      },

      onPanResponderRelease: () => {
        lastRotation.current = (rotation as any).__getValue?.() ?? 0;
        Animated.spring(rotation, {
          toValue: lastRotation.current,
          useNativeDriver: false,
          friction: 8,
        }).start();
      },
      onPanResponderTerminationRequest: () => true,
    })
  ).current;

  const onLayoutContainer = (e: LayoutChangeEvent) => {
    const { x, y, width, height } = e.nativeEvent.layout;
    centerRef.current = {
      x: x + width / 2,
      y: y + height / 2,
    };
    if (!layoutReady) setLayoutReady(true);
  };

  return (
    <View style={styles.root}>
      <View style={styles.container} onLayout={onLayoutContainer}>
        {/* الخلفية الصفراء العلوية */}
        <View style={styles.headerBackground} />

        {/* الدونات الدوارة */}
        <Animated.View
          {...pan.panHandlers}
          style={[
            {
              width: size,
              height: size,
              marginTop: 60,
              alignSelf: "center",
              alignItems: "center",
              justifyContent: "center",
              transform: [{ rotate: rotateDeg }],
            },
          ]}
        >
          {/* This inner container ensures pivot = center */}
          <View style={{ width: size, height: size }}>
            {ITEMS.map((it, idx) => {
              const angle = (idx / ITEMS.length) * Math.PI * 2 - Math.PI / 2;
              const x = radius * Math.cos(angle) + size / 2 - 40; // 80/2 = 40
              const y = radius * Math.sin(angle) + size / 2 - 40;

              return (
                <Animated.View
                  key={it.key}
                  style={[
                    styles.item,
                    {
                      position: "absolute",
                      left: x,
                      top: y,
                      transform: [{ rotate: inverseRotate }],
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.itemButton}
                    onPress={() => console.log("pressed", it.key)}
                  >
                    <Text style={styles.itemEmoji}>🍔</Text>
                  </TouchableOpacity>
                  <Text style={styles.itemLabel}>{it.label}</Text>
                </Animated.View>
              );
            })}

            {/* The donut hole */}
            <View
              pointerEvents="none"
              style={[
                styles.hole,
                {
                  width: size - donutThickness,
                  height: size - donutThickness,
                  borderRadius: (size - donutThickness) / 2,
                  left: (size - (size - donutThickness)) / 2,
                  top: (size - (size - donutThickness)) / 2,
                },
              ]}
            />
          </View>
        </Animated.View>

        {/* العنصر الأوسط */}
        <View
          style={[
            styles.centerItemWrapper,
            {
              width: 64,
              height: 64,
              top: 60 + size / 2 - 32, // center vertically
              left: W / 2 - 32, // center horizontally
            },
          ]}
        >
          <View style={styles.centerItem}>
            <Text style={styles.centerEmoji}>🍔</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    alignItems: "center",
  },
  headerBackground: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // height: 330,
    // backgroundColor: "#F8C548",
    // borderBottomLeftRadius: 60,
    // borderBottomRightRadius: 60,
  },
  donutContainer: {
    marginTop: 60,
    alignSelf: "center",
    backgroundColor: "transparent",
  },
  hole: {
    position: "absolute",
    backgroundColor: "#fff",
  },
  item: {
    position: "absolute",
    width: 80,
    alignItems: "center",
  },
  itemButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  itemEmoji: { fontSize: 26 },
  itemLabel: {
    marginTop: 6,
    fontSize: 12,
    textAlign: "center",
    color: "#222",
  },
  centerItemWrapper: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerItem: {
    width: "100%",
    height: "100%",
    borderRadius: 32, // same as itemButton
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  centerEmoji: { fontSize: 26 },

  centerLabel: { marginTop: 6, fontSize: 14, fontWeight: "600" },
  promo: {
    position: "absolute",
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  promoTitle: { fontWeight: "700", fontSize: 16 },
  promoSub: { color: "#666", marginTop: 6 },
});
