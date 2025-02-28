/**
 * Returns a color scheme based on the selected option
 * @param {string} schemeKey - The color scheme key (default, pastel, bold, monochrome)
 * @param {object} theme - The MUI theme object
 * @returns {string[]} - Array of color values
 */
export const getColorScheme = (schemeKey, theme) => {
    const colorSchemes = {
      default: [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        '#2e7d32',
        '#ed6c02',
        '#9c27b0',
        '#0288d1',
      ],
      pastel: [
        '#90caf9',
        '#a5d6a7',
        '#ffcc80',
        '#ef9a9a',
        '#ce93d8',
        '#b39ddb',
      ],
      bold: [
        '#f44336',
        '#2196f3',
        '#4caf50',
        '#ff9800',
        '#9c27b0',
        '#00bcd4',
      ],
      monochrome: [
        theme.palette.primary.dark,
        theme.palette.primary.main,
        theme.palette.primary.light,
        '#90caf9',
        '#bbdefb',
        '#e3f2fd',
      ],
    };
  
    return colorSchemes[schemeKey] || colorSchemes.default;
  };
  
  /**
   * Formats data for CSV export
   * @param {Array} data - The chart data
   * @returns {string} - CSV formatted string
   */
  export const formatDataForExport = (data) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };
  
  /**
   * Parses CSV data for import
   * @param {string} csvText - CSV text to parse
   * @returns {Array} - Parsed data objects
   */
  export const parseCSVData = (csvText) => {
    if (!csvText) return [];
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        // Try to convert to number if possible
        const value = values[index];
        obj[header] = isNaN(value) ? value : Number(value);
        return obj;
      }, {});
    });
  };
  
  /**
   * Validates data format for chart compatibility
   * @param {Array} data - Data to validate
   * @returns {boolean} - Whether data is valid
   */
  export const validateChartData = (data) => {
    if (!Array.isArray(data) || data.length === 0) return false;
    
    // Check if data has required properties
    return data.every(item => 
      item.hasOwnProperty('category') && 
      item.hasOwnProperty('value') &&
      typeof item.value === 'number'
    );
  };
  
  /**
   * Generates example data for demonstration
   * @param {string} type - Chart type
   * @returns {Array} - Sample data
   */
  export const generateExampleData = (type) => {
    switch (type) {
      case 'bar':
      case 'line':
        return [
          { category: 'Jan', value: 400 },
          { category: 'Feb', value: 300 },
          { category: 'Mar', value: 500 },
          { category: 'Apr', value: 200 },
          { category: 'May', value: 600 },
          { category: 'Jun', value: 450 },
        ];
      case 'pie':
        return [
          { category: 'Category A', value: 35 },
          { category: 'Category B', value: 25 },
          { category: 'Category C', value: 20 },
          { category: 'Category D', value: 15 },
          { category: 'Other', value: 5 },
        ];
      default:
        return [];
    }
  };