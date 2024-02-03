import React from 'react';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../utils/reducers/appSlice';
import Fab from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { deletePageAndUpdateSelectedPageIdx } from '../../../utils/reducers/designSliceV3';
import Button from '@mui/material/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

export default function ButtonDeletePage({ pageId, canDelete }) {
  const dispatch = useDispatch();
  return (
    <Button
      onClick={() => {
        if (canDelete) {
          try {
            dispatch(deletePageAndUpdateSelectedPageIdx(pageId));
          } catch (error) {
            dispatch(
              setMessage({ severity: 'error', text: 'Delete page ' + error })
            );
          }
        } else {
          dispatch(
            setMessage({
              severity: 'error',
              text: 'Cannot delete the only page',
            })
          );
        }
      }}
    >
      <FontAwesomeIcon icon={faTrashCan} />
      Delete Page
    </Button>
  );
}
