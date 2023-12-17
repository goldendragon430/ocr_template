import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import LinearProgress from '@mui/material/LinearProgress';
// utils
import { fPercent, fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function EcommerceSalesOverview({ title, subheader, data, ...other }) {
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Stack spacing={4} sx={{ px: 3, pt: 3, pb: 5 }}>
        {data.map((progress, key) => (
          <ProgressItem key={progress.label} progress={progress} info={key} />
        ))}
      </Stack>
    </Card>
  );
}

EcommerceSalesOverview.propTypes = {
  data: PropTypes.array,
  subheader: PropTypes.string,
  title: PropTypes.string,
};

// ----------------------------------------------------------------------

function ProgressItem({ progress, info }) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={
          (info % 3 === 0 && 'error') ||
          (info % 3 === 1 && 'warning') ||
          (info % 3 === 2 && 'primary') ||
          'primary'
        }
      />
    </Stack>
  );
}

ProgressItem.propTypes = {
  progress: PropTypes.object,
};
