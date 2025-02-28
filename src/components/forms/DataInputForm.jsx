import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Stack, 
  Paper, 
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField } from './FormFields';
import SampleData from '../layout/SampleData';

// Form validation schema
const dataPointSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  value: z.number({
    required_error: 'Value is required',
    invalid_type_error: 'Value must be a number',
  }).min(0, 'Value must be a positive number'),
});

const DataInputForm = ({ chartData, setChartData }) => {
  // Form handling with react-hook-form
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(dataPointSchema),
    defaultValues: {
      category: '',
      value: '',
    }
  });

  // Form submission handler
  const onSubmit = (data) => {
    // Convert value to number
    const newDataPoint = {
      ...data,
      value: Number(data.value)
    };
    
    // Add to chart data
    setChartData([...chartData, newDataPoint]);
    
    // Reset form
    reset();
  };

  // Remove data point handler
  const handleRemoveDataPoint = (index) => {
    const updatedData = [...chartData];
    updatedData.splice(index, 1);
    setChartData(updatedData);
  };

  // Clear all data handler
  const handleClearAll = () => {
    setChartData([]);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Enter Chart Data
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormTextField
          label="Category"
          name="category"
          register={register}
          errors={errors}
        />
        
        <FormTextField
          label="Value"
          name="value"
          type="number"
          register={register}
          errors={errors}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          sx={{ mt: 2 }}
          fullWidth
        >
          Add Data Point
        </Button>
      </form>
      
      {chartData.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">
              Current Data Points ({chartData.length})
            </Typography>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={handleClearAll}
            >
              Clear All
            </Button>
          </Stack>
          
          <Paper variant="outlined" sx={{ mt: 1, maxHeight: '200px', overflow: 'auto' }}>
            <List dense>
              {chartData.map((point, index) => (
                <Box key={`${point.category}-${index}`}>
                  {index > 0 && <Divider />}
                  <ListItem
                    secondaryAction={
                      <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveDataPoint(index)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={point.category}
                      secondary={`Value: ${point.value}`}
                    />
                  </ListItem>
                </Box>
              ))}
            </List>
          </Paper>
        </Box>
      )}
      
      {chartData.length === 0 && (
        <SampleData setChartData={setChartData} />
      )}
    </Box>
  );
};

export default DataInputForm;