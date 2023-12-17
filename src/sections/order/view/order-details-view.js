import { useState } from 'react';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Scrollbar from 'src/components/scrollbar';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';

export default function OrderDetailsView({ data }) {
  return (
    <Container style={{ maxWidth: 3000, padding: 0 }}>
      <Card>
        {data.length > 0 && (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Item No</TableCell>
                    <TableCell>Supplier</TableCell>
                    <TableCell>Demand</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Operation</TableCell>
                    <TableCell>Order Date</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Rev</TableCell>
                  </TableRow>
                </TableHead>
                {data.map((item) => (
                  <TableRow>
                    <TableCell>{item.itemno}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>{item.demand}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.duedate}</TableCell>
                    <TableCell>{item.operation}</TableCell>
                    <TableCell>{item.orderdate}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.rev}</TableCell>
                  </TableRow>
                ))}
                <TableBody />
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Card>
    </Container>
  );
}
