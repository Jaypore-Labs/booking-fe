import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import Button from "../Button";
import { useSelector } from "react-redux";
import { createComment, fetchComments } from "../../endpoints/comment.service";
import { FlashAlert } from "../FlashAlert";

const ApartmentDropdown = ({ apartment, name }) => {
    const { user } = useSelector(({ user }) => user);
    const [comment, setComment] = useState("");
    const userId = user?.id;
    const [loader, setLoader] = useState(false);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const getComments = async () => {
            try {
                const response = await fetchComments(apartment.apartmentId, userId);
                setComments(response?.results);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        getComments(); // Fetch comments on component mount or when apartment changes
    }, [userId, apartment.apartmentId]);

    const onSave = async (id) => {
        if (!comment.trim()) {
            FlashAlert({
                title: "Comment cannot be empty",
                notIcon: true,
                duration: 1500,
                error: true,
            });
            return;
        }
        setLoader(true);
        const timestamp = new Date().toLocaleString();
        try {
            const res = await createComment({
                text: `${timestamp}: ${comment} (By ${name})`,
                userId: userId,
                postId: id,
            });
            if (res) {
                setComment("");
                // setComments([...comments, newComment]);
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

    const filterCommentText = (commentText) => {
        return commentText.replace(/\s*\(By.*\)$/, "");
    };
    return (
        <View style={styles.apartmentCard}>
            <View style={styles.expandedSection}>
                <Text>{name}</Text>
                <Text>
                    CheckOut: {new Date(apartment.checkOut).toLocaleString()} / CheckIn:{" "}
                    {new Date(apartment.checkIn).toLocaleString()}
                </Text>
                <View style={styles.commentcard}>
                    <TextInput
                        style={styles.commentInput}
                        value={comment}
                        onChangeText={setComment}
                        placeholder="Add a comment..."
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    <View style={styles.buttonContainer}>
                        <Button
                            title="Save"
                            loader={loader}
                            onPress={() => onSave(apartment.apartmentId)}
                            disabled={loader}
                            style={styles.saveButton}
                        />
                    </View>
                </View>
                <ScrollView style={styles.commentsContainer}>
                    {comments.length > 0 ? (
                        comments.map((commentItem, index) => (
                            <View key={index} style={styles.commentItem}>
                                {/* <Text style={styles.userIcon}>👤</Text> */}
                                <Text style={styles.commentText}>
                                    {" "}
                                    {filterCommentText(commentItem.text)}
                                </Text>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noComments}>No comments yet</Text>
                    )}
                </ScrollView>
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
        paddingTop: 10,
    },
    commentcard: {
        padding: 6,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
    },
    commentInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginTop: 8,
        marginBottom: 8,
        height: 80,
    },
    buttonContainer: {
        alignItems: "flex-end",
        justifyContent: "center",
    },
    saveButton: {
        backgroundColor: "#7b68ee",
        width: "20%",
        marginTop: 8,
        marginBottom: 10,
    },
    commentsContainer: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 10,
    },
    commentItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    userIcon: {
        marginRight: 8,
        fontSize: 18,
    },
    commentText: {
        // fontSize: 16,
        color: "#777",
    },
    noComments: {
        // fontStyle: "italic",
        color: "#777",
    },
});

export default ApartmentDropdown;
