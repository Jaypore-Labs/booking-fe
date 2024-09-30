import { showMessage } from "react-native-flash-message";

export const FlashAlert = ({
    duration = 3000,
    notIcon = false,
    title = "Default Title",
    action,
    type = "success",
    floating = true,
    onPress,
    color,
    error = false,
}) => {
    showMessage({
        duration: duration,
        icon: !notIcon,
        message: title,
        action: action,
        type: error ? "danger" : type,
        floating: floating,
        onPress: onPress,
        color: error ? "#000" : color || "#fff",
    });
};
