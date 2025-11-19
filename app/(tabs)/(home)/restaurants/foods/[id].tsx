import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import AppText from '@/components/app/share/AppText'

const FoodDetail = () => {
  const {id} = useLocalSearchParams()
  return (
    <View>
      <AppText>FoodDetail {id}</AppText>
    </View>
  )
}

export default FoodDetail