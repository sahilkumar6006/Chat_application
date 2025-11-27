import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoaderConfig {
    global?: boolean;
}

interface LoaderState {
    loaders: {
        [key: string]: LoaderConfig;
    };
}

const initialState: LoaderState = {
    loaders: {},
};

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        presentLoader(state, action: PayloadAction<{ id: string; config?: LoaderConfig }>) {
            const { id, config = { global: false } } = action.payload;
            state.loaders[id] = config;
        },
        dismissLoader(state, action: PayloadAction<string>) {
            delete state.loaders[action.payload];
        },
        clearAllLoaders(state) {
            state.loaders = {};
        },
    },
});

export default commonSlice.reducer;
export const { presentLoader, dismissLoader, clearAllLoaders } = commonSlice.actions;

// Loader helper object for easier usage in thunks
export const loader = {
    present: (id: string, config?: LoaderConfig) => presentLoader({ id, config }),
    dismiss: (id: string) => dismissLoader(id),
    clearAll: () => clearAllLoaders(),
};
