import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  addDesignRequest,
  updateDesignTitleRequest,
  getDesignDetailsRequest,
  addNewComponentRequest,
} from '../fetchRequests';
import { Component, Design, Page } from '../../../../docs/types';

export const newDesign = createAsyncThunk(
  'designs/new',
  async (body: { userImage: string; imageHeight: number }) =>
    await addDesignRequest(body)
);

export const updateDesignTitle = createAsyncThunk(
  'designs/update-title/:designId',
  async (arg: { designId: number; body: { title: string } }) =>
    await updateDesignTitleRequest(arg.designId, arg.body)
);

export const getDesignDetails = createAsyncThunk(
  'designs/detail/:designId',
  async (designId: number) => await getDesignDetailsRequest(designId)
);

export const addNewComponent = createAsyncThunk(
  'pages/new-component/:pageId',
  async (arg: {
    pageId: number;
    body: { index: number; rootId: number; name: string };
  }) => await addNewComponentRequest(arg.pageId, arg.body)
);

const asyncThunks = [
  newDesign,
  updateDesignTitle,
  getDesignDetails,
  addNewComponent,
];

const designThunks = [newDesign, updateDesignTitle, getDesignDetails];

interface DesignState {
  _id: null | number;
  pages: Page[];
  title: string;
  created_at: Date | null;
  last_updated: Date | null;
  loading: boolean;
  error: string | undefined;
  searchTerm: string;
  isDraggable: boolean;
  cursorMode: string;
  image_url: string;
}

const initialState: DesignState = {
  _id: null,
  pages: [],
  title: 'Untitled',
  created_at: null,
  last_updated: null,
  image_url: '',
  loading: false,
  error: undefined,
  searchTerm: '',
  isDraggable: false,
  cursorMode: 'default',
};

const designSliceV3 = createSlice({
  name: 'design_v3',
  initialState,
  reducers: {
    resetDesign: () => initialState,
    updateRootHeight: (
      state: DesignState,
      action: PayloadAction<{ pageIndex: number; height: number }>
    ) => {
      const { pageIndex, height } = action.payload;
      if (state.pages.length === 0) {
        state.error = 'Design has no pages.';
        return;
      }
      if (!state.pages[pageIndex]) {
        state.error = 'Design has no page ' + pageIndex;
        return;
      }
      if (state.pages[pageIndex].components.length === 0) {
        state.error = `Design's page ${pageIndex} has no components.`;
        return;
      }
      const root = state.pages[pageIndex].components[0];
      if (!root.rectangle) {
        state.error = `Design's page ${pageIndex} has no root rectangle.`;
        return;
      }
      root.rectangle.height = height;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    toggleIsDraggable: (state, action: PayloadAction<boolean>) => {
      state.isDraggable = action.payload;
    },
    setCursorMode: (state, action: PayloadAction<string>) => {
      state.cursorMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    asyncThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    });
    designThunks.forEach((thunk) => {
      builder.addCase(
        thunk.fulfilled,
        (state, action: PayloadAction<Design>) => {
          Object.assign(state, action.payload);
          state.loading = false;
        }
      );
    });
    builder.addCase(
      addNewComponent.fulfilled,
      (state, action: PayloadAction<Component>) => {
        state.loading = false;
        const pageIndex = state.pages.findIndex(
          (page) => page._id === action.payload.page_id
        );
        state.pages[pageIndex].components.push(action.payload);
      }
    );
  },
});

export const {
  resetDesign,
  setSearchTerm,
  updateRootHeight,
  toggleIsDraggable,
  setCursorMode,
} = designSliceV3.actions;
export default designSliceV3.reducer;
