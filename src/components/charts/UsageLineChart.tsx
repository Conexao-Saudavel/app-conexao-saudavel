import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { semanticColors } from '../../theme/colors';

interface UsageLineChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
    }[];
  };
  period: 'daily' | 'weekly' | 'monthly';
  formatYAxisLabel?: (value: number) => string;
}

const UsageLineChart: React.FC<UsageLineChartProps> = ({ data, period, formatYAxisLabel }) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 48; // 24px padding on each side

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
    formatYLabel: formatYAxisLabel,
  };

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
});

export default UsageLineChart; 