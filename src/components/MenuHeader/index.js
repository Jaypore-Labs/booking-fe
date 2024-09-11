import { View, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useDispatch } from "react-redux";
import { userLogout } from "../../store/actions";

export default function MenuHeader({ navigation, title }) {
    const dispatch = useDispatch();

    const _logout = async () => {
        dispatch(userLogout());
        await AsyncStorage.clear();
    };

    return (
        <View style={styles.topBox}>
            <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.openDrawer()}
            >
                <Icon name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
                <TouchableOpacity style={styles.iconButton} onPress={_logout}>
                    <Icon name="logout" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("search")}
                >
                    <Icon name="search" size={28} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate("notification")}
                >
                    <Icon name="notifications" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBox: {
        backgroundColor: "mediumslateblue",
        padding: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rightIcons: {
        flexDirection: "row",
    },
    iconButton: {
        marginLeft: 16,
    },
});
