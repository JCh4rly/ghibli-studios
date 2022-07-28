import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ClearIcon from "@mui/icons-material/Clear";
import Paper from '@mui/material/Paper';
import useFilms from '../../hooks/useFilms';
import { Alert, Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, Slider, TextField } from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Films = () => {
  const [isLoading, rows, errors] = useFilms();
  const [filteredRows, setFilteredRows] = React.useState(null);
  const [filter, setFilter] = React.useState({});
  const [releaseFilter, setReleaseFilter] = React.useState({ enabled: true, value: [1980, 2000] });
  const [open, setOpen] = React.useState(false);

  const renderFieldFilter = React.useCallback((field) => <>
    <Box sx={{ display: 'flex' }}>
      <TextField 
        sx={{ backgroundColor: 'white' }} 
        size="small" 
        variant="outlined"
        value={filter[field]}
        onChange={(e) => setFilter({ ...filter, [field]: e.target.value })}
      />
      <IconButton onClick={() => setFilter({ ...filter, [field]: '' })}>
        <ClearIcon />
      </IconButton>
    </Box>
  </>, [filter]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const RangeFilter = ({ open, value, handleClose }) => {
    const [filter, setFilter] = React.useState(value);
    const setValue = (value) => setFilter({ ...filter, value });
    const setEnabled = (enabled) => setFilter({ ...filter, enabled });
    const minDistance = 1;
    const min = 1960;
    const max = 2020;
    const handleChange = (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }
  
      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(newValue[0], 100 - minDistance);
          setValue([clamped, clamped + minDistance]);
        } else {
          const clamped = Math.max(newValue[1], minDistance);
          setValue([clamped - minDistance, clamped]);
        }
      } else {
        setValue(newValue);
      }
    };

    return <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Release Date Filter</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControlLabel control={<Checkbox checked={filter.enabled} onChange={(e) => setEnabled(e.target.checked)} />} label="Enabled" />
            <Slider
              disabled={!filter.enabled}
              min={min}
              max={max}
              value={filter.value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              disableSwap
              sx={{ marginX: 2, marginY: 2 }}
              />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  }

  React.useEffect(() => {
    const match = (field, item) => !filter[field] || item[field].match(new RegExp(filter[field], 'i'));
    const filterRows = (item) => 
      match('title', item) && match('director', item) && match('producer', item)

    if (rows) {
      setFilteredRows(rows.filter(filterRows));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, rows])

  if (isLoading) {
    return <Box sx={{ display: 'flex' }}>
      <CircularProgress />
    </Box>
  }

  if (errors) {
    return <Alert severity="error">An unexpected error occurred!</Alert>
  }

  if (!filteredRows) {
    return null
  }

  return <>
    <RangeFilter open={open} value={releaseFilter} handleClose={handleClose} />
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">Title</StyledTableCell>
            <StyledTableCell align="center">Description</StyledTableCell>
            <StyledTableCell align="center">Director</StyledTableCell>
            <StyledTableCell align="center">Producer</StyledTableCell>
            <StyledTableCell align="center">Release Date</StyledTableCell>
          </TableRow>          
        </TableHead>
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="center" sx={{ width: 180 }}>{ renderFieldFilter("title") }</StyledTableCell>
            <StyledTableCell align="center"></StyledTableCell>
            <StyledTableCell align="center" sx={{ width: 180 }}>{ renderFieldFilter("director") }</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: 180 }}>{ renderFieldFilter("producer") }</StyledTableCell>
            <StyledTableCell align="center" sx={{ width: 180 }}><span onClick={handleOpen}>RANGE</span></StyledTableCell>
          </StyledTableRow>
          {filteredRows.map((row) => (
            <StyledTableRow key={row.title}>
              <StyledTableCell component="th" scope="row" align="center">
                {row.title}
              </StyledTableCell>
              <StyledTableCell>{row.description}</StyledTableCell>
              <StyledTableCell align="center">{row.director}</StyledTableCell>
              <StyledTableCell align="center">{row.producer}</StyledTableCell>
              <StyledTableCell align="center">{row.release_date}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>;
}

export default Films;
