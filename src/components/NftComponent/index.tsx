/* eslint-disable no-nested-ternary */
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { navbarSearchSelector } from 'src/redux/selectors/searchSelector';
import { useContractNFTs } from 'src/utils/useContractNFTs';
import NoActionsOverlay from 'src/pages/Transactions/utils/NoActionsOverlay';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import { CollectionName, TextDivider } from './nft-style';
import { useTheme } from 'styled-components';
import LoadingDataIndicator from '../Utils/LoadingDataIndicator';
import { NftCollectionTitle } from './NftCollectionTitle';
import ErrorOnFetchIndicator from '../Utils/ErrorOnFetchIndicator';
import NftGrid from './NftGrid';

function NftComponent() {
  const navbarSearchParam = useSelector(navbarSearchSelector);
  const maxWidth600 = useMediaQuery('(max-width:600px)');
  const theme: any = useTheme();

  const {
    isFetchingNFTs,
    isLoadingNFTs,
    isErrorOnFetchNFTs,
    nftsGroupedByCollection,
  } = useContractNFTs({
    withSearchFilter: true,
    searchParam: navbarSearchParam,
    leaveSftsLast: true,
    groupByCollection: true,
  });

  console.log({ nftsGroupedByCollection });

  if (isErrorOnFetchNFTs) {
    return <ErrorOnFetchIndicator dataName="NFT" />;
  }

  if (isLoadingNFTs || isFetchingNFTs) {
    return <LoadingDataIndicator dataName="NFT" />;
  }

  if (Object.keys(nftsGroupedByCollection)?.length === 0) {
    return (
      <Grid container margin={maxWidth600 ? '0px' : '-9px 0 0 -9px'}>
        <Grid xs={12} item>
          <NoActionsOverlay message={'No NFTs to show'} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Box padding="0" paddingBottom={maxWidth600 ? '44px' : 0}>
      {(
        <Box
          component={motion.div}
          exit={{ opacity: 0 }}
        >
          {Object.entries(nftsGroupedByCollection).map(([collection, collectionNfts]) => (
            <Box key={collection}>
              <Accordion
                sx={{
                  background: '#1E1D2A',
                  border: '1px solid #D6CFFF1A',
                  color: '#fff',
                  borderRadius: '4px',
                  mb: 2,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: '#ddd' }} />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                    <Grid item xs={6} md={3}>
                      <NftCollectionTitle value={collection} />
                    </Grid>
                    <Grid item xs={6} md={2}>
                      Owns: {collectionNfts.length} {collectionNfts.length === 1 ? 'NFT' : 'NFTs'}
                    </Grid>
                    <Grid item display="flex">
                      {collectionNfts.slice(0, 5).map((nft) => (
                        <Box ml={1}>
                          <img
                            src={`${nft.media?.[0].thumbnailUrl}?w=30&h=30&fit=crop&auto=format`}
                            alt="nft"
                            width={40}
                            height={40}
                          />
                        </Box>
                      ))}
                    </Grid>
                  </Grid>
                </AccordionSummary>
                <AccordionDetails sx={{ background: theme.palette.background.default, p: 0, pr: 2, pb: 2 }}>
                  <Grid
                    container
                    spacing={2}
                    sx={{
                      margin: 0,
                      width: '100% !important',
                    }}
                  >
                    <NftGrid nfts={collectionNfts} />
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          ))}

        </Box>
      )}
    </Box>
  );
}

export default NftComponent;
