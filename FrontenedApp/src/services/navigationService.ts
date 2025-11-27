import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigationService = {
    navigate: (name: string, params?: any) => {
        if (navigationRef.isReady()) {
            (navigationRef as any).navigate(name, params);
        }
    },

    goBack: () => {
        if (navigationRef.isReady() && navigationRef.canGoBack()) {
            navigationRef.goBack();
        }
    },

    reset: (routeName: string, params?: any) => {
        if (navigationRef.isReady()) {
            navigationRef.reset({
                index: 0,
                routes: [{ name: routeName as never, params }],
            });
        }
    },

    push: (name: string, params?: any) => {
        if (navigationRef.isReady()) {
            navigationRef.dispatch(StackActions.push(name, params));
        }
    },

    replace: (name: string, params?: any) => {
        if (navigationRef.isReady()) {
            navigationRef.dispatch(StackActions.replace(name, params));
        }
    },
};
