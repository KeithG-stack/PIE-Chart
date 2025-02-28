import { useState, useEffect, useCallback } from 'react';
import { validateChartData, formatDataForExport } from '../utils/chartUtils';
import { sortDataByValue, aggregateData, normalizeToPercentage } from '../utils/dataTransformers';

/**
 * Custom hook for managing chart data with persistence and transformations
 */
const useChartData = (initialData = []) => {
  const [data, setData] = useState(initialData);
  const [transformedData, setTransformedData] = useState(initialData);
  const [transformOptions, setTransformOptions] = useState({
    sort: null, // 'asc', 'desc', or null
    normalize: false,
    aggregate: null, // 'sum', 'avg', 'max', 'min', or null
  });

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('chartData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (validateChartData(parsedData)) {
          setData(parsedData);
        }
      }
    } catch (error) {
      console.error('Error loading chart data:', error);
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('chartData', JSON.stringify(data));
    } catch (error) {
      console.error('Error saving chart data:', error);
    }
  }, [data]);

  // Apply transformations when data or transform options change
  useEffect(() => {
    let result = [...data];

    // Apply sorting if specified
    if (transformOptions.sort) {
      result = sortDataByValue(result, transformOptions.sort);
    }

    // Apply normalization if enabled
    if (transformOptions.normalize) {
      result = normalizeToPercentage(result);
    }

    setTransformedData(result);
  }, [data, transformOptions]);

  // Add a new data point
  const addDataPoint = useCallback((dataPoint) => {
    if (!dataPoint.category || typeof dataPoint.value !== 'number') {
      throw new Error('Invalid data point format');
    }
    setData(prevData => [...prevData, dataPoint]);
  }, []);

  // Add multiple data points
  const addDataPoints = useCallback((dataPoints) => {
    if (!Array.isArray(dataPoints) || !validateChartData(dataPoints)) {
      throw new Error('Invalid data format');
    }
    setData(prevData => [...prevData, ...dataPoints]);
  }, []);

  // Update a data point by index
  const updateDataPoint = useCallback((index, updates) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], ...updates };
      return newData;
    });
  }, []);

  // Remove a data point by index
  const removeDataPoint = useCallback((index) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  }, []);

  // Clear all data
  const clearData = useCallback(() => {
    setData([]);
  }, []);

  // Export data as CSV
  const exportToCSV = useCallback(() => {
    return formatDataForExport(data);
  }, [data]);

  // Set transform options
  const setTransformOption = useCallback((option, value) => {
    setTransformOptions(prev => ({
      ...prev,
      [option]: value
    }));
  }, []);

  return {
    data,
    transformedData,
    transformOptions,
    addDataPoint,
    addDataPoints,
    updateDataPoint,
    removeDataPoint,
    clearData,
    exportToCSV,
    setTransformOption,
  };
};

export default useChartData;