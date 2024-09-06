import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { enableScreens } from "react-native-screens";
import { UserProvider } from "./src/hooks/useUser";
import { NavigationContainer } from "@react-navigation/native";
import { navigationRef } from "./src/utils/rootNavigation";

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <NavigationContainer ref={navigationRef}>
            <AppNavigator />
          </NavigationContainer>

        </UserProvider>
      </PersistGate>
    </Provider>
  );
}