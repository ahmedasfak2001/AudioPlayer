import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import color from '../misc/color'

const PlayerButton = (props) => {

    const {
        iconType,
        size = 40,
        iconColor = color.FONT,
        onPress,
    } = props
    const getIconName = (type) => {
        switch (type) {
            case 'PLAY':
                // icon related to play
                return 'pausecircle';
            case 'PAUSE':
                // icon related to pause
                return 'playcircleo';
            case 'NEXT':
                // icon related to next
                return 'forward';
            case 'PREV':
                // icon related to previous
                return 'banckward';
        }
    }
    return (
        <AntDesign
            {...props}
            onPress={onPress}
            name={getIconName(iconType)}
            size={size}
            color={iconColor}
        />
    )
}

export default PlayerButton