import { createStackNavigator } from "@react-navigation/stack";
import BookingsList from "../../../../components/BookList";
import BookingForm from "../../../../components/BookingForm";

const Stack = createStackNavigator();

export default function BookingsPage() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="BookingsList"
                component={BookingsList}
                options={{ title: "Bookings" }}
            />
            <Stack.Screen
                name="BookingForm"
                component={BookingForm}
                options={{ title: "Booking Form" }}
            />
        </Stack.Navigator>
    );
}
