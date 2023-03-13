import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { isDarkThemeEnabledSelector } from 'src/redux/selectors/appConfigSelector';

import { useBuildNumber } from 'src/utils/useBuildNumber';

const BuildNumber = () => {
  const { buildNumber } = useBuildNumber(7);
  const isDarkThemeEnabled = useSelector(isDarkThemeEnabledSelector);
  return (
    <Typography
      sx={{ color: isDarkThemeEnabled ? '#F0F6FF8a' : '#000' }}
      fontSize="12px"
    >
      Build {buildNumber}
    </Typography>
  );
};

export default BuildNumber;
