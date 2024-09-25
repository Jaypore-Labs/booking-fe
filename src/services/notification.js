import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } =
            await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            alert("Failed to get push token for push notification!");
            return;
        }
        try {
            const projectId = "0c2c4dac-aae0-4c66-82b6-8b236c1b1acf";
            if (!projectId) {
                throw new Error("Project ID not found");
            }
            token = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
        } catch (e) {
            token = `${e}`;
        }
    } else {
        alert("Must use physical device for Push Notifications");
    }

    return token;
}

