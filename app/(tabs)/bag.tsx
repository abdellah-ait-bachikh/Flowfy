import { Button, StyleSheet, Text, View } from "react-native";
import React, { useMemo, useRef } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
const bag = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["75%"], []);
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
        enablePanDownToClose // allows swipe down to close
        // handleComponent={null}
        ref={bottomSheetRef}
      >
        <BottomSheetView>
          <Text>bag</Text>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

export default bag;

const styles = StyleSheet.create({});
