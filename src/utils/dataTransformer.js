/**
 * Transforms raw data to be compatible with charts
 * @param {Array} data - Raw data array
 * @param {Object} mapping - Field mapping configuration
 * @returns {Array} - Transformed data
 */
export const transformData = (data, mapping) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
  
    return data.map(item => ({
      category: item[mapping.categoryField] || '',
      value: Number(item[mapping.valueField]) || 0
    }));
  };
  
  /**
   * Sorts chart data by value
   * @param {Array} data - Chart data array
   * @param {string} direction - 'asc' or 'desc'
   * @returns {Array} - Sorted data
   */
  export const sortDataByValue = (data, direction = 'desc') => {
    if (!data || !Array.isArray(data)) return [];
    
    return [...data].sort((a, b) => 
      direction === 'asc' 
        ? a.value - b.value
        : b.value - a.value
    );
  };
  
  /**
   * Groups data by category and aggregates values
   * @param {Array} data - Raw data array
   * @param {string} categoryField - Field to group by
   * @param {string} valueField - Field to aggregate
   * @param {string} aggregation - Aggregation method (sum, avg, max, min)
   * @returns {Array} - Aggregated data
   */
  export const aggregateData = (data, categoryField, valueField, aggregation = 'sum') => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
  
    // Group data by category
    const grouped = data.reduce((acc, item) => {
      const category = item[categoryField] || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(Number(item[valueField]) || 0);
      return acc;
    }, {});
  
    // Apply aggregation function
    return Object.keys(grouped).map(category => {
      const values = grouped[category];
      let aggregatedValue = 0;
      
      switch (aggregation) {
        case 'sum':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'max':
          aggregatedValue = Math.max(...values);
          break;
        case 'min':
          aggregatedValue = Math.min(...values);
          break;
        default:
          aggregatedValue = values.reduce((sum, val) => sum + val, 0);
      }
  
      return {
        category,
        value: aggregatedValue
      };
    });
  };
  
  /**
   * Normalizes data to percentages
   * @param {Array} data - Data array
   * @returns {Array} - Normalized data
   */
  export const normalizeToPercentage = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return [];
    }
  
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return data.map(item => ({
      ...item,
      value: total > 0 ? (item.value / total) * 100 : 0
    }));
  };
  
  /**
   * Converts date string categories to formatted dates
   * @param {Array} data - Data array
   * @param {string} dateFormat - Output date format
   * @returns {Array} - Data with formatted dates
   */
  export const formatDateCategories = (data, dateFormat = 'MMM yyyy') => {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => {
      // Skip if not a valid date
      if (!isValidDate(item.category)) {
        return item;
      }
      
      const date = new Date(item.category);
      return {
        ...item,
        category: formatDate(date, dateFormat)
      };
    });
  };
  
  /**
   * Checks if a string can be parsed as a valid date
   * @param {string} dateString - Date string to check
   * @returns {boolean} - Whether the string is a valid date
   */
  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  /**
   * Simple date formatter (basic implementation)
   * @param {Date} date - Date to format
   * @param {string} format - Format string
   * @returns {string} - Formatted date string
   */
  const formatDate = (date, format) => {
    // This is a simple implementation. In a real app, you might use date-fns or similar
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    if (format === 'MMM yyyy') {
      return `${months[date.getMonth()]} ${date.getFullYear()}`;
    }
    
    return date.toLocaleDateString();
  };