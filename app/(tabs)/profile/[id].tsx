import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ProfileDetails = () => {
    const { id } = useLocalSearchParams();

  return (
    <View
     style={{ display: "flex",backgroundColor: "transparent" ,flex:1 }}
    >
      <Text>Profile id = {id}</Text>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({});
