import { BlurView } from 'expo-blur';
import { useEffect, useState, type ReactNode } from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

type MorrowSurfaceAppearanceOptions = {
  reducedTransparency: boolean;
  blurSupported?: boolean;
};

export type MorrowSurfaceAppearance = {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  useBlur: boolean;
};

export function morrowSurfaceAppearance({ reducedTransparency, blurSupported = true }: MorrowSurfaceAppearanceOptions): MorrowSurfaceAppearance {
  if (reducedTransparency || !blurSupported) {
    return { backgroundColor: '#211A31', borderColor: '#817695', borderWidth: 1, useBlur: false };
  }

  return { backgroundColor: 'rgba(25,19,37,0.78)', borderColor: 'rgba(255,248,255,0.28)', borderWidth: 1, useBlur: true };
}

function useReducedTransparency() {
  const [reducedTransparency, setReducedTransparency] = useState(false);

  useEffect(() => {
    void AccessibilityInfo.isReduceTransparencyEnabled().then(setReducedTransparency);
    const subscription = AccessibilityInfo.addEventListener('reduceTransparencyChanged', setReducedTransparency);
    return () => subscription.remove();
  }, []);

  return reducedTransparency;
}

export function MorrowSurface({ children, style, reducedTransparency: reducedTransparencyOverride }: { children: ReactNode; style?: StyleProp<ViewStyle>; reducedTransparency?: boolean }) {
  const reducedTransparency = useReducedTransparency();
  const appearance = morrowSurfaceAppearance({
    reducedTransparency: reducedTransparencyOverride ?? reducedTransparency,
    blurSupported: Platform.OS !== 'android',
  });
  const surfaceStyle = [styles.surface, style, appearance];

  if (!appearance.useBlur) return <View style={surfaceStyle}>{children}</View>;

  return <BlurView intensity={36} tint="dark" style={surfaceStyle}>{children}</BlurView>;
}

const styles = StyleSheet.create({
  surface: {
    overflow: 'hidden',
    shadowColor: '#08050F',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
});
