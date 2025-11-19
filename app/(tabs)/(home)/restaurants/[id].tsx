import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import AppText from '@/components/app/share/AppText'

const RestautantDetails = () => {
  const {id} = useLocalSearchParams<{id:string}>()
  return (
    <View>
      <AppText>RestautantDetails {id}</AppText>
    </View>
  )
}

export default RestautantDetails