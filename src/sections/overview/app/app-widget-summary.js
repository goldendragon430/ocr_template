import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Icon } from '@iconify/react';
// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, color, icon, sx, ...other }) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        borderLeft: `3px solid ${color}`,
        borderRadius: 1,
        p: 3,
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="subtitle2" sx={{ color }}>
          {title}
        </Typography>

        <Typography variant="h3">{total}</Typography>
      </Box>
      <Icon icon={icon} width={40} style={{ opacity: 0.3 }} />
      {/* <Chart type="bar" series={[{ data: series }]} options={chartOptions} width={60} height={36} /> */}
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  chart: PropTypes.object,
  percent: PropTypes.number,
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
