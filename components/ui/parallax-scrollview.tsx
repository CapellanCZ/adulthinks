import React, { useRef, useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ParallaxScrollViewProps {
  headerHeight: number;
  headerImage: React.ReactNode;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ParallaxScrollView({
  headerHeight,
  headerImage,
  children,
  style,
}: ParallaxScrollViewProps) {
  const scrollY = useSharedValue(0);
  const [headerHeightState, setHeaderHeightState] = useState(headerHeight);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-headerHeightState, 0, headerHeightState],
      [-headerHeightState / 2, 0, headerHeightState * 0.75],
      Extrapolate.CLAMP
    );

    const scale = interpolate(
      scrollY.value,
      [-headerHeightState, 0],
      [1.5, 1],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, headerHeightState / 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <View style={[{ flex: 1 }, style]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces={true}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: headerHeightState }}
      >
        <View style={{ backgroundColor: 'transparent', minHeight: SCREEN_HEIGHT }}>
          {children}
        </View>
      </Animated.ScrollView>

      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: headerHeightState,
            overflow: 'hidden',
          },
          headerAnimatedStyle,
        ]}
      >
        {headerImage}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.3)',
            },
            contentAnimatedStyle,
          ]}
        />
      </Animated.View>
    </View>
  );
}
