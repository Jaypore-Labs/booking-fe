import * as React from "react";
import HomeScreen from "./child-screens/home/HomeScreen";
import { createDrawerNavigator } from "@react-navigation/drawer";
import PropertiesPage from "./child-screens/Property";
import BookingsPage from "./child-screens/Booking";
import ApartmentList from "./child-screens/apartment/index";
import MenuHeader from "../../components/MenuHeader";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../hooks/useUser";

const Drawer = createDrawerNavigator();

export default function Home() {
    // const navigation = useNavigation();
    const { userRole } = useUser();
    return (
        <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen
                name="Home"
                component={HomeScreen}
                options={({ navigation }) => ({
                    header: () => <MenuHeader navigation={navigation} title="Home" />,
                })}
            />
            {userRole !== "user" && (
                <>
                    <Drawer.Screen
                        name="ApartmentList"
                        component={ApartmentList}
                        options={({ navigation }) => ({
                            header: () => (
                                <MenuHeader navigation={navigation} title="Apartment" />
                            ),
                        })}
                    />
                    <Drawer.Screen
                        name="Properties"
                        component={PropertiesPage}
                        options={{ headerShown: false }}
                    />
                    <Drawer.Screen
                        name="Bookings"
                        component={BookingsPage}
                        options={{ headerShown: false }}
                    />
                </>
            )}
        </Drawer.Navigator>
    );
}
