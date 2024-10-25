import { Pressable, StyleSheet, View, Text, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackSvg from "../../../resource/svgs/backSvg";
const width = Dimensions.get("window").width;
/**
 * Header Component
 * @param props
 * @returns
 */
const Header = (props) => {
    const navigation = useNavigation();
    const handlePress = () => {
        if (props.navigation) {
            navigation.navigate(props.navigation); // Only called when pressed
        } else {
            navigation.goBack(); // Go back if no navigation prop is passed
        }
    };
    return (
        <View style={{ ...styles.header, ...props.style }}>
            <Pressable
                style={{
                    paddingHorizontal: 0,
                }}
                onPress={() => handlePress()}
            >
                <BackSvg />
            </Pressable>

            {props.title ? <Text style={styles.text}>{props.title}</Text> : null}
            <View />
        </View>
    );
};
export default Header;

const styles = StyleSheet.create({
    header: {
        width: width,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        backgroundColor: "#fff",
    },
    text: {
        fontSize: 16,
        textTransform: "capitalize",
        fontWeight: "600",
        marginLeft: -20,
    },
});
