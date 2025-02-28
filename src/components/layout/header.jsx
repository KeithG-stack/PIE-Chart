import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          <BarChartIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Data Insights Dashboard
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;