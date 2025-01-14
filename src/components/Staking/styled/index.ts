import { AccordionSummary, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { TransactionAccordion } from 'src/components/StyledComponents/transactions';
import styled from 'styled-components';

export const UndelegationContainer = styled(Box)`
  position: relative;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  min-height: 250px;
  max-height: 350px;
  & > .MuiPaper-root:last-child {
    margin-bottom: 0 !important;
  }
`;

export const NoUndelegationsTypography = styled(Typography)`
  width: 100%;
  margin-bottom: 20px;
  color: gray;
  text-align: center;
  font-size: 22px;
`;

export const UndelegationAccordion = styled(TransactionAccordion)`
  margin: 0 0 12px 0 !important;
  width: 100%;
  border: '1px solid #312870';
`;

export const UndelegationAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  outline: 'none !important',
  flexWrap: 'wrap',
  width: '100%',
  padding: '0',
  '& .MuiSvgIcon-root': {
    color: theme.palette.text.primary,
  },
  '& .MuiAccordionSummary-expandIconWrapper': {
    width: '100% !important',
    justifyContent: 'center !important',
    alignItems: 'center !important',
    backgroundColor: 'rgba(76, 47, 252, 0.1)',
    padding: '0.25rem',
    marginLeft: '0 !important',
    border: '1px solid #312870',
    borderTop: 'none',
    borderRadius: '0 0 10px 10px',
  },
}));

export const UndelegationGridContainer = styled(Grid)(({ theme: _ }) => ({
  padding: '0 10px 10px',
  backgroundColor: 'rgba(76,47,252,0.1)',
  width: '100% !important',
  border: '1px solid #312870',
  borderRadius: '10px',
  transition: 'all .2s linear',
}));
