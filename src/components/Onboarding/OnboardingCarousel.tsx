import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, Animated, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { OnboardingSlide } from './OnboardingSlide';
import Button from '../common/Button';

const { width } = Dimensions.get('window');

interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    title: 'Bem-vindo ao Conexão Saudável',
    description: 'Seu companheiro para uma relação mais saudável com a tecnologia',
    image: require('../../../assets/onboarding-1.png'),
  },
  {
    title: 'Jornada de Digital Wellness',
    description: 'Acompanhe seu progresso e desenvolva hábitos mais saudáveis de uso do celular',
    image: require('../../../assets/onboarding-2.png'),
  },
  {
    title: 'Check-ins e Conquistas',
    description: 'Ganhe badges e acompanhe seu progresso através de check-ins diários',
    image: require('../../../assets/onboarding-3.png'),
  },
];

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  onComplete,
  onSkip,
}) => {
  const theme = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: true,
      listener: (event: any) => {
        const newPage = Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width);
        if (newPage !== currentPage) {
          setCurrentPage(newPage);
        }
      },
    }
  );

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      scrollViewRef.current?.scrollTo({
        x: nextPage * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {slides.map((slide, index) => (
          <View key={index} style={styles.slideContainer}>
            <OnboardingSlide
              title={slide.title}
              description={slide.description}
              image={slide.image}
            />
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentPage
                      ? theme.colors.primary
                      : theme.colors.outline,
                },
              ]}
            />
          ))}
        </View>
        <View style={styles.buttons}>
          <Button
            title="Pular"
            onPress={onSkip}
            mode="text"
            style={styles.skipButton}
          />
          <Button
            title={currentPage === slides.length - 1 ? 'Começar' : 'Próximo'}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  slideContainer: {
    flex: 1,
    width: width,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    minWidth: 100,
  },
  nextButton: {
    minWidth: 120,
  },
}); 