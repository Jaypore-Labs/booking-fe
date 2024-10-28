import { createStackNavigator } from "@react-navigation/stack";
import PropertyList from "../../../../components/PropertyList";
import PropertyForm from "../../../../components/PropertyForm";
import { Pressable } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import colors from "../../../../config/colors";

const Stack = createStackNavigator();

export default function PropertiesPage() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PropertyList"
                component={PropertyList}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="PropertyForm"
                component={PropertyForm}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}
