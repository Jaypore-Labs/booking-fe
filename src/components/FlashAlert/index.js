import { showMessage } from "react-native-flash-message";
/**
 * Flash alert component
 * @param props
 */
export const FlashAlert = (props) => {
    showMessage({
        duration: props.duration ? props.duration : 3000,
        icon: !props.notIcon,
        message: props.title || "Default Title",
        action: props.action,
        type: 'success',
        floating: true,
        onPress: props.onPress,
        color: props.error ? '#000' : '#fff',
        error: props.error ? props.error : false,
    });
};
