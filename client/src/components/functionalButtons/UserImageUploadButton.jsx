import React, { Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import { setMessage } from '../../utils/reducers/appSlice';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import {
  newDesign,
  updateDesign,
  updateRootHeight,
} from '../../utils/reducers/designSliceV2';

export default function UserImageUploadButton() {
  const dispatch = useDispatch();
  const designId = useSelector((state) => state.designV2._id);
  const { image_url, components } = useSelector((state) => state.designV2);
  const tooltip = designId ? 'upload a new image' : 'replace image';

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      dispatch(
        setMessage({ severity: 'success', text: 'Upload successful.' })
      );

      const reader = new FileReader();
      reader.onloadend = async () => {
        const userImage = reader.result;
        const img = new Image();

        img.onload = () => {
          const setWidth = 800;
          const imageHeight = img.height * (setWidth / img.width);
          if (!designId) {
            try {
              dispatch(newDesign({ userImage, imageHeight }));
            } catch (err) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'App: add new design ' + err,
                })
              );
            }
          } else {
            const url = new URL(image_url);
            try {
              dispatch(
                updateDesign({
                  designId,
                  body: {
                    userImage,
                    imageToDelete: url.pathname.slice(1),
                    imageHeight,
                    rootId: components[0]._id,
                  },
                })
              );
              dispatch(updateRootHeight(imageHeight));
            } catch (err) {
              dispatch(
                setMessage({
                  severity: 'error',
                  text: 'App: replace design image' + err,
                })
              );
            }
          }
        };

        img.src = userImage;
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <Fragment>
      <Tooltip title={tooltip}>
        <Button
          component='label'
          variant='contained'
          startIcon={<CloudUploadIcon />}
        >
          {designId ? '' : 'Upload Image'}
          <VisuallyHiddenInput
            type='file'
            name='userImage'
            accept='image/*'
            onChange={handleFileChange}
          />
        </Button>
      </Tooltip>
    </Fragment>
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
