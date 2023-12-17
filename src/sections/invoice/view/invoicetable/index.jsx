import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import styled from '@emotion/styled';
import { useState } from 'react';

const TableRowStyled = styled(TableRow)`
  &:hover {
    background-color: #dddddd;
  }
`;

export const RecentWork = ({rows,onSelect}) => {
  const [selectedId,setSelectedId] = useState(0)
  const onClick = (id)=>{
    setSelectedId(id)
    onSelect(id)
  }

  return (
    <TableContainer sx={{ marginTop: 5 }}>
      <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Purchase Order</TableCell>
            <TableCell align="center">GL Account</TableCell>
            <TableCell align="center">Item Number</TableCell>
            <TableCell align="center">Quantity</TableCell>
            <TableCell align="center">Description</TableCell>
            <TableCell align="center">Unit Price</TableCell>
            <TableCell align="center">Total Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => (
            <TableRowStyled key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 },'background':(row.id==selectedId?'#0066ff26':'') }} onClick={()=>onClick(row.id)}>
              <TableCell align="center">{row.order}</TableCell>
              <TableCell align="center">{row.gl_account}</TableCell>
              <TableCell align="center">{row.item_number}</TableCell>
              <TableCell align="center">{row.quantity}</TableCell>
              <TableCell align="center">{row.description}</TableCell>
              <TableCell align="center">{row.unit_price}</TableCell>
              <TableCell align="center">{row.total_price}</TableCell>
            </TableRowStyled>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
