import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Switch,
    StyleSheet,
    Pressable,
} from "react-native";

export default function PropertyForm({ route, navigation }) {
    const { property } = route.params || {};
    const [name, setName] = useState(property ? property.name : "");
    const [price, setPrice] = useState(property ? property.price : "");
    const [type, setType] = useState(property ? property.type : "Studio");
    const [active, setActive] = useState(property ? property.active : true);
    const [comments, setComments] = useState(property ? property.comments : "");

    const handleSubmit = () => {
        const updatedProperty = { name, price, type, active, comments };
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.labeltext}>Property Name</Text>
            <TextInput value={name} onChangeText={setName} style={styles.input} />

            <Text style={styles.labeltext}>Price</Text>
            <TextInput
                value={price}
                onChangeText={setPrice}
                style={styles.input}
                keyboardType="numeric"
            />

            <Text style={styles.labeltext}>Type</Text>
            <TextInput value={type} onChangeText={setType} style={styles.input} />

            <Text style={styles.labeltext}>Comments</Text>
            <TextInput
                value={comments}
                onChangeText={setComments}
                style={styles.input}
            />
            <Text style={styles.labeltext}>Active</Text>
            <Switch value={active} onValueChange={setActive} />
            <Pressable style={styles.button}>
                <Text style={{ fontSize: 16, color: "#fff" }} onPress={handleSubmit}>
                    Save
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#fff",
    },
    labeltext: {
        fontSize: 16,
        fontWeight: "500",
    },
    input: {
        marginBottom: 8,
        border: 1,
        borderColor: "#D9DBDC",
        borderWidth: 1,
        fontSize: 14,
        marginTop: 6,
        padding: 10,
        borderRadius: 8,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 4,
        elevation: 3,
        margin: 6,
        borderRadius: 6,
        padding: 8,
        backgroundColor: "#7b68ee",
    },
});
