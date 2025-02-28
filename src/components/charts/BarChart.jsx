import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { BarChart as MuiBarChart } from '@mui/x-charts/BarChart';
import { getColorScheme } from '../../../utils/chartUtils';

const BarChart = ({ data, config }) => {

    const theme = useTheme();
    const [chartWidth, setChartWidth] = useState(500);
    const [chartHeight, setChartHeight] = useState(300);
  
    // Get color scheme based on config
    const colors = getColorScheme(config.colors, theme);
    
    // Calculate chart dimensions based on aspect ratio
    useEffect(() => {
        const updateDimensions = () => {
        const containerWidth = document.getElementById('chart-container')?.offsetWidth || 500;
        setChartWidth(containerWidth - 40); // account for padding
        setChartHeight((containerWidth - 40) / config.aspectRatio);
        };
        
        // Initial calculation
        updateDimensions();
        
        // Add resize listener
        window.addEventListener('resize', updateDimensions);
        
        // Cleanup
        return () => window.removeEventListener('resize', updateDimensions);
  }, [config.aspectRatio]);
  
  // Format data for MUI X Charts
  const chartData = {
    
    xAxis: [
      {
        id: 'barCategories',
        data: data.map(item => item.category),
        scaleType: 'band',
        label: config.xAxis,
      },
    ],
    series: [
      {
        data: data.map(item => item.value),
        label: config.yAxis,
        color: colors[0],
      },
    ],
  };

  return (
    <Box id="chart-container" sx={{ width: '100%', height: '100%', minHeight: '300px' }}>
      <MuiBarChart
        title={config.title}
        xAxis={chartData.xAxis}
        series={chartData.series}
        width={chartWidth}
        height={chartHeight}
        colors={colors}
        legend={{ hidden: !config.showLegend }}
      />
    </Box>
  );
};

export default BarChart;