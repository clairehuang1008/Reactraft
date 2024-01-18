import React from 'react';
import Button from '@mui/material/Button';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import BackupTableIcon from '@mui/icons-material/BackupTable';
import { useDispatch } from 'react-redux';
import { goToPage } from '../utils/reducers/appSlice';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useAuth } from '../hooks/useAuth';
import { resetDesign } from '../utils/reducers/designSliceV2';
import PastDesigns from './PastDesigns/PastDesigns';
import { Container } from '@mui/material';

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  function handleClick(page) {
    dispatch(goToPage(page));
    dispatch(resetDesign());
  }
  if (user)
    return (
      //Box container below controlls margin size @ homepage
      <Container>
        <Box marginBottom='2vw'>
          <Typography variant='h3' gridColumn='span 2' color='text.disabled'>
            Welcome back, {user.username}!
          </Typography>
          {/* <Button
          variant='contained'
          startIcon={<AddPhotoAlternateIcon />}
          onClick={() => handleClick('NEW_DESIGN')}>
          New Design
        </Button>
        <Button
          variant='contained'
          startIcon={<BackupTableIcon />}
          onClick={() => handleClick('PAST_DESIGNS')}>
          Past Designs
        </Button> */}
        </Box>
        <PastDesigns />
      </Container>
    );
}
