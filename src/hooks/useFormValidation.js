import { useState, useCallback } from 'react';

/**
 * Custom hook for form validation with various validation rules
 */
const useFormValidation = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update a form field value
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  // Set a field as touched when blurred
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  }, []);

  // Validate a specific field with provided validation rules
  const validateField = useCallback((name, value, rules) => {
    if (!rules) return '';

    // Required field validation
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return rules.requiredMessage || `${name} is required`;
    }

    // Minimum length validation
    if (rules.minLength && value.length < rules.minLength) {
      return rules.minLengthMessage || `${name} must be at least ${rules.minLength} characters`;
    }

    // Maximum length validation
    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.maxLengthMessage || `${name} must be at most ${rules.maxLength} characters`;
    }

    // Number validation
    if (rules.isNumber && isNaN(Number(value))) {
      return rules.isNumberMessage || `${name} must be a number`;
    }

    // Minimum value validation
    if (rules.min !== undefined && Number(value) < rules.min) {
      return rules.minMessage || `${name} must be at least ${rules.min}`;
    }

    // Maximum value validation
    if (rules.max !== undefined && Number(value) > rules.max) {
      return rules.maxMessage || `${name} must be at most ${rules.max}`;
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.patternMessage || `${name} is invalid`;
    }

    // Custom validation function
    if (rules.validate) {
      return rules.validate(value, values);
    }

    return '';
  }, [values]);

  // Validate all fields
  const validateForm = useCallback((validationRules) => {
    const newErrors = {};
    let isValid = true;

    Object.entries(validationRules).forEach(([name, rules]) => {
      const error = validateField(name, values[name], rules);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validateField, values]);

  // Handle form submission
  const handleSubmit = useCallback((onSubmit, validationRules) => {
    return (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      // Mark all fields as touched
      const allTouched = Object.keys(validationRules || {}).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);

      // Validate all fields
      const isValid = validateForm(validationRules || {});

      if (isValid) {
        onSubmit(values);
      }

      setIsSubmitting(false);
    };
  }, [validateForm, values]);

  // Reset form to initial or new values
  const resetForm = useCallback((newValues = {}) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateField,
    validateForm,
    resetForm,
    setValues
  };
};

export default useFormValidation;