import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import Button from "../Button";
import { useSelector } from "react-redux";
import createComment from "../../endpoints/comment.service";

const ApartmentDropdown = ({ apartment }) => {
    const { user } = useSelector(({ user }) => user);
    const [comment, setComment] = useState("");
    const userId = user?.userId;
    const { loader, setLoader } = useState(false);

    const onSave = async (id) => {
        setLoader(true);
        await createComment({
            text: comment,
            userId: userId || "66f6b8547ef59f275c2faed2",
            postId: id,
        })
            .then((res) => {
                if (res) {
                    setComment("");
                    FlashAlert({ title: "Comment created successfully" });
                }
            })
            .catch((error) => {
                console.log(error);
                FlashAlert({
                    title: error?.message,
                    notIcon: true,
                    duration: 1500,
                    error: true,
                });
            })
            .finally(() => setLoader(false));
    };

    return (
        <View style={styles.apartmentCard}>
            <View style={styles.expandedSection}>
                <TextInput
                    style={styles.commentInput}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Save"
                        onPress={() => onSave(apartment.apartmentId)}
                        style={styles.saveButton}
                    />
                </View>
                {/*<View style={styles.centeredButtonContainer}>
                    <Button
                        title="Mark as Completed"
                        onPress={() => onComplete(apartment.id)}
                        disabled={apartment.completed}
                        style={styles.completeButton}
                    />
                </View>
                {apartment.completed && (
                    <Text style={styles.completedText}>Completed</Text>
                )} */}
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
