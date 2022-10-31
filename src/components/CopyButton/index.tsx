import { MouseEvent, useState } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from '@mui/material';
import copyTextToClipboard from './helpers/copyToClipboard';
import { ReactComponent as CopyIcon } from '../../assets/img/copy.svg';

interface Props {
  link: any;
  handle: (e: MouseEvent) => Promise<void>;
  className: string;
  resultOfCopySucces: boolean;
  resultOfCopyDefault: boolean;
}

const Wrapper = (props: Props) => {
  const { link: Link, handle, className, resultOfCopyDefault, resultOfCopySucces } = props;
  return (
    <Link
      href="/#"
      onClick={handle}
      className={`side-action ${className}`}
    >
      {resultOfCopyDefault || !resultOfCopySucces ? (
        <CopyIcon />
      ) : (
        <FontAwesomeIcon icon={faCheck} className="text-primary-highlight" />
      )}
    </Link>
  );
};

interface CopyButtonType {
  text: string;
  className?: string;
  link: typeof Link;
}

const CopyButton = ({
  text,
  className = '',
  link,
}: CopyButtonType) => {
  const [copyResult, setCopyResut] = useState({
    default: true,
    success: false,
  });

  const handleCopyToClipboard = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const noSpaces = text ? text.trim() : text;
    setCopyResut({
      default: false,
      success: await copyTextToClipboard(noSpaces),
    });

    setTimeout(() => {
      setCopyResut({
        default: true,
        success: false,
      });
    }, 1000);
  };

  return (
    <Wrapper
      link={link}
      handle={handleCopyToClipboard}
      className={className}
      resultOfCopyDefault={copyResult.default}
      resultOfCopySucces={copyResult.success}
    />
  );
};

export default CopyButton;
