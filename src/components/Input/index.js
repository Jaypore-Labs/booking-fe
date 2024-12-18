import { View, Text, TextInput, Pressable, Platform } from "react-native";
import React, { useState } from "react";
import { Eye, EyeOff } from "react-native-feather";
import colors from "@src/config/colors";

/**
 * Custom Input Component
 * @param props
 * @returns
 */
export default function CustomInput(props) {
    const [focus, setFocus] = useState(false);

    return (
        <View style={{ position: "relative" }}>
            <View
                style={{
                    marginBottom: 8,
                    marginTop: 10,
                    backgroundColor: focus
                        ? "rgba(0,102,255,0.08)"
                        : props.error
                            ? "rgba(241,84,63,0.12)"
                            : colors.light,
                    padding: Platform.OS === "ios" ? 14 : 8,
                    borderRadius: 8,
                    borderWidth: 0.5,
                    height: 45,
                    borderColor: focus
                        ? colors.primary
                        : props.error
                            ? "rgba(241,84,63,0.9)"
                            : colors.light,
                }}
            >
                <TextInput
                    {...props}
                    style={{
                        padding: 0,
                        fontSize: 14,
                        flex: 1,
                        color: colors.black,
                    }}
                    placeholder={props.placeholder}
                    placeholderTextColor={colors.disabled}
                    selectionColor={colors.primary}
                    secureTextEntry={props.secureTextEntry}
                    onFocus={() => {
                        setFocus(true);
                    }}
                    onBlur={() => {
                        setFocus(false);
                        if (props.onBlur) props.onBlur();
                    }}
                />
                {props.toggleSecureEntry ? (
                    <Pressable
                        style={{
                            position: "absolute",
                            right: 20,
                            bottom: 16,
                        }}
                        onPress={props.toggleSecureEntry}
                    >
                        {props.secureTextEntry ? (
                            <EyeOff
                                stroke={colors.disabled}
                                fill="none"
                                width={18}
                                height={18}
                            />
                        ) : (
                            <Eye
                                stroke={colors.disabled}
                                fill="none"
                                width={18}
                                height={18}
                            />
                        )}
                    </Pressable>
                ) : null}
            </View>
            {props.errorMessage && (
                <Text
                    style={{
                        // fontSize: 10,
                        // position: "absolute",
                        // top: 52,
                        // left: 4,
                        color: colors.danger,
                        // color: colors.para,
                        fontSize: 12,
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                >
                    {props.errorMessage}
                </Text>
            )}
        </View>
    );
}
