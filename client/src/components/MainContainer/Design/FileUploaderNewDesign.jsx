import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { FileUploader } from 'react-drag-drop-files';
import {
  setMessage,
  setSelectedPageIdx,
} from '../../../utils/reducers/appSlice';
import { styled } from '@mui/material/styles';
import { newDesign } from '../../../utils/reducers/designSliceV3';
import { Box } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import '../../../styles/UserImageUploadButton.css';
import { useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons';

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const theme = useTheme();
  // const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [socket, setSocket] = useState(null);
  const wss =
    process.env.REACT_APP_HOST_ADDRESS === 'localhost:8080' ? 'ws' : 'wss';

  // Moved this function outside of handleFileChange for clarity
  function generateUniqueIdentifier() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  // function to initiate websocket connection with the generated clientId and retryCount (if connection gets disconnected prematurely)
  function initiateWebSocketConnection(clientId, retryCount = 0) {
    // create new websocket connection with clientId
    const ws = new WebSocket(
      `${wss}://${process.env.REACT_APP_HOST_ADDRESS}/ws?clientId=${clientId}`
    );

    // once websocket connection is open, console log
    ws.onopen = () => {
      console.log('websocket connection opened');
    };

    // when a websocket message is received
    ws.onmessage = (event) => {
      try {
        // parse the message received from server
        const message = JSON.parse(event.data);
        console.log('message from server:', message);
        console.log('websocket state', ws.readyState);

        // check if message has the expected strcuture with type
        if (typeof message === 'object' && 'type' in message) {
          // handle different types of messages received from the server
          switch (message.type) {
            case 'progressUpdate':
              console.log('progressUpdate received', message.progress);
              // update the uploadProgress state
              setUploadProgress(message.progress);
              break;
            case 'uploadComplete':
              console.log('uploadComplete received');
              setFileName('');
              setFileSize('');
              setUploadProgress(100);
              setTimeout(() => setUploadProgress(0), 2000); // reset progress after a delay
              break;
            case 'test':
              console.log('test message received:', message.content);
              break;
            default:
              console.log('received an unhandled message type:', message.type);
          }
        } else {
          console.log('received message without type:', message);
        }
      } catch (err) {
        console.error('error parsing from server:', error);
      }
    };

    // if there's an error with the websocket
    ws.onerror = (event) => {
      console.error('websocket error:', event);
      // check if event code is 1006 = abnormal connection
      if (event.code === 1006) {
        console.error('abnormal disconnection');
      }
      // attempt to reconnect after a backoff delay
      const backOffDelay = calculateBackOffDelay(retryCount);
      setTimeout(() => initiateWebSocketConnection(clientId, retryCount + 1));
    };

    // when websocket closes
    ws.onclose = () => {
      console.log('websocket connection closed');
    };
    // set websocket connection to state
    setSocket(ws);
  }

  // calculates the delay for reconection attempts
  function calculateBackOffDelay(retryCount) {
    // exponential back-off formula
    return Math.min(1000 * 2 ** retryCount, 30000);
  }

  function handleFileChange(file) {
    console.log('hit handleFileChange');
    setFileName(file.name);
    setFileSize((file.size / 1024 / 1024).toFixed(2) + 'MB');

    const clientId = generateUniqueIdentifier();

    if (file) {
      dispatch(setMessage({ severity: 'success', text: 'Upload successful.' }));

      const reader = new FileReader();

      reader.onloadend = () => {
        const userImage = reader.result;
        const img = new Image();

        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
          // ensure the socket is connected before dispatching
          const currentSocket = initiateWebSocketConnection(clientId);

          try {
            dispatch(newDesign({ userImage, imageHeight, clientId }));
            console.log('dispatching to newDesign');
            dispatch(setSelectedPageIdx(0));
            dispatch(
              setMessage({ severity: 'success', text: 'Upload successful.' })
            );
          } catch (err) {
            dispatch(
              setMessage({
                severity: 'error',
                text: 'App: add new design' + err,
              })
            );
          }
        };
        img.onerror = (error) => {
          console.error('Error loading image:', error);
        };
        img.src = userImage;
      };
      reader.readAsDataURL(file);
    }
  }

  // useEffect to close websocket connection
  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        console.log('connection closed');
      }
    };
  }, [socket]);

  return (
    <Box className='container'
      sx={{
        maxWidth: '500px',
        height: 'auto',
        margin: '0 auto',
      }}
    >
      <Box className='svgBackground'>
        <img class="dotted-upload" src='/assets/Dotted_Box.svg' alt='Dotted box' style={{ filter: theme.palette.mode === 'light' ? 'none' : 'invert(100%)' }}/>
      </Box>
      <Box className='content'>
        <FileUploader
          handleChange={handleFileChange}
          name='file'
          types={['JPG', 'PNG']}
          children={
            <Box>
              <FontAwesomeIcon icon={faCloudArrowUp}
                style={{
                  fontSize: '4.375em',
                  color: theme.palette.mode === 'light' ? '#BCBBB6' : 'white',
                  marginLeft: '3.03rem',
                }}
              />
              <div style={{ margin: '20px 0', color: theme.palette.mode === 'light' ? '#2D2D2D' : 'white', fontWeight: 'bolder' }}>
                Drag & Drop your files here
              </div>
              <Box>
                <Button
                  variant='contained'
                  component='label'
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#8D99AE',
                    marginLeft: '50px',
                    '&:hover': {
                      backgroundColor: '#E0E0E0',
                    },
                    '&:focus': {
                      outline: 'none',
                    },
                    '&:active': {
                      outline: 'none',
                      border: 'none',
                      boxShadow: 'none',
                    },
                  }}
                >
                  BROWSE
                  <VisuallyHiddenInput
                    type='file'
                    name='userImage'
                    accept='image/*'
                    onChange={(e) => handleFileChange(e.target.files[0])}
                  />
                </Button>
              </Box>
            </Box>
          }
        />
        {/* if fileName is set, render a Box with fileName, fileSize, and a LinearProgress component for uploadProgress */}
        {fileName && (
          <Box sx={{ textAlign: 'center', color: 'black', marginTop: '10px' }}>
            <span>{fileName}</span> - <span>{fileSize}</span>
            <LinearProgress
              variant='determinate'
              value={uploadProgress}
              sx={{
                width: '100%',
                marginTop: '10px',
                color: 'black',
              }}
            />
            <Button
              sx={{
                marginTop: '10px',
                color: 'black',
                borderColor: '#8D99AE',
              }}
              onClick={() => {
                /* logic to handle file removal */
              }}
            >
              X
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
