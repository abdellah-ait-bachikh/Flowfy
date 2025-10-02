import { tailwindColors } from "@/lib/const";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const Bag = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);

  const randeom = Math.random();

  // Render backdrop with fade effect
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      <Button
        title="show bottom sheet"
        onPress={() => {
          bottomSheetRef.current?.expand();
        }}
      />
      <BottomSheet
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        ref={bottomSheetRef}
        backdropComponent={renderBackdrop}
        handleStyle={styles.bottomSheetHandleStyle}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetView}>
          <Text>{randeom}</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default Bag;

const styles = StyleSheet.create({
  bottomSheetView: { flex: 1, padding: 16 },

  bottomSheetHandleStyle: {
    backgroundColor: tailwindColors.neutral[100],
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },

  bottomSheetIndicator: {
    backgroundColor: "black",
    width: 40,
    height: 5,
    borderRadius: 3,
  },
});
