import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { semanticColors } from '../../theme/colors';
import Typography from '../common/Typography';

interface UsageLineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  period: 'daily' | 'weekly' | 'monthly';
  formatYAxisLabel?: (yLabel: string) => string;
}

const UsageLineChart: React.FC<UsageLineChartProps> = ({ data, period, formatYAxisLabel }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 48; // 24px padding on each side

  // Validação dos dados
  const isValidData = data && 
    data.labels && 
    Array.isArray(data.labels) && 
    data.datasets && 
    Array.isArray(data.datasets) && 
    data.datasets.length > 0 && 
    data.datasets[0].data && 
    Array.isArray(data.datasets[0].data) &&
    data.labels.length > 0 &&
    data.datasets[0].data.length > 0;

  // Se não há dados válidos, mostrar mensagem
  if (!isValidData) {
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Typography variant="bodyMedium" style={{ color: semanticColors.textSecondary, textAlign: 'center' }}>
            Nenhum dado disponível para exibir no gráfico
          </Typography>
        </View>
      </View>
    );
  }

  const chartConfig = {
    backgroundGradientFrom: semanticColors.background,
    backgroundGradientTo: semanticColors.background,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 179, 123, ${opacity})`, // Cor laranja do tema
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: semanticColors.primary,
    },
    propsForLabels: {
      fontSize: 12,
    },
    formatYLabel: formatYAxisLabel || ((value: string) => value),
  };

  try {
    return (
      <View style={styles.container}>
        <LineChart
          data={data}
          width={chartWidth}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withInnerLines={false}
          withOuterLines={false}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={true}
          segments={4}
          yAxisLabel=""
          yAxisSuffix=" min"
          yAxisInterval={1}
        />
      </View>
    );
  } catch (error) {
    console.error('Erro ao renderizar gráfico:', error);
    return (
      <View style={styles.container}>
        <View style={styles.noDataContainer}>
          <Typography variant="bodyMedium" style={{ color: semanticColors.error, textAlign: 'center' }}>
            Erro ao carregar gráfico
          </Typography>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  noDataContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default UsageLineChart; 