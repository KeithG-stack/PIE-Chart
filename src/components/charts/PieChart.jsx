import { useState, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import { PieChart as MuiPieChart } from '@mui/x-charts/PieChart';
import { getColorScheme } from '../../../utils/chartUtils';

const PieChart = ({ data, config }) => {

    const theme = useTheme();
    const [chartSize, setChartSize] = useState(300);
    
    // Get color scheme based on config
    const colors = getColorScheme(config.colors, theme);
    
    // Calculate chart dimensions
    useEffect(() => {
        const updateDimensions = () => {
        const containerWidth = document.getElementById('chart-container')?.offsetWidth || 500;
        const containerHeight = document.getElementById('chart-container')?.offsetHeight || 300;
        
        // Use the smaller dimension for the pie chart
        const size = Math.min(containerWidth - 40, containerHeight - 40);
        setChartSize(size);
        };
        
        // Initial calculation
        updateDimensions();
        
        // Add resize listener
        window.addEventListener('resize', updateDimensions);
        
        // Cleanup
        return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // Format data for MUI X Charts
    const chartData = data.map((item, index) => ({
        id: index,
        value: item.value,
        label: item.category,
        color: colors[index % colors.length],
    }));

    return (
        <Box 
        id="chart-container" 
        sx={{ 
            width: '100%', 
            height: '100%', 
            minHeight: '300px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}
        >
            
      <MuiPieChart
        series={[
          {
            data: chartData,
            highlightScope: { faded: 'global', highlighted: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          },
        ]}
        width={chartSize}
        height={chartSize}
        legend={{ hidden: !config.showLegend }}
        title={config.title}
      />
    </Box>
  );
};

export default PieChart;