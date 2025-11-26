import React, { useState, useCallback, useEffect } from 'react'
import { Platform } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export function Chat() {
    const [messages, setMessages] = useState([])
    const insets = useSafeAreaInsets()

    // If you have a tab bar, include its height
    const tabbarHeight = 50
    const keyboardTopToolbarHeight = Platform.select({ ios: 44, default: 0 })
    const keyboardVerticalOffset = insets.bottom + tabbarHeight + keyboardTopToolbarHeight

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'John Doe',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
    }, [])

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}

            keyboardAvoidingViewProps={{ keyboardVerticalOffset }}
        />
    )
}
