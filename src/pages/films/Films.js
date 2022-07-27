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
import { Alert, Box, CircularProgress, IconButton, TextField } from '@mui/material';

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
            <StyledTableCell align="center" sx={{ width: 180 }}><TextField size="small" variant="outlined" /></StyledTableCell>
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
