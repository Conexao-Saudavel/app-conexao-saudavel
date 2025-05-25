import React from 'react';
import { View, Text, StyleSheet, Image, Platform } from 'react-native';
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
      <View style={styles.imageContainer}>
        <Image 
          source={image} 
          style={styles.image} 
          resizeMode="contain"
          defaultSource={image}
        />
      </View>
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
  imageContainer: {
    width: '100%',
    height: Platform.OS === 'web' ? '50%' : '40%',
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    alignItems: 'center',
    width: '100%',
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