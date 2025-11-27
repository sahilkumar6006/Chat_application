import { useSelector } from 'react-redux';
import { selectIsLoading } from '@app/modules/common';

/**
 * Custom hook to check if a specific loader is active
 * @param loaderId - The ID of the loader to check
 * @returns boolean indicating if the loader is active
 */
export const useLoading = (loaderId: string): boolean => {
    return useSelector(selectIsLoading(loaderId));
};

export default useLoading;
