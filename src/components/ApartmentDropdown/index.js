import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import Button from '../Button';
// import { TextArea } from 'native-base';

const ApartmentDropdown = ({ apartment, onCommentChange, onComplete, onSave }) => {

    return (
        <View style={styles.apartmentCard}>
            <View style={styles.expandedSection}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Write a comment..."
                    value={apartment.comments}
                    onChangeText={(text) => onCommentChange(apartment.id, text)}
                />
                <View style={{ alignItems: 'flex-end', justifyContent: 'center', }}>
                    <Button
                        title="Save"
                        onPress={() => onSave(apartment.id)}
                        style={{ backgroundColor: 'black', width: '20%', marginTop: 8, marginBottom: 10, }}
                    />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                    <Button
                        title="Mark as Completed"
                        onPress={() => onComplete(apartment.id)}
                        disabled={apartment.completed}
                        style={{ backgroundColor: 'green', width: '80%' }}
                    />
                </View>

                {apartment.completed && <Text style={styles.completedText}>Completed</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    apartmentCard: {
        backgroundColor: '#E9EAEC',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    apartmentLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    expandedSection: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 10,
    },
    commentInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 8,
        marginTop: 8,
        marginBottom: 8,
    },
    completedText: {
        color: 'green',
        marginTop: 8,
    },
});

export default ApartmentDropdown;
