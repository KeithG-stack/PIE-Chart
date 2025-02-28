import { Box, Button, Typography, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DataSaverOnIcon from '@mui/icons-material/DataSaverOn';

// Sample data sets
const sampleDataSets = {
  monthlySales: [
    { category: 'Jan', value: 4200 },
    { category: 'Feb', value: 3800 },
    { category: 'Mar', value: 5100 },
    { category: 'Apr', value: 4900 },
    { category: 'May', value: 6300 },
    { category: 'Jun', value: 5800 },
  ],
  productCategories: [
    { category: 'Electronics', value: 35 },
    { category: 'Clothing', value: 28 },
    { category: 'Books', value: 17 },
    { category: 'Home & Kitchen', value: 12 },
    { category: 'Toys', value: 8 },
  ],
  quarterlyGrowth: [
    { category: 'Q1 2023', value: 4.5 },
    { category: 'Q2 2023', value: 5.7 },
    { category: 'Q3 2023', value: 3.2 },
    { category: 'Q4 2023', value: 6.8 },
    { category: 'Q1 2024', value: 7.2 },
  ],
  marketShare: [
    { category: 'Company A', value: 38 },
    { category: 'Company B', value: 25 },
    { category: 'Company C', value: 19 },
    { category: 'Company D', value: 12 },
    { category: 'Others', value: 6 },
  ],
};

const SampleData = ({ setChartData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const loadSampleData = (dataKey) => {
    setChartData(sampleDataSets[dataKey]);
    handleClose();
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        Need some data to start?
      </Typography>
      <Button
        size="small"
        startIcon={<DataSaverOnIcon />}
        endIcon={<MoreVertIcon />}
        variant="outlined"
        onClick={handleClick}
      >
        Load Sample Data
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={() => loadSampleData('monthlySales')}>
          Monthly Sales Data
        </MenuItem>
        <MenuItem onClick={() => loadSampleData('productCategories')}>
          Product Categories
        </MenuItem>
        <MenuItem onClick={() => loadSampleData('quarterlyGrowth')}>
          Quarterly Growth
        </MenuItem>
        <MenuItem onClick={() => loadSampleData('marketShare')}>
          Market Share
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default SampleData;