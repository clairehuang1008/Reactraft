import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedIdx,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import Button from '@mui/material/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

export default function ButtonsPrevNextPage({ pageIdx }) {
  const pageLen = useSelector((state) => state.designV3.pages).length;
  const dispatch = useDispatch();
  const previousPage = (prev) => {
    dispatch(
      setSelectedPageIdx(
        prev ? Math.max(pageIdx - 1, 0) : Math.min(pageIdx + 1, pageLen - 1)
      )
    );
    dispatch(setSelectedIdx(null));
  };
  return (
    <Fragment>
      <Button onClick={() => previousPage(true)}>
        <FontAwesomeIcon icon={faChevronUp} />
        Prev Page
      </Button>
      <Button onClick={() => previousPage(false)}>
        <FontAwesomeIcon icon={faChevronDown} />
        Next Page
      </Button>
    </Fragment>
  );
}
