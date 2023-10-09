import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableNativeFeedback
} from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons';
import color from '../misc/color';

const getThumbnailText = (filename) => filename[0]

const convertTime = minutes => {
    if (minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }

        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }

        if (sec < 10) {
            return `${minute}:0${sec}`;
        }

        return `${minute}:${sec}`;
    }
};

const renderPlayPauseIcon = isPlaying => {
    if (isPlaying)
        // play icon
        return <Entypo name="controller-paus" size={24} color={color.ACTIVE_font} />
    //   pause icon
    return <Entypo name="controller-play" size={24} color={color.ACTIVE_font} />

}

const AudioListItem = ({
    title,
    duration,
    onOptionPress,
    onAudioPress,
    isPlaying,
    activeListItem,
}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableNativeFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        <View style={[styles.thumbnail, {backgroundColor: activeListItem ? color.ACTIVE_BG : color.FONT_LIGHT}]}>
                            <Text style={styles.thumbnailText}>
                                {activeListItem ?
                                    renderPlayPauseIcon(isPlaying)
                                    : getThumbnailText(title)}
                            </Text>
                        </View>
                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={styles.title}>
                                {title}
                            </Text>
                            <Text style={styles.timeText}>{convertTime(duration)}</Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>
                <View style={styles.rightContainer}>
                    <Entypo
                        onPress={onOptionPress}
                        name="dots-three-vertical"
                        size={20}
                        color={color.FONT_MEDIUM}
                        style={{ padding: 10 }}
                    />
                </View>
            </View>
            <View style={styles.separator}></View>
        </>
    );
};
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: width - 80,
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        backgroundColor: color.FONT_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: color.FONT,
    },
    titleContainer: {
        width: width - 180,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        color: color.FONT,
    },
    separator: {
        width: width - 80,
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10,
    },
    timeText: {
        fontSize: 14,
        color: color.FONT_LIGHT,
    },
});

export default AudioListItem;