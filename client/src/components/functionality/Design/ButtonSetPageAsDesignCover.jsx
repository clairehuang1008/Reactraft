import React from 'react';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { useDispatch } from 'react-redux';
import { updateDesignCoverOrTitleAndUpdateState } from '../../../utils/reducers/designSliceV3';
import { setMessage } from '../../../utils/reducers/appSlice';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

export default function ButtonSetPageAsDesignCover({ designId, imageUrl }) {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => {
        try {
          dispatch(
            updateDesignCoverOrTitleAndUpdateState({
              designId,
              imageUrl,
            })
          );
        } catch (error) {
          dispatch(
            setMessage({ severity: 'error', text: 'Set design cover failed' })
          );
        }
      }}
    >
      <FontAwesomeIcon icon={faImage} />
      Set Cover
    </Button>
  );
}
