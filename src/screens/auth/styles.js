import { Dimensions, StyleSheet } from "react-native";
import colors from "../../config/colors";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export default StyleSheet.create({
    wrapper: {
        width: width,
        height: height,
        backgroundColor: colors.white,
        flex: 1,
        justifyContent: "center",  // Vertically center the content
        alignItems: "center",
    },
    heading: {
        fontSize: 30,
        color: colors.text,
        fontWeight: "600",
        marginTop: 20,
        // marginBottom: 8,
    },
    para: {
        fontSize: 15,
        color: colors.para,
    },
    paraHighlighted: {
        fontSize: 15,
        color: colors.primary,
        marginLeft: 4,
        position: "absolute",
        bottom: -3,
    },
    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: "#03DAC6",
    },

    underlineStyleBase: {
        width: 35,
        height: 45,
        borderWidth: 0,
        borderBottomWidth: 1,
        color: "#010F07",
    },

    underlineStyleHighLighted: {
        borderColor: "#7b68ee",
    },
    absoluted: {
        position: "absolute",
        right: 0,
        bottom: 0,
    },
    inputLabel: {
        fontSize: 12,
        letterSpacing: 1,
        width: "100%",
        marginTop: 40,
        marginBottom: 8,
        color: "#9C9C9C",
        textTransform: "uppercase",
    },
});
