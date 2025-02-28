import { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  FormLabel,
  TextField,
  InputAdornment,
  Stack,
  Button,
  Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormTextField, FormSelectField } from './FormFields';

// Form validation schema
const chartConfigSchema = z.object({
  type: z.enum(['bar', 'line', 'pie'], {
    invalid_type_error: 'Please select a chart type',
  }),
  title: z.string().min(1, 'Chart title is required'),
  xAxis: z.string().min(1, 'X-axis label is required'),
  yAxis: z.string().min(1, 'Y-axis label is required'),
  showLegend: z.boolean().default(true),
  aspectRatio: z.number().min(0.5).max(3),
  colors: z.enum(['default', 'pastel', 'bold', 'monochrome']),
});

const ChartConfigForm = ({ chartConfig, setChartConfig }) => {
  // Form handling with react-hook-form
  const { 
    register, 
    handleSubmit, 
    control,
    reset,
    setValue,
    watch,
    formState: { errors } 
  } = useForm({
    resolver: zodResolver(chartConfigSchema),
    defaultValues: {
      type: 'bar',
      title: 'My Chart',
      xAxis: 'Category',
      yAxis: 'Value',
      showLegend: true,
      aspectRatio: 1,
      colors: 'default',
    }
  });
  
  // Watch for chart type changes
  const chartType = watch('type');
  
  // Initialize form with current chart config
  useEffect(() => {
    if (chartConfig) {
      reset({
        type: chartConfig.type || 'bar',
        title: chartConfig.title || 'My Chart',
        xAxis: chartConfig.xAxis || 'Category',
        yAxis: chartConfig.yAxis || 'Value',
        showLegend: chartConfig.showLegend !== undefined ? chartConfig.showLegend : true,
        aspectRatio: chartConfig.aspectRatio || 1,
        colors: chartConfig.colors || 'default',
      });
    }
  }, [reset, chartConfig]);

  // Form submission handler
  const onSubmit = (data) => {
    setChartConfig(data);
  };

  // Reset to defaults handler
  const handleResetDefaults = () => {
    reset({
      type: 'bar',
      title: 'My Chart',
      xAxis: 'Category',
      yAxis: 'Value',
      showLegend: true,
      aspectRatio: 1,
      colors: 'default',
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Chart Configuration
      </Typography>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel component="legend">Chart Type</FormLabel>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                <FormControlLabel value="bar" control={<Radio />} label="Bar" />
                <FormControlLabel value="line" control={<Radio />} label="Line" />
                <FormControlLabel value="pie" control={<Radio />} label="Pie" />
              </RadioGroup>
            )}
          />
          {errors.type && (
            <Typography color="error" variant="caption">
              {errors.type.message}
            </Typography>
          )}
        </FormControl>
        
        <FormTextField
          label="Chart Title"
          name="title"
          register={register}
          errors={errors}
        />
        
        {chartType !== 'pie' && (
          <>
            <FormTextField
              label="X-Axis Label"
              name="xAxis"
              register={register}
              errors={errors}
            />
            
            <FormTextField
              label="Y-Axis Label"
              name="yAxis"
              register={register}
              errors={errors}
            />
          </>
        )}
        
        <FormControl fullWidth margin="normal">
          <FormLabel component="legend">Show Legend</FormLabel>
          <Controller
            name="showLegend"
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field} value={field.value.toString()}>
                <FormControlLabel 
                  value="true" 
                  control={<Radio />} 
                  label="Yes" 
                  onChange={() => setValue('showLegend', true)}
                />
                <FormControlLabel 
                  value="false" 
                  control={<Radio />} 
                  label="No" 
                  onChange={() => setValue('showLegend', false)}
                />
              </RadioGroup>
            )}
          />
        </FormControl>
        
        <FormControl fullWidth margin="normal">
          <FormLabel component="legend">Aspect Ratio</FormLabel>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ px: 1 }}>
            <Typography variant="body2">Narrow</Typography>
            <Controller
              name="aspectRatio"
              control={control}
              render={({ field }) => (
                <Slider
                  {...field}
                  min={0.5}
                  max={3}
                  step={0.1}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => field.onChange(value)}
                />
              )}
            />
            <Typography variant="body2">Wide</Typography>
          </Stack>
        </FormControl>
        
        <FormSelectField
          label="Color Scheme"
          name="colors"
          register={register}
          errors={errors}
          options={[
            { value: 'default', label: 'Default' },
            { value: 'pastel', label: 'Pastel' },
            { value: 'bold', label: 'Bold' },
            { value: 'monochrome', label: 'Monochrome' }
          ]}
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            type="submit" 
            fullWidth
          >
            Apply Changes
          </Button>
          <Button 
            variant="outlined"
            onClick={handleResetDefaults}
          >
            Reset
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default ChartConfigForm;