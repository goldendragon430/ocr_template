import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useSettingsContext } from 'src/components/settings';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { alpha } from '@mui/material/styles';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';

import { OrderDetailsView, OrderListView } from 'src/sections/order/view';
import AppAreaInstalled from '../app-area-installed';
// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const settings = useSettingsContext();
  const [dashboardData, setDashboardData] = useState([]);
  const [planningResult, setPlanningResult] = useState([]);

  const fetchData = async () => {
    const response = await axios.get(
      `https://intellicast.azurewebsites.net/api/itemplanning?apikey=pk_HIrQ9vdAkRZonkfSqHGiVbzW42wa4mcX&companyid=123456`
    );
    setDashboardData(response.data);
    const response2 = await axios.get(
      `https://intellicast.azurewebsites.net/api/planningresults?apikey=pk_HIrQ9vdAkRZonkfSqHGiVbzW42wa4mcX&companyid=123456`
    );
    setPlanningResult(response2.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [tab, setTab] = useState(1);
  const handleTab = (name, value) => {
    setTab(value);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Tabs
        value={tab}
        onChange={handleTab}
        sx={{
          px: 2.5,
          boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
        }}
      >
        <Tab key={1} value={1} label="Supply & Demand Analysis" />
        <Tab key={2} value={2} label="Planing Results" />
      </Tabs>

      <Grid container spacing={3}>
        {tab === 1 && (
          <>
            <Grid xs={12} md={12} lg={12}>
              {dashboardData.length > 0 && (
                <AppAreaInstalled
                  title=""
                  subheader=""
                  chart={{
                    categories: dashboardData[0].planningdetails.map((item) => item.weekof),
                    series: dashboardData.map((item, key) => ({
                      year: item.itemno,
                      data: [
                        {
                          name: 'Beginning Inventory',
                          data: item.planningdetails.map((d) => d.beginninginventory),
                        },
                        {
                          name: 'Safety stock',
                          data: item.planningdetails.map((d) => d.safetystock),
                        },
                        {
                          name: 'Supply',
                          data: item.planningdetails.map((d) => d.supply),
                        },
                        {
                          name: 'Demand',
                          data: item.planningdetails.map((d) => d.demand),
                        },
                        {
                          name: 'Forecasted Supply',
                          data: item.planningdetails.map((d) => d.forecastedsupply),
                        },
                        {
                          name: 'Net Stock',
                          data: item.planningdetails.map((d) => d.netstock),
                        },
                      ],
                    })),
                  }}
                />
              )}
            </Grid>
            <Grid xs={12} md={12} lg={12}>
              <OrderListView data={dashboardData} />
            </Grid>
          </>
        )}
        {tab === 2 && (
          <Grid xs={12} md={12} lg={12}>
            <div style={{ height: 30 }} />
            <OrderDetailsView data={planningResult} />
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
