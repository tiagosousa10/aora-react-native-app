import { useState, useEffect } from "react";
import { useVideoPlayer, VideoView } from 'expo-video';
import { View as AnimatableView } from "react-native-animatable";
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View
} from "react-native";
import { icons } from "../constants";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1,
  },
};

const zoomOut = {
  0: {
    scale: 1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);
  
  const videoURL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
  const player = useVideoPlayer(play ? videoURL : null, player => {
    if (play) {
      player.play();
    }
  });

  // Stop playing when this item is no longer active
  useEffect(() => {
    if (activeItem !== item.$id && play) {
      setPlay(false);
      player?.pause();
    }
  }, [activeItem, item.$id]);

  return (
    <AnimatableView
      style={{ marginRight: 20 }}
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      <View style={{ width: 208, height: 288, marginTop: 12 }}>
        {play ? (
          <VideoView
            player={player}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 35,
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            contentFit="cover"
            nativeControls={true}
            onEnd={() => {
              setPlay(false);
              player?.pause();
            }}
          />
        ) : (
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            activeOpacity={0.7}
            onPress={() => setPlay(true)}
          >
            <ImageBackground
              source={{
                uri: item.thumbnail,
              }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 33,
                overflow: 'hidden'
              }}
              imageStyle={{ borderRadius: 33 }}
              resizeMode="cover"
            >
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }}>
                <Image
                  source={icons.play}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        )}
      </View>
    </AnimatableView>
  );
};

const Trending = ({ posts = [] }) => {
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);

  const viewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems?.[0]?.item) {
      setActiveItem(viewableItems[0].item.$id);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
