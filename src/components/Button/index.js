import { ActivityIndicator, StyleSheet, Text, Dimensions } from "react-native";
import colors from "@src/config/colors";
import Ripple from "react-native-material-ripple";
const width = Math.round(Dimensions.get("window").width);

/**
 * Button component
 *
 * @param props
 * @returns
 */
const Button = (props) => {
    return (
        <Ripple
            disabled={props.disabled}
            rippleColor="rgba(255,255,255,0.5)"
            {...props}
            style={{
                ...styles.button,
                ...props.style,
                opacity: props.disabled ? 0.5 : 1,
            }}
        >
            {props.loader ? (
                <ActivityIndicator color={colors.white} />
            ) : (
                <Text
                    style={{
                        fontSize: 16,
                        color: props.textColor ? props.textColor : colors.white,
                        textAlign: "center",
                        fontWeight: "500",
                    }}
                >
                    {props.title}
                </Text>
            )}
        </Ripple>
    );
};
export default Button;

const styles = StyleSheet.create({
    button: {
        width: width - 50,
        padding: 13,
        backgroundColor: colors.primary,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
