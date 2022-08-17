/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography } from '@mui/material';
import { OrganizationToken } from 'src/pages/Organization/types';
import { useSelector } from 'react-redux';
import { TokenPresentationProps } from 'src/pages/MultisigDetails/ProposeMultiselectModal/ProposeSendToken';
import {
  getTokenPhotoById,
  accountSelector } from 'src/redux/selectors/accountSelector';
import useTokenPhoto from 'src/utils/useTokenPhoto';
import { StateType } from 'src/redux/slices/accountSlice';
import { createDeepEqualSelector } from 'src/redux/selectors/helpers';
import { useMemo } from 'react';

type TokenPresentationConfig = {
    withPhoto: boolean;
    withTokenAmount: boolean;
    withTokenValue: boolean;
    withPrice: boolean;
};

type TokenPresentationWithPriceProps = TokenPresentationProps & Partial<TokenPresentationConfig>;

const TokenPresentationWithPrice = ({
  identifier,
  withPhoto = true,
  withTokenAmount = true,
  withTokenValue = true,
  withPrice = true }: TokenPresentationWithPriceProps) => {
  const { tokenPhotoJSX } = useTokenPhoto(identifier);

  const selector = useMemo(
    () => createDeepEqualSelector(accountSelector, (state: StateType) => getTokenPhotoById(state, identifier)),
    [identifier]);

  const {
    prettyIdentifier,
    tokenPrice,
    tokenValue,
    tokenAmount,
  } = useSelector<StateType, OrganizationToken>(selector);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {withPhoto && (
        <Box
          sx={{
            p: '.6rem',
            mr: '.55rem',
            borderRadius: '50%',
            backgroundColor: 'rgba(76, 47, 252, 0.1)',
            border: 'solid 1px #ddd',
            '& svg': { width: '26px', height: '26px', m: '0 !important' },
          }}
        >
          {tokenPhotoJSX}
        </Box>
      )}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
      >
        <Box>
          {prettyIdentifier}
        </Box>
        {withPrice && (
          <Typography variant="subtitle2">
            ${tokenPrice}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default TokenPresentationWithPrice;