// src/components/common/ScreenWrapper.tsx
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  scrollable = false,
}) => {
  const { colors } = useTheme();
  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    style,
  ];

  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={containerStyle}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.flexGrow} keyboardShouldPersistTaps="handled" bounces={false}>
        <View style={containerStyle}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContentContainer: {
    paddingBottom: 20, // Espaço extra no final do scroll
  },
  flexGrow: {
     flexGrow: 1, // Para View não scrollável ocupar a tela
  }
});

export default ScreenWrapper;