import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
} from 'react-native';
import Header from "../../components/Header";

export default function Notification() {

    const [data, setData] = useState([
        { id: 1, message: 'Notification 1', read: false },
        { id: 2, message: 'Notification 1', read: false },
        { id: 3, message: 'Notification 2', read: true },
        { id: 4, message: 'Notification 3', read: false },
        { id: 5, message: 'Notification 3', read: true },
        { id: 6, message: 'Notification 2', read: true },
        { id: 7, message: 'Notification 3', read: false },

    ]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView style={{ flex: 1 }}>
                <View>
                    <Header title={"Notifications"} />
                    <ScrollView contentContainerStyle={styles.scrollView}>
                        <View style={styles.container}>
                            <View style={styles.notifications}>
                                <Text style={styles.date}>Today</Text>
                                {data.map(notification => (
                                    <View
                                        key={notification.id}
                                        style={[
                                            styles.notificationItem,
                                            { backgroundColor: notification.read ? 'lightblue' : '#f8f9fa' },
                                        ]}
                                    >
                                        <Text>{notification.message}</Text>
                                        <Text>hello how are you</Text>
                                        <Text style={styles.timestamp}>10:31 am</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    notifications: {
        marginTop: 20,
    },
    notificationItem: {
        margin: 10,
        padding: 10,
        border: '1 solid #ccc',
        borderRadius: 8,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ccc',
    },
});
