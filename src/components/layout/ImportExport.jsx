import { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { parseCSVData, formatDataForExport, validateChartData } from '../../../utils/chartUtils';

const ImportExport = ({ chartData, setChartData }) => {
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvData, setCsvData] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file type
    if (file.type !== 'text/csv') {
      setAlert({
        open: true,
        message: 'Please upload a CSV file',
        severity: 'error'
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCsvData(e.target.result);
    };
    reader.readAsText(file);
  };

  // Import data from CSV
  const handleImport = () => {
    try {
      const parsedData = parseCSVData(csvData);
      
      if (!validateChartData(parsedData)) {
        setAlert({
          open: true,
          message: 'Invalid data format. CSV must have category and value columns.',
          severity: 'error'
        });
        return;
      }
      
      setChartData(parsedData);
      setImportDialogOpen(false);
      setCsvData('');
      
      setAlert({
        open: true,
        message: `Successfully imported ${parsedData.length} data points`,
        severity: 'success'
      });
    } catch (error) {
      setAlert({
        open: true,
        message: `Error parsing CSV: ${error.message}`,
        severity: 'error'
      });
    }
  };

  // Export data to CSV
  const handleExport = () => {
    if (chartData.length === 0) {
      setAlert({
        open: true,
        message: 'No data to export',
        severity: 'warning'
      });
      return;
    }
    
    const csvContent = formatDataForExport(chartData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'chart_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy data to clipboard
  const handleCopyToClipboard = () => {
    if (chartData.length === 0) {
      setAlert({
        open: true,
        message: 'No data to copy',
        severity: 'warning'
      });
      return;
    }
    
    const csvContent = formatDataForExport(chartData);
    navigator.clipboard.writeText(csvContent).then(
      () => {
        setAlert({
          open: true,
          message: 'Data copied to clipboard',
          severity: 'success'
        });
      },
      (err) => {
        setAlert({
          open: true,
          message: `Could not copy data: ${err}`,
          severity: 'error'
        });
      }
    );
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Import/Export Data
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button 
            variant="outlined" 
            startIcon={<UploadFileIcon />}
            onClick={() => setImportDialogOpen(true)}
            size="small"
          >
            Import
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<FileDownloadIcon />}
            onClick={handleExport}
            size="small"
            disabled={chartData.length === 0}
          >
            Export
          </Button>
          
          <Button 
            variant="outlined" 
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyToClipboard}
            size="small"
            disabled={chartData.length === 0}
          >
            Copy
          </Button>
        </Stack>
      </Box>
      
      {/* Import Dialog */}
      <Dialog 
        open={importDialogOpen} 
        onClose={() => setImportDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Import Data</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Upload a CSV file or paste CSV data directly. The CSV should have 'category' and 'value' columns.
          </Typography>
          
          <Button
            variant="outlined"
            component="label"
            sx={{ mb: 2 }}
          >
            Choose CSV File
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          
          <TextField
            label="Or paste CSV data here"
            multiline
            rows={10}
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="category,value
Product A,100
Product B,200"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            variant="contained"
            disabled={!csvData.trim()}
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert 
          onClose={() => setAlert({ ...alert, open: false })} 
          severity={alert.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ImportExport;