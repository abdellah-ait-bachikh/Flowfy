import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const FoodDetail = () => {
  const {id} = useLocalSearchParams()
  return (
    <View>
      <Text>FoodDetail {id}</Text>
    </View>
  )
}

export default FoodDetail