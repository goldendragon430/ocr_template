import sumBy from 'lodash/sumBy';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { useTheme, alpha } from '@mui/material/styles';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// routes
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// utils
import { fTimestamp } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
//
import { useCookies } from 'react-cookie';
import axios, { endpoints } from 'src/utils/axios';
import InvoiceAnalytic from '../invoice-analytic';
import InvoiceTableRow from '../invoice-table-row';
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Supplier' },
  { id: 'createDate', label: 'Invoice No.' },
  { id: 'dueDate', label: 'Invoice Date' },
  { id: 'price', label: 'Posting Date' },
  { id: 'sent', label: 'Amount' },
  { id: 'status', label: 'Status' },
];

const defaultFilters = {
  name: '',
  service: [],
  status: 'all',
  startDate: null,
  endDate: null,
};

// ----------------------------------------------------------------------

export default function InvoiceListView() {
  const theme = useTheme();
  const [cookies, setCookie] = useCookies(['companyId', 'username', 'name', 'apiKey']);

  const settings = useSettingsContext();

  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'sent' });

  const confirm = useBoolean();
  const data = [
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
    {
      supplier: 'ABC Supplier',
      invoiceNumber: '2002345',
      createDate: '8/1/2023',
      postingDate: '8/1/2023',
      totalAmount: '$500.00',
    },
  ];
  const [tableData, setTableData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
    dateError,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 56 : 76;

  const canReset =
    !!filters.name ||
    !!filters.service.length ||
    filters.status !== 'all' ||
    (!!filters.startDate && !!filters.endDate);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleDeleteRow = useCallback(
    (id) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataInPage.length,
      totalRowsFiltered: dataFiltered.length,
    });
  }, [dataFiltered.length, dataInPage.length, table, tableData]);

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id) => {
      router.push(paths.dashboard.invoice.details(id));
    },
    [router]
  );

  const fetchData = async () => {
    const response = await axios.get(
      `${endpoints.auth.accountspayable}?apikey=${cookies.apiKey}&companyid=${cookies.companyId}`
    );
    if (response?.data) {
      setCardData(response?.data);
    }
  };
  const fetchTableData = async (status) => {
    const response = await axios.get(
      `${endpoints.auth.accountspayabledetail}?apikey=${cookies.apiKey}&companyid=${cookies.companyId}&status=${status}`
    );
    if (response?.data) {
      setTableData(response?.data);
    }
  };
  useEffect(() => {
    fetchData();
    fetchTableData('Draft');
  }, []);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Accounts Payable"
          action={
            <Button
              component={RouterLink}
              href={paths.dashboard.invoice.new}
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
            >
              Add Invoice
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        {/* <h1>Accounts Payable</h1> */}
        <Card
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          <Scrollbar>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
              sx={{ py: 2 }}
            >
              <InvoiceAnalytic
                title="Draft"
                total={cardData.draft ? cardData.draft : 0}
                percent={30}
                // price={getTotalAmount('draft')}
                icon="solar:file-corrupted-bold-duotone"
                color={theme.palette.text.secondary}
                onClick={() => fetchTableData('Draft')}
              />

              <InvoiceAnalytic
                title="In Progress"
                total={cardData.inProcess ? cardData.inProcess : 0}
                percent={20}
                // percent={getPercentByStatus('pending')}
                // price={getTotalAmount('pending')}
                icon="solar:sort-by-time-bold-duotone"
                color={theme.palette.warning.main}
                onClick={() => fetchTableData('In Process')}
              />

              <InvoiceAnalytic
                title="On Hold"
                total={cardData.onHold ? cardData.onHold : 0}
                percent={60}
                // percent={getPercentByStatus('paid')}
                // price={getTotalAmount('paid')}
                icon="solar:file-check-bold-duotone"
                color={theme.palette.success.main}
                onClick={() => fetchTableData('On Hold')}
              />
              <InvoiceAnalytic
                title="Posted"
                total={cardData.posted ? cardData.posted : 0}
                percent={80}
                // percent={getPercentByStatus('overdue')}
                // price={getTotalAmount('overdue')}
                icon="solar:bell-bing-bold-duotone"
                color={theme.palette.error.main}
                onClick={() => fetchTableData('Posted')}
              />
            </Stack>
          </Scrollbar>
        </Card>

        <Card>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={tableData.length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                  onSelectAllRows={(checked) =>
                    table.onSelectAllRows(
                      checked,
                      tableData.map((row) => row.id)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <InvoiceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => {
                          document.location.href = `/dashboard/invoice/new?filename=${row.filename}`;
                        }}
                        onViewRow={() => handleViewRow(row.id)}
                        onEditRow={() => handleEditRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={
          <>
            Are you sure want to delete <strong> {table.selected.length} </strong> items?
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDeleteRows();
              confirm.onFalse();
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}

function applyFilter({ inputData, comparator, filters, dateError }) {
  const { name, status, service, startDate, endDate } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        invoice.invoiceTo.name.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }

  if (status !== 'all') {
    inputData = inputData.filter((invoice) => invoice.status === status);
  }

  if (service.length) {
    inputData = inputData.filter((invoice) =>
      invoice.items.some((filterItem) => service.includes(filterItem.service))
    );
  }

  if (!dateError) {
    if (startDate && endDate) {
      inputData = inputData.filter(
        (invoice) =>
          fTimestamp(invoice.createDate) >= fTimestamp(startDate) &&
          fTimestamp(invoice.createDate) <= fTimestamp(endDate)
      );
    }
  }

  return inputData;
}
