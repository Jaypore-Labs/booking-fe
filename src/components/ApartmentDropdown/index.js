import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../Button";
import { useSelector } from "react-redux";
import { createComment } from "../../endpoints/comment.service";
import { FlashAlert } from "../FlashAlert";

const ApartmentDropdown = ({ apartment }) => {
    const { user } = useSelector(({ user }) => user);
    const [comment, setComment] = useState("");
    const userId = user?.id;
    const [loader, setLoader] = useState(false);

    const onSave = async (id) => {
        setLoader(true);
        try {
            const res = await createComment({
                text: comment,
                userId: userId,
                postId: id,
            });
            if (res) {
                setComment("");
                FlashAlert({ title: "Comment created successfully" });
            }
        } catch (error) {
            FlashAlert({
                title: error?.message || "Failed to create comment",
                notIcon: true,
                duration: 1500,
                error: true,
            });
        } finally {
            setLoader(false);
        }
    };

    return (
        <View style={styles.apartmentCard}>
            <View style={styles.expandedSection}>
                <Text>{apartment.apartmentId}</Text>
                <TextInput
                    style={styles.commentInput}
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Add a comment..."
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Save"
                        onPress={() => onSave(apartment.apartmentId)}
                        disabled={loader}
                        style={styles.saveButton}
                    />
                </View>
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
});

export default ApartmentDropdown;
