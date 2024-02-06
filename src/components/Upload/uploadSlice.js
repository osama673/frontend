import { createSlice } from "@reduxjs/toolkit";

export const upload = createSlice({
  name: "upload",
  initialState: {
    fileId: "",
    fileName: "",
  },
  reducers: {
    setFileId: (state, action) => {
      state.fileId = action.payload;
    },
    setFileName: (state, action) => {
      state.fileName = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFileId, setFileName } = upload.actions;

export default upload.reducer;
