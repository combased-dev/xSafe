import { Box } from '@mui/material';
import { useCountdown } from 'src/utils/useCountdown';
import DateTimeDisplay from './DateTimeDisplay';

const ExpiredNotice = () => (
  <div className="expired-notice">
    <span>Nothing</span>
  </div>
);

interface ShowCounterProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const ShowCounter = ({ days, hours, minutes, seconds }: ShowCounterProps) => (
  <div className="show-counter">
    <Box>
      <DateTimeDisplay value={days} type={'d'} />{' '}
      <DateTimeDisplay value={hours} type={'h'} />{' '}
      <DateTimeDisplay value={minutes} type={'m'} />{' '}
      <DateTimeDisplay value={seconds} type={'s'} />
    </Box>
  </div>
);

interface CountdownTimerProps {
    targetDate: number;
}
const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);

  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  }
  return (
    <ShowCounter
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
};

export default CountdownTimer;
