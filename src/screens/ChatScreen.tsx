import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { socket } from '../services/socket';
import { Message } from '../types/models';

export default function ChatScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Conectar al socket
        socket.connect();

        // Escuchar mensajes del servidor
        socket.on('message:new', (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });


        return () => {
            socket.off('message');
            socket.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (input.trim() === '') return;
        const newMsg = { text: input, sender: 'Moi' };
        socket.emit('message', { text: input });
        setInput('');
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <FlatList
                data={messages}
                keyExtractor={(_, i) => i.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.messageBubble,
                            item.sender === 'Moi' ? styles.myMessage : styles.otherMessage,
                        ]}
                    >
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Écrire un message..."
                    value={input}
                    onChangeText={setInput}
                />
                <TouchableOpacity style={styles.button} onPress={sendMessage}>
                    <Text style={styles.buttonText}>Envoyer</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 115,
    },
    button: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        marginLeft: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 115,
    },
    buttonText: { color: '#fff', fontWeight: 'bold' },
    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
    },
    myMessage: {
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    otherMessage: {
        backgroundColor: '#e0e0e0',
        alignSelf: 'flex-start',
    },
    messageText: { color: '#fff' },
});
