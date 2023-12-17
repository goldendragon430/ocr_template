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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';

function CollapsibleTableRow({ row }) {
  const collapsible = useBoolean();

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            size="small"
            color={collapsible.value ? 'inherit' : 'default'}
            onClick={collapsible.onToggle}
          >
            <Iconify
              icon={collapsible.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
            />
          </IconButton>
        </TableCell>

        <TableCell>{row.itemno}</TableCell>
        {row.planningdetails.map((dd) => (
          <TableCell>{dd.netstock}</TableCell>
        ))}
      </TableRow>

      <TableRow>
        <TableCell sx={{ py: 0, width: '100%' }} colSpan={11}>
          <Collapse in={collapsible.value} unmountOnExit>
            <Paper
              variant="outlined"
              sx={{
                py: 2,
                pt: 0,
                mt: 2,
                borderRadius: 1.5,
                ...(collapsible.value && {
                  boxShadow: (theme) => theme.customShadows.z20,
                }),
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    {row.planningdetails.map((item) => (
                      <TableCell>{item.weekof}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>Beginning Inventory</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.beginninginventory}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>ForeCast</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.forecastedsupply}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>Supply</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.supply}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>Demand</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.demand}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>Safety Stock</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.safetystock}</TableCell>
                    ))}
                  </TableRow>

                  <TableRow style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)}>
                    <TableCell>Net Stock</TableCell>
                    {row.planningdetails.map((dd) => (
                      <TableCell>{dd.netstock}</TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </Paper>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}
export default function OrderListView({ data }) {
  return (
    <Container style={{ maxWidth: 3000, padding: 0 }}>
      <Card>
        {data.length > 0 && (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Item</TableCell>
                    {data[0].planningdetails.map((item) => (
                      <TableCell>{item.weekof}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {data.map((row) => (
                    <CollapsibleTableRow row={row} />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Card>
    </Container>
  );
}
