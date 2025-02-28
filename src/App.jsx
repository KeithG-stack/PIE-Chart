import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Header from './components/layout/header';
import Dashboard from './components/layout/Dashboard';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState({
    type: 'bar',
    title: 'My Chart',
    xAxis: 'category',
    yAxis: 'value',
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app">
        <Header />
        <Dashboard 
          chartData={chartData} 
          setChartData={setChartData} 
          chartConfig={chartConfig} 
          setChartConfig={setChartConfig} 
        />
      </div>
    </ThemeProvider>
  );
}

export default App;