import React, { useEffect } from 'react';
import { FormikProps, useFormik } from 'formik';
import { FormikInputField } from 'src/helpers/formikFields';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectedNftToSendSelector } from 'src/redux/selectors/modalsSelector';
import { Address } from '@multiversx/sdk-core/out';
import { MultisigSendSft } from 'src/types/MultisigSendSft';
import { useQueryClient } from 'react-query';
import useNft from 'src/utils/useNft';
import { Box, useMediaQuery } from '@mui/material';
import AmountInputWithTokenSelection from 'src/components/Utils/AmountInputWithTokenSelection';
import NftPresentation from 'src/components/NftComponent/NftPresentation';
import * as Styled from '../../../components/Utils/styled';

interface ProposeSendSftType {
  handleChange: (proposal: MultisigSendSft) => void;
  setSubmitDisabled: (value: boolean) => void;
}

interface IFormValues {
  address: string;
  identifier: string;
  nonce: string;
  amount: string;
}

function validateRecipient(value?: string) {
  try {
    // eslint-disable-next-line no-new
    new Address(value);
    return true;
  } catch (err) {
    return false;
  }
}

const ProposeSendSft = ({
  handleChange,
  setSubmitDisabled,
}: ProposeSendSftType) => {
  const { t } = useTranslation();

  const selectedNft = useSelector(selectedNftToSendSelector);

  const formik: FormikProps<IFormValues> = useFormik({
    initialValues: {
      address: '',
      amount: '1',
      identifier: selectedNft?.identifier ?? '',
      nonce: selectedNft?.nonce ?? '',
    },
    onSubmit: () => undefined,
    validationSchema: Yup.object().shape({
      address: Yup.string()
        .min(2, 'Too Short!')
        .max(500, 'Too Long!')
        .required('Required')
        .test(validateRecipient),
      amount: Yup.string()
        .required('Required')
        .test((value?: string, testContext?: Yup.TestContext) => {
          if (value == null) {
            return true;
          }

          const newAmount = Number(value?.replaceAll(',', ''));
          if (Number.isNaN(newAmount)) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message: 'Invalid amount',
              }) ?? false
            );
          }
          if (newAmount < 0) {
            formik.setFieldValue('amount', 0);
          }
          if (newAmount > Number(selectedNft.balance)) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message:
            `Insufficient balance. There are only ${selectedNft.balance} ${selectedNft.name} SFTs available.`,
              }) ?? false
            );
          }

          if (newAmount === 0) {
            setSubmitDisabled(true);
            return (
              testContext?.createError({
                message: 'The amount should be greater than 0',
              }) ?? false
            );
          }

          const isDisabled = !formik.isValid || !formik.dirty;
          setSubmitDisabled(isDisabled);
          return true;
        }),
      identifier: Yup.string().required('Required'),
      nonce: Yup.string().required('Required'),
    }),
    validateOnChange: true,
    validateOnMount: true,
  } as any);

  const queryClient = useQueryClient();

  const { searchedNft } = useNft(queryClient, selectedNft.identifier);

  const { touched, errors, values } = formik;
  const { address, identifier, nonce, amount } = values;

  const getProposal = (): MultisigSendSft | null => {
    try {
      const parsedAddress = new Address(address);
      return new MultisigSendSft(parsedAddress, identifier, amount, nonce);
    } catch (err) {
      return null;
    }
  };

  const refreshProposal = () => {
    setTimeout(() => {
      const proposal = getProposal();

      if (proposal !== null) {
        handleChange(proposal);
      }
    }, 100);
  };

  const addressError = touched.address && errors.address;
  setSubmitDisabled(!formik.isValid || !formik.dirty);
  useEffect(() => {
    setSubmitDisabled(!(formik.isValid && formik.dirty));
  }, [address, identifier, nonce]);

  React.useEffect(() => {
    refreshProposal();
  }, [address, identifier, nonce]);

  const amountError = touched.amount && errors.amount;

  const maxWidth600 = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <NftPresentation nft={searchedNft} />
      <Styled.ModalDivider />
      <Box sx={{ p: maxWidth600 ? '1.25rem 16px 0' : '1.25rem 48px 0', m: ' 0 0 1rem' }}>
        <FormikInputField
          label={t('Send to')}
          name={'address'}
          value={address}
          handleChange={formik.handleChange}
          error={addressError}
          handleBlur={formik.handleBlur}
          className={addressError ? 'isError' : ''}
        />
      </Box>
      <Box sx={{ p: maxWidth600 ? '0 16px 0' : '0 48px 0', m: ' 0 0 1rem' }}>
        <AmountInputWithTokenSelection
          amount={amount}
          formik={formik}
          amountError={amountError}
          handleInputBlur={formik.handleBlur}
          handleInputChange={formik.handleChange}
          handleMaxButtonClick={() => formik.setFieldValue('amount', selectedNft.balance)}
          resetAmount={() => formik.setFieldValue('amount', 0)}
          config={{
            withTokenSelection: false,
            isEsdtOrEgldRelated: false,
          }}
        />
      </Box>
    </Box>
  );
};

export default ProposeSendSft;
