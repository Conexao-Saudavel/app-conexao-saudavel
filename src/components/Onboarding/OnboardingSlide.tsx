import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: any;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} resizeMode="contain" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.onBackground }]}>{title}</Text>
        <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '80%',
    height: '50%',
    marginBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
}); 