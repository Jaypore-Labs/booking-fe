import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const CustomCheckbox = ({ label, checked, onChange }) => {
    return (
        <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={onChange}
            activeOpacity={0.8}
        >
            <View style={[styles.checkbox, checked && styles.checkedCheckbox]}>
                {checked && <Text style={styles.checkmark}>✔</Text>}
            </View>
            {label && <Text style={styles.label}>{label}</Text>}
        </TouchableOpacity>
    );
};

export default CustomCheckbox;


const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#007AFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCheckbox: {
        backgroundColor: '#007AFF',
    },
    checkmark: {
        color: '#fff',
        fontWeight: 'bold',
    },
    label: {
        marginLeft: 8,
        fontSize: 16,
    },
});