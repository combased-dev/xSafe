/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AbiRegistry,
  Address,
  AddressValue,
  BytesValue,
  ContractFunction,
  ResultsParser,
  SmartContract,
  TypedValue,
  U64Value,
} from '@multiversx/sdk-core';
import { formatAmount, getAccount, getAddress, getLatestNonce } from '@multiversx/sdk-dapp/utils';
import { ApiNetworkProvider, ProxyNetworkProvider } from '@multiversx/sdk-network-providers/out';
import { network, xSpotlightContractAddress } from 'src/config';
import { currentMultisigAddressSelector } from 'src/redux/selectors/multisigContractsSelectors';
import { store } from 'src/redux/store';
import BigNumber from '@multiversx/sdk-core/node_modules/bignumber.js';
import RationalNumber from 'src/utils/RationalNumber';
import { queryOnContract } from './MultisigContract';

export type ClaimableRoyaltiesReturnType = {
  rawClaimableAmount: TypedValue;
  parsedClaimableAmount: string;
  denominatedClaimableAmount: string;
};

const xSpotlightPartialAbi = AbiRegistry.create({
  endpoints: [
    {
      name: 'getClaimableAmount',
      mutability: 'readonly',
      inputs: [
        {
          name: 'address',
          type: 'Address',
        },
        {
          name: 'token_id',
          type: 'EgldOrEsdtTokenIdentifier',
        },
        {
          name: 'token_nonce',
          type: 'u64',
        },
      ],
      outputs: [
        {
          type: 'BigUint',
        },
      ],
    },
  ],
});

const networkProvider = new ProxyNetworkProvider(network?.apiAddress ?? '');

const xSpotlightContract = new SmartContract({
  address: new Address(xSpotlightContractAddress),
});
const currentMultisigAddress = currentMultisigAddressSelector(
  store.getState(),
);

export const queryClaimableRoyalties =
  async (contractAddress: string): Promise<ClaimableRoyaltiesReturnType | null> => {
    try {
      const query = xSpotlightContract.createQuery({
        func: new ContractFunction('getClaimableAmount'),
        args: [
          new AddressValue(new Address(contractAddress)),
          BytesValue.fromUTF8('EGLD'),
          new U64Value(0),
        ],
      });

      const getClaimableAmountEndpoint = xSpotlightPartialAbi.getEndpoint('getClaimableAmount');
      const queryResponse = await networkProvider.queryContract(query);
      const {
        values: [
          rawClaimableAmount,
        ],
      } = new ResultsParser().parseQueryResponse(queryResponse, getClaimableAmountEndpoint);

      const parsedClaimableAmount = rawClaimableAmount.valueOf().toString();
      const denominatedClaimableAmount = RationalNumber.fromBigInteger(parsedClaimableAmount);

      return {
        rawClaimableAmount,
        parsedClaimableAmount,
        denominatedClaimableAmount,
      };
    } catch (e) {
      console.error(e);
    }

    return null;
  };
