import { createStackNavigator } from "@react-navigation/stack";
import PropertyList from "../../../../components/PropertyList";
import PropertyForm from "../../../../components/PropertyForm";

const Stack = createStackNavigator();

export default function PropertiesPage() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="PropertyList"
                component={PropertyList}
                options={{
                    title: "Property List",
                    headerShown: true,
                    headerLeft: () => null,
                }}
            />
            <Stack.Screen
                name="PropertyForm"
                component={PropertyForm}
                options={{ title: "Property form" }}
            />
        </Stack.Navigator>
    );
}
