import { Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native'
import React, { Component } from 'react'
import { AudioContext } from '../context/AudioProvider'
import { RecyclerListView, LayoutProvider } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from "expo-av";
import { play, pause, resume, playNext, selectAudio } from '../misc/audioController';
import { storeAudioForNextOpening } from '../misc/helper';

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      optionModalVisible: false,
    };

    this.currentItem = {}
  }

  layoutProvider = new LayoutProvider(
    i => 'audio',
    (type, dim) => {
      switch (type) {
        case 'audio':
          dim.width = Dimensions.get('window').width;
          dim.height = 70;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    }
  );

  // onPlaybackStatusUpdate = async (playbackStatus) => {
  //   if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
  //     this.context.updateState(this.context, {
  //       playbackPosition: playbackStatus.positionMillis,
  //       playbackDuration: playbackStatus.durationMillis,
  //     })
  //   }

  //   if (playbackStatus.didJustFinish) {
  //     const nextAudioIndex = this.context.currentAudioIndex + 1;
  //     //  there is no next audio to play
  //     if (nextAudioIndex >= this.context.totalAudioCount) {
  //       this.context.playbackobj.unloadAsync()
  //       this.context.updateState(this.context, {
  //         soundObj: null,
  //         currentAudio: this.context.audioFiles[0],
  //         isPlaying: false,
  //         currentAudioIndex: 0,
  //         playbackPosition: null,
  //         playbackDuration: null,
  //       })
  //       await storeAudioForNextOpening(this.context.audioFiles[0], 0)
  //     }
  //     //  otherwise we want to select the next audio
  //     const audio = this.context.audioFiles[nextAudioIndex];
  //     const status = await playNext(this.context.playbackobj, audio.uri)
  //     this.context.updateState(this.context, {
  //       soundObj: status,
  //       currentAudio: audio,
  //       isPlaying: true,
  //       currentAudioIndex: nextAudioIndex,
  //     })
  //     await storeAudioForNextOpening(audio, nextAudioIndex)
  //   }
  // }

  handleAudioPress = async audio => {
    await selectAudio(audio, this.context);
    // const {
    //   soundObj,
    //   playbackobj,
    //   currentAudio,
    //   updateState,
    //   audioFiles,
    // } = this.context;
    // // playing audio for the first time.
    // if (soundObj === null) {
    //   const playbackobj = new Audio.Sound();
    //   const status = await play(playbackobj, audio.uri);
    //   const index = audioFiles.indexOf(audio)
    //   updateState(this.context, {
    //     currentAudio: audio,
    //     playbackobj: playbackobj,
    //     soundObj: status,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   playbackobj.setOnPlaybackStatusUpdate(
    //     this.context.onPlaybackStatusUpdate)
    //   return storeAudioForNextOpening(audio, index)
    // }

    // // pause audio
    // if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
    //   const status = await pause(playbackobj);
    //   return updateState(this.context, { soundObj: status, isPlaying: false })
    // }

    // // resume audio
    // if (
    //   soundObj.isLoaded &&
    //   !soundObj.isPlaying &&
    //   currentAudio.id === audio.id
    // ) {
    //   const status = await resume(playbackobj);
    //   return updateState(this.context, { soundObj: status, isPlaying: true })
    // }

    // // select another audio
    // if (soundObj.isLoaded && currentAudio.id !== audio.id) {
    //   const status = await playNext(playbackobj, audio.uri)
    //   const index = audioFiles.indexOf(audio)
    //   updateState(this.context, {
    //     currentAudio: audio,
    //     soundObj: status,
    //     isPlaying: true,
    //     currentAudioIndex: index,
    //   });
    //   return storeAudioForNextOpening(audio, index)
    // }
  };

  componentDidMount() {
    this.context.loadPreviousAudio()
  }

  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        isPlaying={extendedState.isPlaying}
        activeListItem={this.context.currentAudioIndex === index}
        duration={item.duration}
        onAudioPress={() => this.handleAudioPress(item)}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.state, optionModalVisible: true })
        }}
      />
    );
  };

  navigateToPlaylist = () => {
    this.context.updateState(this.context, {
      addToPlayList: this.currentItem
    });
    this.props.navigation.navigate('PlayList');
  }

  render() {
    return (
      <AudioContext.Consumer >
        {({ dataProvider, isPlaying }) => {
          if (!dataProvider._data.length) return null;
          return (
            <Screen>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                // onPlayPress={() => console.log('playing audio')}
                // onPlayListPress={() => {
                //   this.context.updateState(this.context, {
                //     addToPlayList: this.currentItem
                //   })
                //   this.props.navigation.navigate('PlayList');
                // }}
                options={[
                  { 
                  title: 'Add to Playlist', 
                  onPress: this.navigateToPlaylist
                },
              ]}
                currentItem={this.currentItem}
                onclose={() =>
                  this.setState({ ...this.state, optionModalVisible: false })
                }
                visible={this.state.optionModalVisible}
              />
            </Screen>
          );
        }
        }
      </AudioContext.Consumer >
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default AudioList