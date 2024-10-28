import * as React from "react";
import HomeScreen from "./child-screens/home/HomeScreen";
import { View, Text, Image, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import PropertiesPage from "./child-screens/Property";
import BookingsPage from "./child-screens/Booking";
import ApartmentList from "./child-screens/apartment/index";
import MenuHeader from "../../components/MenuHeader";
import { useUser } from "../../hooks/useUser";
import colors from "../../config/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
    DrawerContentScrollView,
    DrawerItemList,
} from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

export default function Home() {
    const { userRole, username } = useUser();
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            screenOptions={{
                drawerActiveBackgroundColor: colors.primary,
                drawerActiveTintColor: "#ffffff",
                drawerInactiveTintColor: "#808080",
            }}
            drawerContent={(props) => (
                <CustomDrawerContent {...props} user={username} />
            )}
        >
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
                        name="Apartment List"
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

const CustomDrawerContent = (props) => {
    return (
        <DrawerContentScrollView {...props}>
            <View style={styles.userInfoContainer}>
                <AntDesign name="user" size={24} color="#000" style={styles.userIcon} />
                <Text style={styles.username}>{props.user ? props.user : "Guest"}</Text>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    userInfoContainer: {
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    userIcon: {
        // width: 40,
        // height: 40,
        // borderRadius: 20,
        marginRight: 8,
    },
    username: {
        fontSize: 16,
        fontWeight: "bold",
    },
});
