// android/app/src/navigation/navigationRef.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const resetToAuth = () => {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Auth' }], // 👈 debe existir en tu RootStack
        });
    }
};

export const resetToMain = () => {
    if (navigationRef.isReady()) {
        navigationRef.reset({
            index: 0,
            routes: [{ name: 'Main' }], // 👈 pantalla raíz con el Drawer
        });
    }
};
