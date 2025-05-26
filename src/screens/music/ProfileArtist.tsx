import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {usePlayerStore} from '../../stores/usePlayerStore';
import MoreOptionsModal from '../../components/MoreOptionsModal';

// Mock data cho nghệ sĩ
const MOCK_ARTIST = {
  id: '1',
  name: 'Sơn Tùng M-TP',
  bio: 'đẹp trai',
  followers: '15.2M',
  monthlyListeners: '8.5M',
  songCount: '25',
  albumCount: '3',
  profileImage: 'https://picsum.photos/seed/artist1/400/400',
  coverImage: 'https://picsum.photos/seed/artistcover1/800/500',
  verified: true,
  socialLinks: {
    facebook: 'https://facebook.com/sontungmtp',
    instagram: 'https://instagram.com/sontungmtp',
    youtube: 'https://youtube.com/sontungmtp',
  },
};

// Mock data cho bài hát của nghệ sĩ
const MOCK_SONGS = [
  {
    id: '1',
    title: 'Chúng Ta Của Hiện Tại',
    album: 'Chúng Ta Của Hiện Tại',
    releaseYear: '2020',
    artwork: 'https://picsum.photos/seed/song1/200/200',
    duration: '3:52',
    plays: '125.4M',
    url: 'https://example.com/song1.mp3',
    artist: 'Sơn Tùng M-TP',
  },
  {
    id: '2',
    title: 'Muộn Rồi Mà Sao Còn',
    album: 'Muộn Rồi Mà Sao Còn',
    releaseYear: '2021',
    artwork: 'https://picsum.photos/seed/song2/200/200',
    duration: '4:35',
    plays: '98.7M',
    url: 'https://example.com/song2.mp3',
    artist: 'Sơn Tùng M-TP',
  },
  {
    id: '3',
    title: 'Có Chắc Yêu Là Đây',
    album: 'Có Chắc Yêu Là Đây',
    releaseYear: '2020',
    artwork: 'https://picsum.photos/seed/song3/200/200',
    duration: '3:48',
    plays: '87.2M',
    url: 'https://example.com/song3.mp3',
    artist: 'Sơn Tùng M-TP',
  },
  {
    id: '4',
    title: 'Hãy Trao Cho Anh',
    album: 'Sky Tour',
    releaseYear: '2019',
    artwork: 'https://picsum.photos/seed/song4/200/200',
    duration: '4:05',
    plays: '156.3M',
    url: 'https://example.com/song4.mp3',
    artist: 'Sơn Tùng M-TP',
  },
  {
    id: '5',
    title: 'Lạc Trôi',
    album: 'Lạc Trôi',
    releaseYear: '2017',
    artwork: 'https://picsum.photos/seed/song5/200/200',
    duration: '4:12',
    plays: '201.5M',
    url: 'https://example.com/song5.mp3',
    artist: 'Sơn Tùng M-TP',
  },
];

// Mock data cho album/playlist của nghệ sĩ
const MOCK_ALBUMS = [
  {
    id: '1',
    title: 'Sky Tour',
    type: 'Album',
    releaseYear: '2019',
    artwork: 'https://picsum.photos/seed/album1/300/300',
    songCount: 10,
  },
  {
    id: '2',
    title: 'Chúng Ta Của Hiện Tại',
    type: 'Single',
    releaseYear: '2020',
    artwork: 'https://picsum.photos/seed/album2/300/300',
    songCount: 1,
  },
  {
    id: '3',
    title: 'Muộn Rồi Mà Sao Còn',
    type: 'Single',
    releaseYear: '2021',
    artwork: 'https://picsum.photos/seed/album3/300/300',
    songCount: 1,
  },
  {
    id: '4',
    title: 'Có Chắc Yêu Là Đây',
    type: 'Single',
    releaseYear: '2020',
    artwork: 'https://picsum.photos/seed/album4/300/300',
    songCount: 1,
  },
];

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 90;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const ProfileArtist = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [artist, setArtist] = useState(MOCK_ARTIST);
  const [songs, setSongs] = useState(MOCK_SONGS);
  const [albums, setAlbums] = useState(MOCK_ALBUMS);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showFullBio, setShowFullBio] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [moreOptionsVisible, setMoreOptionsVisible] = useState(false);

  const {setCurrentTrack, togglePlay} = usePlayerStore();

  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
    setIsLoading(true);

    // Sử dụng mock data cho demo
    setTimeout(() => {
      setArtist(MOCK_ARTIST);
      setSongs(MOCK_SONGS);
      setAlbums(MOCK_ALBUMS);
      setIsLoading(false);
    }, 500);

    /*
    // TODO: Kết nối với API thực tế
    try {
      const artistId = route.params?.artistId || '1';
      const token = await AuthService.getToken();

      // Lấy thông tin nghệ sĩ
      const artistResponse = await axios.get(`http://your-api-url/api/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Lấy bài hát của nghệ sĩ
      const songsResponse = await axios.get(`http://your-api-url/api/artists/${artistId}/songs`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Lấy album của nghệ sĩ
      const albumsResponse = await axios.get(`http://your-api-url/api/artists/${artistId}/albums`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (artistResponse.data && artistResponse.data.success) {
        const artistData = artistResponse.data.artist;
        setArtist({
          id: artistData.artist_id,
          name: artistData.artist_name,
          bio: artistData.artist_bio,
          followers: formatNumber(artistData.followers_count),
          monthlyListeners: formatNumber(artistData.monthly_listeners),
          songCount: artistData.song_count.toString(),
          albumCount: artistData.album_count.toString(),
          profileImage: getFullMinioUrl(artistData.artist_image_url),
          coverImage: getFullMinioUrl(artistData.artist_cover_url),
          verified: artistData.is_verified,
          socialLinks: artistData.social_links || {},
        });
      }

      if (songsResponse.data && songsResponse.data.success) {
        const songsData = songsResponse.data.songs.map(song => ({
          id: song.song_id,
          title: song.song_title,
          album: song.album_name,
          releaseYear: new Date(song.release_date).getFullYear().toString(),
          artwork: getFullMinioUrl(song.song_image_url),
          duration: song.song_duration || '0:00',
          plays: formatNumber(song.play_count),
          url: getFullMinioUrl(song.song_audio_url),
          artist: artistData.artist_name,
        }));
        setSongs(songsData);
      }

      if (albumsResponse.data && albumsResponse.data.success) {
        const albumsData = albumsResponse.data.albums.map(album => ({
          id: album.album_id,
          title: album.album_title,
          type: album.album_type,
          releaseYear: new Date(album.release_date).getFullYear().toString(),
          artwork: getFullMinioUrl(album.album_image_url),
          songCount: album.song_count,
        }));
        setAlbums(albumsData);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin nghệ sĩ:', error);
      // Xử lý lỗi: hiển thị thông báo, v.v.
    } finally {
      setIsLoading(false);
    }
    */
  };

  const handleFollowPress = () => {
    setIsFollowing(!isFollowing);
    // TODO: Gọi API để follow/unfollow nghệ sĩ
  };

  const handleSongPress = async (song) => {
    try {
      // Cập nhật trạng thái trong store
      await setCurrentTrack(song.id, song);

      // Phát bài hát
      await togglePlay();

      // Chuyển đến màn hình phát nhạc
      navigation.navigate('NowPlayingScreen', {songs: [song], initialTrackIndex: 0});
    } catch (error) {
      console.error('Lỗi khi phát bài hát:', error);
    }
  };

  const handleAlbumPress = (album) => {
    // Chuyển đến màn hình chi tiết album
    navigation.navigate('SongListScreen', {
      playlistId: album.id,
      playlistTitle: album.title,
      coverImage: album.artwork,
      type: album.type,
    });
  };

  const handleMorePress = (song) => {
    setSelectedSong(song);
    setMoreOptionsVisible(true);
  };

  const handleCloseMoreOptions = () => {
    setMoreOptionsVisible(false);
    setSelectedSong(null);
  };

  const renderSongItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => handleSongPress(item)}
    >
      <Text style={styles.songIndex}>{index + 1}</Text>
      <Image source={{uri: item.artwork}} style={styles.songArtwork} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.songPlays}>{item.plays} lượt nghe</Text>
      </View>
      <Text style={styles.songDuration}>{item.duration}</Text>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleMorePress(item)}
      >
        <Icon name="ellipsis-vertical" size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({item}) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => handleAlbumPress(item)}
    >
      <Image source={{uri: item.artwork}} style={styles.albumArtwork} />
      <Text style={styles.albumTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.albumInfo}>
        {item.type} • {item.releaseYear}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1DB954" />
        <Text style={styles.loadingText}>Đang tải thông tin nghệ sĩ...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header animado */}
      <Animated.View style={[styles.header, {height: headerHeight}]}>
        <Animated.Image
          source={{uri: artist.coverImage}}
          style={[styles.headerImage, {opacity: imageOpacity}]}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <Animated.View style={[styles.titleContainer, {opacity: titleOpacity}]}>
            <Text style={styles.headerTitle}>{artist.name}</Text>
          </Animated.View>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}
      >
        <View style={styles.artistInfoContainer}>
          <Image source={{uri: artist.profileImage}} style={styles.artistImage} />
          <View style={styles.artistInfo}>
            <Text style={styles.artistName}>{artist.name}</Text>
            {artist.verified && (
              <View style={styles.verifiedBadge}>
                <Icon name="checkmark-circle" size={16} color="#1DB954" />
                <Text style={styles.verifiedText}>Nghệ sĩ xác thực</Text>
              </View>
            )}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{artist.followers}</Text>
                <Text style={styles.statLabel}>Người theo dõi</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{artist.songCount}</Text>
                <Text style={styles.statLabel}>Bài hát</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{artist.albumCount}</Text>
                <Text style={styles.statLabel}>Album</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.followButton,
              isFollowing ? styles.followingButton : {},
            ]}
            onPress={handleFollowPress}
          >
            <Text style={styles.followButtonText}>
              {isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
            </Text>
          </TouchableOpacity>

          <View style={styles.socialLinks}>
            {Object.keys(artist.socialLinks).map((platform) => (
              <TouchableOpacity key={platform} style={styles.socialButton}>
                <Icon
                  name={
                    platform === 'facebook' ? 'logo-facebook' :
                      platform === 'instagram' ? 'logo-instagram' :
                        'logo-youtube'
                  }
                  size={20}
                  color="#fff"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bioContainer}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.bioText} numberOfLines={showFullBio ? undefined : 3}>
            {artist.bio}
          </Text>
          {artist.bio.length > 150 && (
            <TouchableOpacity onPress={() => setShowFullBio(!showFullBio)}>
              <Text style={styles.readMoreText}>
                {showFullBio ? 'Thu gọn' : 'Xem thêm'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.songsContainer}>
          <Text style={styles.sectionTitle}>Bài hát phổ biến</Text>
          {songs.map((song, index) => renderSongItem({item: song, index}))}
        </View>

        <View style={styles.albumsContainer}>
          <Text style={styles.sectionTitle}>Album & Single</Text>
          <FlatList
            data={albums}
            renderItem={renderAlbumItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.albumsList}
          />
        </View>
      </Animated.ScrollView>

      {/* More Options Modal */}
      <MoreOptionsModal
        visible={moreOptionsVisible}
        onClose={handleCloseMoreOptions}
        song={selectedSong}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 10,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: SCREEN_WIDTH,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_MAX_HEIGHT,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  titleContainer: {
    position: 'absolute',
    left: 56,
    right: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    paddingTop: HEADER_MAX_HEIGHT,
    paddingBottom: 80, // Để tránh bị che bởi thanh player ở dưới
  },
  artistInfoContainer: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedText: {
    color: '#1DB954',
    fontSize: 14,
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  statItem: {
    marginRight: 16,
  },
  statValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#b3b3b3',
    fontSize: 12,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  followButton: {
    backgroundColor: '#1DB954',
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#fff',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  socialLinks: {
    flexDirection: 'row',
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  bioContainer: {
    padding: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bioText: {
    color: '#b3b3b3',
    fontSize: 14,
    lineHeight: 20,
  },
  readMoreText: {
    color: '#1DB954',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
  },
  songsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  songIndex: {
    width: 24,
    color: '#b3b3b3',
    fontSize: 14,
    textAlign: 'center',
  },
  songArtwork: {
    width: 40,
    height: 40,
    borderRadius: 4,
    marginLeft: 8,
  },
  songInfo: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
  },
  songPlays: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 4,
  },
  songDuration: {
    color: '#b3b3b3',
    fontSize: 14,
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  albumsContainer: {
    padding: 16,
    marginBottom: 24,
  },
  albumsList: {
    paddingRight: 16,
  },
  albumItem: {
    width: 150,
    marginRight: 16,
  },
  albumArtwork: {
    width: 150,
    height: 150,
    borderRadius: 4,
    marginBottom: 8,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  albumInfo: {
    color: '#b3b3b3',
    fontSize: 12,
    marginTop: 4,
  },
});

export default ProfileArtist;
