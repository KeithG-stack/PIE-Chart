import { useState } from 'react';
import { Box, Grid, Paper, Tab, Tabs, Divider } from '@mui/material';
import DataInputForm from '../forms/DataInputForm';
import ChartConfigForm from '../forms/ChartConfigForm';
import ImportExport from './ImportExport';
import BarChart from '../charts/BarChart';
import LineChart from '../charts/LineChart';
import PieChart from '../charts/PieChart';

const Dashboard = ({ chartData, setChartData, chartConfig, setChartConfig }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Render the selected chart type
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          Please enter data to generate a chart
        </Box>
      );
    }

    switch (chartConfig.type) {
      case 'bar':
        return <BarChart data={chartData} config={chartConfig} />;
      case 'line':
        return <LineChart data={chartData} config={chartConfig} />;
      case 'pie':
        return <PieChart data={chartData} config={chartConfig} />;
      default:
        return <BarChart data={chartData} config={chartConfig} />;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="dashboard tabs"
              sx={{ mb: 2 }}
            >
              <Tab label="Data Input" />
              <Tab label="Chart Config" />
            </Tabs>

            {tabValue === 0 && (
              <DataInputForm 
                chartData={chartData} 
                setChartData={setChartData} 
              />
            )}
            
            {tabValue === 1 && (
              <ChartConfigForm 
                chartConfig={chartConfig} 
                setChartConfig={setChartConfig} 
              />
            )}
            
            <Divider sx={{ my: 2 }} />
            <ImportExport chartData={chartData} setChartData={setChartData} />
          </Paper>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {renderChart()}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;