import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
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
  const [currentPage, setCurrentPage] = React.useState(0);
  const pagerRef = React.useRef<PagerView>(null);

  const handlePageSelected = (e: any) => {
    setCurrentPage(e.nativeEvent.position);
  };

  const handleNext = () => {
    if (currentPage < slides.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={handlePageSelected}
      >
        {slides.map((slide, index) => (
          <OnboardingSlide
            key={index}
            title={slide.title}
            description={slide.description}
            image={slide.image}
          />
        ))}
      </PagerView>

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
  pager: {
    flex: 1,
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