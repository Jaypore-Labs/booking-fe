import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator";
import { enableScreens } from "react-native-screens";
import { UserProvider } from "./src/hooks/useUser";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./src/utils/rootNavigation";
import FlashMessage from "react-native-flash-message";

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
            <FlashMessage position="top" style={{ zIndex: 9999 }} />
          </NavigationContainer>
        </UserProvider>
      </PersistGate>
    </Provider>
  );
}
