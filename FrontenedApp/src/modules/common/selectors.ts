import type { RootState } from '@app/redux/store';

export const selectLoaders = (state: RootState) => state.commonSlice.loaders;

export const selectIsLoading = (id: string) => (state: RootState) => {
    return !!state.commonSlice.loaders[id];
};

export const selectIsAnyLoading = (state: RootState) => {
    return Object.keys(state.commonSlice.loaders).length > 0;
};

export const selectGlobalLoaders = (state: RootState) => {
    return Object.entries(state.commonSlice.loaders)
        .filter(([_, config]) => config.global)
        .map(([id]) => id);
};
