import PropTypes from 'prop-types';
import { useEffect } from 'react';
// routes
import { useRouter } from 'src/routes/hooks';
//
import { useCookies } from 'react-cookie';

// ----------------------------------------------------------------------

export default function AuthGuard({ children }) {
  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
