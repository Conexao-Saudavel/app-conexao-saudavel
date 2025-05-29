import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Button from '../common/Button';

const { width } = Dimensions.get('window');

interface OnboardingCarouselProps {
  onComplete: () => void;
  onSkip: () => void;
}

const slides = [
  {
    title: 'Bem-vindo ao Conexão Saudável',
    description: 'Você não está sozinho! Aqui, vamos juntos dar o primeiro passo para uma relação mais saudável com o seu celular.',
    icon: 'hand-heart',
    color: '#7B61FF',
  },
  {
    title: 'Descubra seu tempo de tela',
    description: 'Entenda como você usa o celular no dia a dia. O autoconhecimento é o início da mudança!',
    icon: 'cellphone-clock',
    color: '#FFB37B',
  },
  {
    title: 'Supere desafios e celebre conquistas',
    description: 'Defina metas, registre seu progresso e conquiste pequenas vitórias a cada dia. Cada passo conta!',
    icon: 'fire',
    color: '#FF7A7A',
  },
  {
    title: 'Conte com apoio e motivação',
    description: 'Ative lembretes e dicas para se manter focado no que realmente importa. Você pode transformar seu hábito!',
    icon: 'bell-ring',
    color: '#7AFFA3',
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
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={slide.icon as any}
                size={100}
                color={slide.color}
                style={{ marginBottom: 24 }}
              />
            </View>
            <View style={styles.content}>
              <Animated.Text style={[styles.title, { color: theme.colors.onBackground }]}>{slide.title}</Animated.Text>
              <Animated.Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>{slide.description}</Animated.Text>
            </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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