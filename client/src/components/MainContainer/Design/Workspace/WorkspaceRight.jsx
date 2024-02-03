import React, { Fragment } from 'react';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import { convertToTree } from '../../../../utils/treeNode';
import Codes from '../../../../utils/codesForPage';
import ButtonViewCode from '../../../functionality/Page/ButtonViewCode';
import ButtonDeletePage from '../../../functionality/Page/ButtonDeletePage';
import ButtonAddPage from '../../../functionality/Page/ButtonAddPage';
import ButtonsPrevNextPage from '../../../functionality/Page/ButtonsPrevNextPage';
import ButtonSetPageAsDesignCover from '../../../functionality/Design/ButtonSetPageAsDesignCover';
import ButtonGroup from '@mui/material/ButtonGroup';
import { useTheme } from '@mui/material';

export default function WorkspaceRight({ canvasWidth }) {
  const { pages, _id, canEdit } = useSelector((state) => state.designV3);
  const { selectedPageIdx } = useSelector((state) => state.app);
  const page = pages[selectedPageIdx];
  const components = page.components;
  const { selectedIdx, windowWidth } = useSelector((state) => state.app);
  const tree = convertToTree(components);
  const codes = new Codes(components, tree);
  const { jsx, css } = codes.convertToCode();
  const isVertical = windowWidth - 420 > canvasWidth;
  const theme = useTheme();

  return (
    <ButtonGroup
      orientation={isVertical ? 'vertical' : 'horizontal'}
      sx={{
        '& .MuiButtonBase-root': {
          fontSize: 'x-small',
          width: '90px',
          displaty: 'flex',
          flexDirection: 'column',
          color:
            theme.palette.mode === 'light' ? 'rgb(115, 108, 108)' : 'white',
          height: '60px',
          gap: 1,
          '& svg': {
            transform: 'scale(1.5)',
            marginTop: '10px',
          },
        },
      }}
    >
      <ButtonViewCode
        css={css}
        jsx={jsx}
        name={selectedIdx !== null ? components[selectedIdx].name : null}
        pageName={components[0].name}
        isVertical={isVertical}
      />
      <ButtonsPrevNextPage pageIdx={selectedPageIdx} />
      {canEdit && (
        <Fragment>
          <ButtonSetPageAsDesignCover
            designId={_id}
            imageUrl={page.image_url}
          />
          <ButtonAddPage pageIdx={selectedPageIdx} />
          <ButtonDeletePage pageId={page._id} canDelete={pages.length > 1} />
        </Fragment>
      )}
    </ButtonGroup>
  );
}
