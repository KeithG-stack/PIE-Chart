import { 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem, 
    FormHelperText 
  } from '@mui/material';
  
  // Text Field with error handling
  export const FormTextField = ({ 
    label, 
    name, 
    control, 
    errors, 
    register, 
    ...props 
  }) => {
    return (
      <TextField
        fullWidth
        margin="normal"
        label={label}
        {...register(name)}
        error={!!errors[name]}
        helperText={errors[name]?.message}
        {...props}
      />
    );
  };
  
  // Select Field with error handling
  export const FormSelectField = ({ 
    label, 
    name, 
    options, 
    control, 
    errors, 
    register, 
    ...props 
  }) => {
    return (
      <FormControl 
        fullWidth 
        margin="normal" 
        error={!!errors[name]}
      >
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          labelId={`${name}-label`}
          label={label}
          {...register(name)}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errors[name] && (
          <FormHelperText>{errors[name].message}</FormHelperText>
        )}
      </FormControl>
    );
  };