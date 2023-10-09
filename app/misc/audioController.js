import { storeAudioForNextOpening } from "./helper";

//   play audio
export const play = async (playbackobj, uri, lastPosition) => {
    try {
        if (!lastPosition) return await playbackobj.loadAsync(
            { uri },
            { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
        );

        // but if there is lastPosition then we will play audio from the lastPosition
        await playbackobj.loadAsync(
            { uri },
            { progressUpdateIntervalMillis: 1000 }
        );

        return await playbackobj.playFromPositionAsync(lastPosition);


    } catch (error) {
        console.log('error inside play helper method', error.message)
    }
};

//  pause audio
export const pause = async (playbackobj) => {
    try {
        return await playbackobj.setStatusAsync({
            shouldPlay: false
        });
    } catch (error) {
        console.log('error inside pause helper method', error.message);
    }
};

//  resume audio
export const resume = async (playbackobj) => {
    try {
        return await playbackobj.playAsync();
    } catch (error) {
        console.log('error inside resume helper method', error.message);
    }
};

//  select another audio
export const playNext = async (playbackobj, uri) => {
    try {
        await playbackobj.stopAsync();
        await playbackobj.unloadAsync();
        return await play(playbackobj, uri);
    } catch (error) {
        console.log('error inside play next helper method', error.message)
    }
};

export const selectAudio = async (audio, context, playListInfo = {}) => {
    const {
        soundObj,
        playbackobj,
        currentAudio,
        updateState,
        audioFiles,
        onPlaybackStatusUpdate,
    } = context;
    try {
        // playing audio for the first time.
        if (soundObj === null) {
            const status = await play(playbackobj, audio.uri, audio.lastPosition);
            const index = audioFiles.findIndex(({ id }) => id === audio.id);
            updateState(context, {
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
                isPlayListRunning: false,
                activePlayList: [],
                ...playListInfo,
            });
            playbackobj.setOnPlaybackStatusUpdate(
                onPlaybackStatusUpdate)
            return storeAudioForNextOpening(audio, index)
        }

        // pause audio
        if (
            soundObj.isLoaded &&
            soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await pause(playbackobj);
            return updateState(context,
                {
                    soundObj: status,
                    isPlaying: false,
                    playbackPosition: status.positionMillis,
                }
            )
        }

        // resume audio
        if (
            soundObj.isLoaded &&
            !soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await resume(playbackobj);
            return updateState(context, { soundObj: status, isPlaying: true })
        }

        // select another audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackobj, audio.uri);
            const index = audioFiles.findIndex(({ id }) => id === audio.id);
            updateState(context, {
                currentAudio: audio,
                soundObj: status,
                isPlaying: true,
                currentAudioIndex: index,
                isPlayListRunning: false,
                activePlayList: [],
                ...playListInfo,
            });
            return storeAudioForNextOpening(audio, index)
        }
    } catch (error) {
        console.log('error inside select audio method.', error.message);
    }
};

const selectAudioFromPlayList = async (context, select) => {
    const {
        activePlayList,
        currentAudio,
        audioFiles,
        playbackobj,
        updateState,
    } = context;
    let audio;
    let defaultIndex;
    let nextIndex;
    const indexOnPlayList =
        activePlayList.audios.findIndex(({ id }) => id === currentAudio.id);
    if (select === 'next') {
        nextIndex = indexOnPlayList + 1;
        defaultIndex = 0;
    }

    if (select === 'previous') {
        nextIndex = indexOnPlayList - 1;
        defaultIndex = activePlayList.audios.length - 1;
    }

    audio = activePlayList.audios[nextIndex];

    if (!audio) audio = activePlayList.audios[defaultIndex];

    const indexOnAllList = audioFiles.findIndex(
        ({ id }) => id === audio.id);

    const status = await playNext(playbackobj, audio.uri);
    return updateState(context, {
        soundObj: status,
        isPlaying: true,
        currentAudio: audio,
        currentAudioIndex: indexOnAllList,
    })
}

export const changeAudio = async (context, select) => {
    const {
        playbackobj,
        currentAudioIndex,
        totalAudioCount,
        audioFiles,
        updateState,
        onPlaybackStatusUpdate,
        isPlayListRunning,
    } = context;

    if (isPlayListRunning) return selectAudioFromPlayList(context, select)
    try {
        const { isLoaded } = await playbackobj.getStatusAsync();
        const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
        const isFirstAudio = currentAudioIndex <= 0;
        let audio;
        let index;
        let status;

        // for next
        if (select === 'next') {
            audio = audioFiles[currentAudioIndex + 1];
            if (!isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1;
                status = await play(playbackobj, audio.uri);
                playbackobj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }

            if (isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1
                status = await playNext(playbackobj, audio.uri)
            }

            if (isLastAudio) {
                index = 0;
                audio = audioFiles[index];
                if (isLoaded) {
                    status = await playNext(playbackobj, audio.uri)
                } else {
                    status = await play(playbackobj, audio.uri)
                }
            }
        }


        //  for previous
        if (select === 'previous') {
            audio = audioFiles[currentAudioIndex - 1];
            if (!isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1;
                status = await play(playbackobj, audio.uri);
                playbackobj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }

            if (isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1
                status = await playNext(playbackobj, audio.uri)
            }

            if (isFirstAudio) {
                index = totalAudioCount - 1;
                audio = audioFiles[index];
                if (isLoaded) {
                    status = await playNext(playbackobj, audio.uri)
                } else {
                    status = await play(playbackobj, audio.uri)
                }
            }
        }

        updateState(context, {
            currentAudio: audio,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });
        storeAudioForNextOpening(audio, index);
    } catch (error) {
        console.log('error inside change audio method.', error.message);
    }
};

export const moveAudio = async (context, value) => {
    const {
        soundObj,
        isPlaying,
        playbackobj,
        updateState,
    } = context;
    if (soundObj === null || !isPlaying) return;

    try {
        const status = await playbackobj.setPositionAsync(
            Math.floor(soundObj.durationMillis * value)
        )
        updateState(context, {
            soundObj: status,
            playbackPosition: status.positionMillis,
        });

        await resume(playbackobj);
    } catch (error) {
        console.log('error inside onSlidingComplete callback', error.message);
    }

}

