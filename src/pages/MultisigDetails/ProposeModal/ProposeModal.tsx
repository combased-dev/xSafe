import { useState } from 'react';
import { Address } from '@elrondnetwork/erdjs/out';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  mutateProposeChangeQuorum,
  mutateProposeAddProposer,
  mutateProposeAddBoardMember,
  mutateProposeRemoveUser,
} from 'src/contracts/MultisigContract';
import { addEntry } from 'src/redux/slices/addressBookSlice';
import { useTheme } from 'styled-components';
import { setProposeModalSelectedOption } from 'src/redux/slices/modalsSlice';
import { ProposalsTypes, SelectedOptionType } from 'src/types/Proposals';
import { MainButton, MainButtonNoShadow, ModalConnectContainer } from 'src/components/Theme/StyledComponents';
import { Box } from '@mui/material';
import ModalCardTitle from 'src/components/Layout/Modal/ModalCardTitle';
import Unlock from 'src/pages/Unlock';
import { getIsLoggedIn } from '@elrondnetwork/dapp-core';
import ConnectedAccount from 'src/components/Layout/Navbar/ConnectedAccount';
import EditOwner from './EditOwner';
import ProposeChangeQuorum from './ProposeChangeQuorum';
import ProposeInputAddress from './ProposeInputAddress';
import ProposeRemoveUser from './ProposeRemoveUser';
import ReplaceOwner from './ReplaceOwner';

interface ProposeModalPropsType {
  selectedOption: SelectedOptionType;
}

function ProposeModal({ selectedOption }: ProposeModalPropsType) {
  const theme: any = useTheme();
  const dispatch = useDispatch();
  const { t }: { t: any } = useTranslation();

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [selectedNumericParam, setSelectedNumericParam] = useState(1);
  const [selectedAddressParam, setSelectedAddressParam] = useState(
    new Address(),
  );
  const [selectedNameParam, setSelectedNameParam] = useState('');
  const [selectedReplacementAddressParam] = useState(new Address());

  const handleClose = () => {
    dispatch(setProposeModalSelectedOption(null));
  };

  const onProposeClicked = () => {
    try {
      switch (selectedOption?.option) {
        case ProposalsTypes.change_quorum:
          mutateProposeChangeQuorum(selectedNumericParam);
          break;
        case ProposalsTypes.add_proposer:
          mutateProposeAddProposer(selectedAddressParam);
          break;
        case ProposalsTypes.add_board_member:
          mutateProposeAddBoardMember(selectedAddressParam);
          break;
        case ProposalsTypes.remove_user:
          mutateProposeRemoveUser(selectedAddressParam);
          break;
        case ProposalsTypes.edit_owner:
          dispatch(
            addEntry({
              address: selectedAddressParam.bech32(),
              name: selectedNameParam,
            }),
          );
          break;
        case ProposalsTypes.replace_owner:
          mutateProposeRemoveUser(selectedAddressParam);
          mutateProposeAddBoardMember(selectedReplacementAddressParam);
          dispatch(
            addEntry({
              address: selectedReplacementAddressParam.bech32(),
              name: selectedNameParam,
            }),
          );
          break;
        default:
          console.error(`Unrecognized option ${selectedOption}`);
          break;
      }
      handleClose();
    } catch (err) {
      handleClose();
    }
  };

  const handleNumericParamChange = (value: number) => {
    setSelectedNumericParam(value);
  };

  const handleAddressParamChange = (value: Address) => {
    setSelectedAddressParam(value);
  };

  if (selectedOption == null) {
    return null;
  }
  // eslint-disable-next-line consistent-return
  const getModalContent = () => {
    const isLoggedIn = getIsLoggedIn();
    switch (selectedOption?.option) {
      case ProposalsTypes.change_quorum: {
        return (
          <ProposeChangeQuorum
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={handleNumericParamChange}
          />
        );
      }
      case ProposalsTypes.add_proposer:
      case ProposalsTypes.add_board_member:
        return (
          <ProposeInputAddress
            setSubmitDisabled={setSubmitDisabled}
            handleParamsChange={handleAddressParamChange}
          />
        );
      case ProposalsTypes.connect_wallet:
      {
        if (isLoggedIn) return <Box width="100%"><ConnectedAccount /></Box>;
        return <Unlock />;
      }

      case ProposalsTypes.remove_user:
        return (
          <ProposeRemoveUser
            handleSetAddress={handleAddressParamChange}
            selectedOption={selectedOption}
          />
        );
      case ProposalsTypes.edit_owner:
        return (
          <EditOwner
            handleSetAddress={handleAddressParamChange}
            handleSetName={(value) => setSelectedNameParam(value)}
            selectedOption={selectedOption}
          />
        );
      case ProposalsTypes.replace_owner:
        return (
          <ReplaceOwner
            handleSetAddress={handleAddressParamChange}
            handleSetName={(value) => setSelectedNameParam(value)}
            selectedOption={selectedOption}
          />
        );
      default:
    }
  };

  const getActionButtonText = (): string => {
    switch (selectedOption?.option) {
      case (ProposalsTypes.edit_owner): {
        return 'Save Update';
      }
      case (ProposalsTypes.change_quorum):
      case (ProposalsTypes.remove_user): {
        return 'Propose';
      }
      default:
        return 'Create proposal';
    }
  };

  const getModalTitle = (): string => {
    switch (selectedOption?.option) {
      case (ProposalsTypes.edit_owner): {
        return 'Edit Member';
      }
      case (ProposalsTypes.change_quorum): {
        return 'Change Quorum';
      }
      case (ProposalsTypes.remove_user): {
        return 'Remove Member';
      }
      case (ProposalsTypes.connect_wallet): {
        const isLoggedIn = getIsLoggedIn();
        if (isLoggedIn) return 'Account Details';
        return 'Connect Wallet';
      }
      default:
        return 'Add member';
    }
  };

  const getModalActions = () => {
    if (selectedOption.option === ProposalsTypes.connect_wallet) return <div />;
    return (
      <Box className="modal-action-btns" sx={{ mt: '24px !important' }}>
        <MainButton
          onClick={handleClose}
          sx={{ boxShadow: 'none !important' }}
        >
          {t('Cancel')}
        </MainButton>
        <MainButtonNoShadow
          disabled={submitDisabled}
          onClick={onProposeClicked}
          sx={{ gap: '5px !important' }}
        >
          {t(getActionButtonText())}
        </MainButtonNoShadow>
      </Box>
    );
  };

  return (
    <ModalConnectContainer
      show
      size="lg"
      onHide={handleClose}
      className="modal-container proposal-modal"
      animation={false}
      centered
    >
      <ModalCardTitle title={getModalTitle()} handleClose={handleClose} />
      <div className="card">
        <Box
          sx={{ padding: '21px 40px',
            backgroundColor: theme.palette.background.secondary,
            borderRadius: '0 0 10px 10px' }}
        >
          {getModalContent()}
          {getModalActions()}
        </Box>
      </div>
    </ModalConnectContainer>
  );
}

export default ProposeModal;
