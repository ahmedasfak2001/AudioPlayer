import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Screen from '../components/Screen'
import color from '../misc/color'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { changeAudio, moveAudio, pause, play, playNext, resume, selectAudio } from '../misc/audioController';
import { convertTime, storeAudioForNextOpening } from '../misc/helper';

const { width } = Dimensions.get('window')

const Player = () => {
  const [currentPosition, setCurrentPosition] = useState(0);
  const context = useContext(AudioContext);
  const {
    playbackPosition,
    playbackDuration,
    currentAudio,
  } = context;

  const calculateSeekBar = () => {
    if (playbackPosition !== null && playbackDuration !== null) {
      return playbackPosition / playbackDuration;
    }

    if (currentAudio.lastPosition) {
      return currentAudio.lastPosition / (currentAudio.duration * 1000)
    }

    return 0;
  }

  useEffect(() => {
    context.loadPreviousAudio();
  }, []);

  const handlePlayPause = async () => {
    await selectAudio(context.currentAudio, context);
    //  play
    // if (context.soundObj === null) {
    //   const audio = context.currentAudio;
    //   const status = await play(context.playbackobj, audio.uri)
    //   context.playbackobj.setOnPlaybackStatusUpdate(
    //     context.onPlaybackStatusUpdate)
    //   return context.updateState(context, {
    //     soundObj: status,
    //     currentAudio: audio,
    //     isPlaying: true,
    //     currentAudioIndex: context.currentAudioIndex,
    //   })
    // }
    // //  pause
    // if (context.soundObj && context.soundObj.isPlaying) {
    //   const status = await pause(context.playbackobj)
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: false,
    //   })
    // }
    // //  resume
    // if (context.soundObj && !context.soundObj.isPlaying) {
    //   const status = await resume(context.playbackobj)
    //   return context.updateState(context, {
    //     soundObj: status,
    //     isPlaying: true,
    //   })
    // }
  }

  //  play next audio
  const handleNext = async () => {
    await changeAudio(context, 'next');
    // const { isLoaded } = await context.playbackobj.getStatusAsync();
    // const isLastAudio = context.currentAudioIndex + 1 === context.totalAudioCount;
    // let audio = context.audioFiles[context.currentAudioIndex + 1];
    // let index;
    // let status;

    // if (!isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1
    //   status = await play(context.playbackobj, audio.uri)
    // }

    // if (isLoaded && !isLastAudio) {
    //   index = context.currentAudioIndex + 1
    //   status = await playNext(context.playbackobj, audio.uri)
    // }

    // if (isLastAudio) {
    //   index = 0;
    //   audio = context.audioFiles[index];
    //   if (isLoaded) {
    //     status = await playNext(context.playbackobj, audio.uri)
    //   } else {
    //     status = await play(context.playbackobj, audio.uri)
    //   }
    // }

    // context.updateState(context, {
    //   currentAudio: audio,
    //   playbackobj: context.playbackobj,
    //   soundObj: status,
    //   isPlaying: true,
    //   currentAudioIndex: index,
    //   playbackPosition: null,
    //   playbackDuration: null,
    // });
    // storeAudioForNextOpening(audio, index);
  }

  //  play previous audio
  const handlePrevious = async () => {
    await changeAudio(context, 'previous');
    // const { isLoaded } = await context.playbackobj.getStatusAsync();
    // const isFirstAudio =
    //   context.currentAudioIndex <= 0;
    // let audio = context.audioFiles[context.currentAudioIndex - 1];
    // let index;
    // let status;

    // if (!isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1
    //   status = await play(context.playbackobj, audio.uri)
    // }

    // if (isLoaded && !isFirstAudio) {
    //   index = context.currentAudioIndex - 1
    //   status = await playNext(context.playbackobj, audio.uri)
    // }

    // if (isFirstAudio) {
    //   index = context.totalAudioCount - 1;
    //   audio = context.audioFiles[index];
    //   if (isLoaded) {
    //     status = await playNext(context.playbackobj, audio.uri)
    //   } else {
    //     status = await play(context.playbackobj, audio.uri)
    //   }
    // }

    // context.updateState(context, {
    //   currentAudio: audio,
    //   playbackobj: context.playbackobj,
    //   soundObj: status,
    //   isPlaying: true,
    //   currentAudioIndex: index,
    //   playbackPosition: null,
    //   playbackDuration: null,
    // });
    // storeAudioForNextOpening(audio, index);
  }

  const renderCurrentTime = () => {
    if(!context.soundObj && currentAudio.lastPosition){
      return convertTime(currentAudio.lastPosition / 1000);
    }
    return convertTime(context.playbackPosition / 1000);
  }

  if (!context.currentAudio) return null;

  return (
    <Screen>
      <View style={styles.container}>
        <View style={styles.audioCountContainer}>
          <View style={{ flexDirection: 'row' }}>
            {context.isPlayListRunning && (
              <>
                <Text style={{ fontWeight: 'bold' }}>From Playlist: </Text>
                <Text>{context.activePlayList.title}</Text>
              </>
            )}
          </View>
          <Text style={styles.audioCount}>
            {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
          </Text>
        </View>
        <View style={styles.midBannerContainer}>
          <MaterialCommunityIcons
            name="music-circle"
            size={300}
            color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
          />
        </View>
        <View style={styles.audioPlayerContainer}>
          <Text numberOfLines={1} style={styles.audioTitle}>
            {context.currentAudio.filename}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 15,
            }}>
            <Text>
              {currentPosition ? currentPosition : renderCurrentTime()}
            </Text>
            <Text>
              {convertTime(context.currentAudio.duration)}
            </Text>
          </View>
          <Slider
            style={{ width: width, height: 40 }}
            minimumValue={0}
            maximumValue={1}
            value={calculateSeekBar()}
            minimumTrackTintColor={color.FONT_MEDIUM}
            maximumTrackTintColor={color.ACTIVE_BG}
            onValueChange={(value) => {
              setCurrentPosition(
                convertTime(value * context.currentAudio.duration)
              );
            }}
            onSlidingStart={async () => {
              if (!context.isPlaying) return;

              try {
                await pause(context.playbackobj)
              } catch (error) {
                console.log('error inside onSlidingStart callback', error.message);
              }
            }}
            onSlidingComplete={
              async value => {
                await moveAudio(context, value)
                setCurrentPosition(0);
              }
            }
          />
          <View style={styles.audioControllers}>
            <PlayerButton
              onPress={handlePrevious}
              iconType='PREV'
            />
            <PlayerButton
              onPress={handlePlayPause}
              style={{ marginHorizontal: 25 }}
              iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
            />
            <PlayerButton
              onPress={handleNext}
              iconType='NEXT'
            />
          </View>
        </View>
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  audioCount: {
    textAlign: 'right',
    color: color.FONT_LIGHT,
    fontSize: 14,
  },
  audioCountContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    justifyContent: 'space-between'
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
    padding: 15,
  },
  audioControllers: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
})

export default Player;

