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
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Slider, TextField } from '@mui/material';

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
  const applyFilter = (filter) => {
    setReleaseFilter({ ...filter, enabled: true });
    setOpen(false);
  };
  const disableRangeFilter = () => setReleaseFilter({ ...releaseFilter, enabled: false });

  const RangeViewer = ({ filter, onClick, sx }) => <>
    <Paper variant="outlined" sx={{ textAlign: 'center', p: 1, ...sx }} onClick={onClick}>
      {filter.enabled ?  `${filter.value[0]} - ${filter.value[1]}` : ""}
    </Paper>
  </>

  const RangeFilter = ({ open, value, handleClose, onApplyFilter }) => {
    const [filter, setFilter] = React.useState({ ...value, enabled: true });
    const setValue = (value) => setFilter({ ...filter, value });
    const minDistance = 1;
    const min = 1960;
    const max = 2020;
    const handleChange = (event, newValue, activeThumb) => {
      if (!Array.isArray(newValue)) {
        return;
      }
  
      if (newValue[1] - newValue[0] < minDistance) {
        if (activeThumb === 0) {
          const clamped = Math.min(newValue[0], max - minDistance);
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
          <DialogContentText>Move markers to set date range</DialogContentText>
          <Box sx={{ display: 'flex', flexDirection: 'column', marginX: 2 }}>
            <Slider
              min={min}
              max={max}
              value={filter.value}
              onChange={handleChange}
              valueLabelDisplay="auto"
              disableSwap
              sx={{ marginY: 4 }}
              />
            <RangeViewer filter={filter} />  
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={() => onApplyFilter(filter)}>Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  }

  React.useEffect(() => {
    const match = (field, item) => !filter[field] || item[field].match(new RegExp(filter[field], 'i'));
    const matchRange = (release_date) => {
      return (!releaseFilter.enabled || (release_date >= releaseFilter.value[0] && release_date <= releaseFilter.value[1]))
    };
    const filterRows = (item) => match('title', item) 
      && match('director', item) 
      && match('producer', item) 
      && matchRange(Number(item.release_date))

    if (rows) {
      setFilteredRows(rows.filter(filterRows));
    }
  }, [filter, releaseFilter, rows])

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
    <RangeFilter open={open} value={releaseFilter} handleClose={handleClose} onApplyFilter={applyFilter} />
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
            <StyledTableCell align="center" sx={{ width: 180 }}>
              <Box sx={{ display: 'flex' }}>
                <RangeViewer sx={{ width: '100%' }} filter={releaseFilter} onClick={handleOpen} />
                <IconButton onClick={disableRangeFilter}>
                  <ClearIcon />
                </IconButton>
              </Box>
            </StyledTableCell>
          </StyledTableRow>
          {filteredRows.length === 0 && <StyledTableRow>
            <StyledTableCell colSpan={5}>
              <Alert severity="info">No results found</Alert>
            </StyledTableCell>
          </StyledTableRow>}
          {filteredRows.length > 0 && filteredRows.map((row) => (
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
