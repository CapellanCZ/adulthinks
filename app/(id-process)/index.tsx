import { StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View } from '@/components/ui/view'
import { Text } from '@/components/ui/text'

//ID Process Detail Screen
export default function IdentificationDetail() {
  return (
    <SafeAreaView> 
      <View>
        <Text variant='subtitle'>Philippine National ID</Text>
        <Text variant='caption'>Primary</Text>
      </View>
    </SafeAreaView>
  )
}
