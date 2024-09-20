import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../Button";

const ApartmentDropdown = ({
    apartment,
    onCommentChange,
    onComplete,
    onSave,
}) => {
    return (
        <View style={styles.apartmentCard}>
            <View style={styles.expandedSection}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    value={apartment.comments}
                    onChangeText={(text) => onCommentChange(apartment.id, text)}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Save"
                        onPress={() => onSave(apartment.id)}
                        style={styles.saveButton}
                    />
                </View>
                <View style={styles.centeredButtonContainer}>
                    <Button
                        title="Mark as Completed"
                        onPress={() => onComplete(apartment.id)}
                        disabled={apartment.completed}
                        style={styles.completeButton}
                    />
                </View>
                {apartment.completed && (
                    <Text style={styles.completedText}>Completed</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    apartmentCard: {
        backgroundColor: "#E9EAEC",
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    expandedSection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 10,
    },
    commentInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    buttonContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "black",
        width: "20%",
        marginTop: 8,
        marginBottom: 10,
    },
    centeredButtonContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    completeButton: {
        backgroundColor: "green",
        width: "80%",
    },
    completedText: {
        color: "green",
        marginTop: 8,
    },
});

export default ApartmentDropdown;
