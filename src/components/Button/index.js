import { ActivityIndicator, StyleSheet, Text, Dimensions, View } from "react-native";
import colors from "@src/config/colors";
import Ripple from "react-native-material-ripple";
const width = Math.round(Dimensions.get("window").width);
import Svg, { Path } from "react-native-svg";

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
            {props.icon && (
                <View style={{ marginRight: 10 }}>
                    {props.icon === "search" ? (
                        <Svg
                            width={16}
                            height={16}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M15.75 14.25h-.792l-.281-.272A6.79 6.79 0 0017 9a6.75 6.75 0 10-6.75 6.75c1.5 0 2.9-.537 4.016-1.464l.272.281v.792l5.25 5.25 1.5-1.5-5.25-5.25zm-5.25 0A4.5 4.5 0 119 6.75a4.5 4.5 0 011.5 8.715V14.25z"
                                fill="#fff"
                            />
                        </Svg>
                    ) : props.icon === "edit" ? (
                        <Svg
                            width={18}
                            height={18}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M2.15 16H3.4l9.25-9.25-1.225-1.25-9.275 9.275V16zm13.7-10.35L12.475 2.3l1.3-1.3c.3-.283.663-.425 1.088-.425.425 0 .779.142 1.062.425l1.225 1.225c.283.3.433.654.45 1.062.017.409-.125.755-.425 1.038L15.85 5.65zm-1.075 1.1L4.025 17.5H.65v-3.375L11.4 3.375l3.375 3.375zm-2.75-.625l-.6-.625 1.225 1.25-.625-.625z"
                                fill="#576570"
                            />
                        </Svg>
                    ) : props.icon === "delete" ? (
                        <Svg
                            width={16}
                            height={18}
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <Path
                                d="M3.3 17.5c-.5 0-.925-.175-1.275-.525A1.736 1.736 0 011.5 15.7V3h-1V1.5H5V.625h6V1.5h4.5V3h-1v12.7c0 .5-.175.925-.525 1.275-.35.35-.775.525-1.275.525H3.3zM13 3H3v12.7c0 .083.03.154.088.213A.289.289 0 003.3 16h9.4c.067 0 .133-.033.2-.1s.1-.133.1-.2V3zM5.4 14h1.5V5H5.4v9zm3.7 0h1.5V5H9.1v9zM3 3v13V3z"
                                fill="#576570"
                            />
                        </Svg>
                    ) : null}
                </View>
            )}
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
