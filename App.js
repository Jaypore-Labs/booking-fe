import { Provider } from "react-redux";
import { store, persistor } from "./src/store";
import { PersistGate } from "redux-persist/integration/react";
import AppNavigator from "./src/navigation/AppNavigator";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { enableScreens } from "react-native-screens";
import { UserProvider } from "./src/hooks/useUser";

enableScreens();

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </PersistGate>
    </Provider>
  );
}
