import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { InputsContainer } from 'src/components/Theme/StyledComponents';
import { useOrganizationInfoContext } from 'src/pages/Organization/OrganizationInfoContextProvider';
import * as Styled from 'src/components/Utils/styled';

interface ProposeChangeQuorumType {
  handleParamsChange: (params: number) => void;
  setSubmitDisabled: (value: boolean) => void;
}

const errors = {
  invalid: 'Invalid value',
  tooBig: 'Quorum cannot be bigger than the number of board members',
};

function ProposeChangeQuorum({
  handleParamsChange,
  setSubmitDisabled,
}: ProposeChangeQuorumType) {
  const { boardMembersCount } = useOrganizationInfoContext();
  const { t }: { t: any } = useTranslation();

  const [newQuorumSize, setNewQuorumSize] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleNewQuorumSizeChanged = (event: any) => {
    const newQuorum = Number(event.target.value);
    if (Number.isNaN(newQuorum) || newQuorum < 1) {
      setError(errors.invalid);
      setSubmitDisabled(true);
    } else if (newQuorum > boardMembersCount) {
      setError(errors.tooBig);
      setSubmitDisabled(true);
    } else {
      setError(null);
      handleParamsChange(newQuorum);
      setSubmitDisabled(false);
    }
    setNewQuorumSize(newQuorum);
  };

  return (
    <InputsContainer
      className={error != null ? 'hasAvailableAmount invalid' : 'hasAvailableAmount'}
    >
      <Styled.TextField
        id="newQuorumSize"
        type="number"
        value={newQuorumSize}
        autoComplete="off"
        focused={false}
        onChange={handleNewQuorumSizeChanged}
      />
      <label htmlFor="newQuorumSize">{t('Quorum Size')}</label>
      <span className="errorMessage">{error}</span>
    </InputsContainer>
  );
}

export default ProposeChangeQuorum;
