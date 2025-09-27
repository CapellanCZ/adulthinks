import { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor'

export function useRoadmap() {
  const [isModalVisible, setIsModalVisible] = useState(false)
  
  const backgroundColor = useThemeColor({}, 'background')
  const borderColor = useThemeColor({}, 'border')
  const textColor = useThemeColor({}, 'text')
  const textMuted = useThemeColor({}, 'textMuted')
  const primaryColor = useThemeColor({}, 'primary')

  const handleGenerateRoadmap = () => {
    setIsModalVisible(true)
  }

  const handleFabPress = () => {
    setIsModalVisible(true)
  }

  const handleCloseModal = () => {
    setIsModalVisible(false)
  }

  return {
    colors: {
      backgroundColor,
      borderColor,
      textColor,
      textMuted,
      primaryColor,
    },
    handlers: {
      handleGenerateRoadmap,
      handleFabPress,
      handleCloseModal,
    },
    modal: {
      isModalVisible,
    },
  }
}
