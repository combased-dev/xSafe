import { Box, Grid, TextField, useMediaQuery } from '@mui/material';
import BigNumber from '@multiversx/sdk-core/node_modules/bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import { Text } from 'src/components/StyledComponents/StyledComponents';
import { MainButton } from 'src/components/Theme/StyledComponents';
// import { PropertyKeyBox } from 'src/components/Utils/PropertKeyBox';
import { useNftAuctionClaimableAmount } from 'src/utils/useNftAuctionClaimableAmount';
import { Address, BigUIntValue } from '@multiversx/sdk-core/out';
import { mutateSmartContractCall } from 'src/contracts/MultisigContract';
import { jewelSwapLendingContractAddress } from 'src/config';
import { currentMultisigContractSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { useSelector } from 'react-redux';
import { inputLabelClasses } from '@mui/material/InputLabel';
import { theme } from '@components/Theme/createTheme';
import { MultiversXLogo } from '@components/Utils/MultiversXLogo';
import { NFTMarketplace } from './types';
import { marketplaces } from './constants';
import * as Styled from './styled';

const ClaimNftAuction = () => {
  const claimableAmountResult = useNftAuctionClaimableAmount();
  const { isInReadOnlyMode } = useOrganizationInfoContext();
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lendInput, setLendInput] = useState(''); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lendInputError, setLendInputError] = useState(false); const claimableAmount = useMemo(() => {
    if (!claimableAmountResult) return 0;

    const { denominatedClaimableAmount } = claimableAmountResult;
    return Number(denominatedClaimableAmount).toLocaleString();
  }, [claimableAmountResult]);

  const currentContract = useSelector(currentMultisigContractSelector);

  const handleLendButtonClick = useCallback(() => {
    if (lendInput === '') {
      setLendInputError(true);
      return;
    }
    mutateSmartContractCall(
      new Address(jewelSwapLendingContractAddress),
      new BigUIntValue(new BigNumber(Number(lendInput)).shiftedBy(18).decimalPlaces(0, BigNumber.ROUND_FLOOR)),
      'lendEgld',
    );
  }, [currentContract?.address]);

  const handleTextInputChange = (event: any) => {
    setLendInputError(false);
    setLendInput(event.target.value);
  };

  return (
    <Box>
      <Box pb={2}>
        <Text fontSize={24} fontWeight={600}>Lend in JewelSwap</Text>
      </Box>
      <Grid container spacing={2} alignContent="stretch">
        {marketplaces.map((marketplace: NFTMarketplace) => (
          <Grid
            key={marketplace.title}
            item
          >
            <Styled.NFTMarketplaceCard sx={{ maxWidth: maxWidth600 ? '100%' : '320px' }}>
              <Styled.NFTMarketplaceImgContainer>
                {marketplace.imgComponent}
                <Box pt={1}>
                  <Styled.ImageText
                    textAlign="center"
                    fontSize={12}
                    sx={{
                      padding: '1rem',
                    }}
                  >
                    The first Peer-to-Pool Lending Liquidity Protocol on MultiversX
                  </Styled.ImageText>
                </Box>
              </Styled.NFTMarketplaceImgContainer>

              <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
                <Box>
                  <Box display="flex" py={1.5}>
                    <Box>
                      <Text fontSize="1.5rem" fontWeight={700}>
                        {marketplace.title}
                      </Text>
                    </Box>
                  </Box>
                  <Box pb={2}>
                    <Styled.NFTMarketplaceDescription>
                      {marketplace.description}
                    </Styled.NFTMarketplaceDescription>
                  </Box>
                </Box>
                <Box mt={1}>
                  <Box
                    display="flex"
                    sx={{
                      background: '#14131C',
                      borderRadius: '4px',
                      padding: ' 1rem',
                    }}
                  >
                    {/* <PropertyKeyBox propertyKey={'Claimable'} /> */}
                    <form>
                      <Box
                        display="flex"
                        alignItems="center"
                        sx={{
                          margin: '1rem',
                        }}
                      >
                        {/* <Text mr={1} fontWeight={700}>{claimableAmount}</Text> */}
                        {/* <MultiversXLogo width={15} height={15} /> */}
                        <TextField
                          value={lendInput}
                          type={'number'}
                          id="outlined-basic"
                          label="Lend amount"
                          onChange={handleTextInputChange}
                          error={lendInputError}
                          inputProps={{ style: { color: '#fff' } }}
                          InputLabelProps={{
                            sx: {
                            // set the color of the label when not shrinked
                              color: theme.palette.primary.main,
                              [`&.${inputLabelClasses.shrink}`]: {
                              // set the color of the label when shrinked (usually when the TextField is focused)
                                color: theme.palette.primary.main,
                              },
                            },
                          }}
                          variant="outlined"
                          sx={{

                            margin: '1rem',
                            // input: { color: theme.palette.primary },
                          }}
                        />
                        {<MultiversXLogo width={15} height={15} />}
                        <MainButton
                          onClick={handleLendButtonClick}
                          disabled={isInReadOnlyMode}
                        >
                          Lend
                        </MainButton>
                      </Box>
                    </form>
                  </Box>
                  <Box
                    sx={{
                      padding: '1rem',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '0.5rem',
                      }}
                    />

                    {/* <MainButton */}
                    {/*  onClick={handleLendButtonClick} */}
                    {/*  disabled={isInReadOnlyMode} */}
                    {/*  fullWidth */}
                    {/* > */}
                    {/*  Withdraw */}
                    {/* </MainButton> */}
                    {/* <Box */}
                    {/*  sx={{ */}
                    {/*    padding: '0.5rem', */}
                    {/*  }} */}
                    {/* /> */}
                    {/* <MainButton */}
                    {/*  onClick={handleLendButtonClick} */}
                    {/*  disabled={isInReadOnlyMode} */}
                    {/*  fullWidth */}
                    {/* > */}
                    {/*  Compound */}
                    {/* </MainButton> */}
                  </Box>
                </Box>
              </Box>
            </Styled.NFTMarketplaceCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ClaimNftAuction;
