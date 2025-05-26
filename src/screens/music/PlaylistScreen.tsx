import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  StyleSheet,
  Modal,
  StatusBar,
  Platform,
  FlatList,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchNormal1, CloseCircle, Add, ArrowLeft } from 'iconsax-react-nativejs';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import usePlaylistStore from '../../stores/usePlaylistStore';
import { usePlayerStore } from '../../stores/usePlayerStore';
import { useAuth } from '../../context/AuthContext';

// Enum cho các tab
const TabType = {
  ALL: 'all',
  PLAYLISTS: 'playlists',
  ARTISTS: 'artists',
};

const PlaylistScreen = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [activeTab, setActiveTab] = useState(TabType.ALL);
  const [likedArtists, setLikedArtists] = useState([]);
  const [isArtistsLoading, setIsArtistsLoading] = useState(false);
  const [artistsError, setArtistsError] = useState(null);

  // Animation refs
  const tabIndicatorPosition = useRef(new Animated.Value(0)).current;
  const tabFade = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();
  const { token } = useAuth();

  const { playlists, isLoading, fetchPlaylists, createPlaylist } = usePlaylistStore();
  const { favoriteSongs } = usePlayerStore();

  // Lấy danh sách playlist và nghệ sĩ đã thích khi màn hình được tải
  useEffect(() => {
    fetchPlaylists();
    fetchLikedArtists();
  }, [fetchPlaylists]);

  // Fetch danh sách nghệ sĩ đã thích từ API
  const fetchLikedArtists = async () => {
    setIsArtistsLoading(true);
    setArtistsError(null);

    try {
      // Sử dụng mock data tạm thời
      // Trong thực tế, thay thế bằng API call
      setTimeout(() => {
        const mockArtists = [
          {
            id: '1',
            name: 'Sơn Tùng M-TP',
            imageUrl: 'https://picsum.photos/200/200?random=artist1',
            followers: '15.2M',
          },
          {
            id: '2',
            name: 'Hòa Minzy',
            imageUrl: 'https://picsum.photos/200/200?random=artist2',
            followers: '5.7M',
          },
          {
            id: '3',
            name: 'Đen Vâu',
            imageUrl: 'https://picsum.photos/200/200?random=artist3',
            followers: '8.3M',
          },
          {
            id: '4',
            name: 'Bích Phương',
            imageUrl: 'https://picsum.photos/200/200?random=artist4',
            followers: '6.1M',
          },
        ];

        setLikedArtists(mockArtists);
        setIsArtistsLoading(false);
      }, 500);

      /*
      // Thực hiện API call thực tế
      const response = await axios.get('https://your-api-url/api/artists/liked', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data && response.data.success) {
        const artistsData = response.data.artists.map(artist => ({
          id: artist.artist_id,
          name: artist.artist_name,
          imageUrl: artist.artist_image_url || 'https://picsum.photos/200/200',
          followers: formatNumber(artist.followers_count) || '0',
        }));

        setLikedArtists(artistsData);
      } else {
        setArtistsError('Không thể tải danh sách nghệ sĩ');
      }
      */
    } catch (error) {
      console.error('Error fetching liked artists:', error);
      setArtistsError('Đã xảy ra lỗi khi tải danh sách nghệ sĩ');
    } finally {
      setIsArtistsLoading(false);
    }
  };

  // Animation khi chuyển tab
  useEffect(() => {
    // Fade out current content
    Animated.timing(tabFade, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Move indicator to new position
      let position = 0;
      if (activeTab === TabType.PLAYLISTS) position = 1;
      if (activeTab === TabType.ARTISTS) position = 2;

      Animated.timing(tabIndicatorPosition, {
        toValue: position,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Fade in new content
      Animated.timing(tabFade, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  }, [activeTab]);

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchQuery('');
    }
  };

  const handleCreatePlaylist = () => {
    setIsModalVisible(true);
  };

  const handleSubmitPlaylist = async () => {
    if (playlistName.trim()) {
      try {
        await createPlaylist(playlistName.trim());
        setIsModalVisible(false);
        setPlaylistName('');
      } catch (error) {
        // Lỗi đã được xử lý trong store, không cần làm gì thêm
      }
    }
  };

  const handlePlaylistPress = (playlist) => {
    if (playlist.id === 'favorites') {
      // Navigate to SongListScreen with favorites
      navigation.navigate('SongListScreen', {
        playlistId: 'favorites',
        playlistTitle: 'Bài hát yêu thích',
        coverImage: playlist.coverImage,
        songs: favoriteSongs
      });
    } else {
      // Original navigation for regular playlists
      navigation.navigate('SongListScreen', {
        playlistId: playlist.id,
        playlistTitle: playlist.playlist_title,
        coverImage: playlist.coverImage || 'https://picsum.photos/200/200'
      });
    }
  };

  const handleArtistPress = (artist) => {
    navigation.navigate('ProfileArtist', { artistId: artist.id });
  };

  // Create a favorites playlist object
  const favoritesPlaylist = {
    id: 'favorites',
    playlist_title: 'Bài hát yêu thích',
    coverImage: 'https://picsum.photos/200/200?random=favorites',
    songs: favoriteSongs
  };

  // Lọc playlist theo searchQuery
  const filteredPlaylists = [
    favoritesPlaylist,
    ...playlists.filter((item) =>
      item.playlist_title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ];

  // Lọc nghệ sĩ theo searchQuery
  const filteredArtists = likedArtists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Render item cho danh sách playlist
  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.playlistItem}
      onPress={() => handlePlaylistPress(item)}
    >
      <Image
        source={{ uri: item.coverImage || 'https://picsum.photos/200/200' }}
        style={styles.playlistCover}
      />
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.playlist_title}</Text>
        <Text style={styles.playlistDetails}>
          {item.songs?.length || 0} bài hát
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render item cho danh sách nghệ sĩ
  const renderArtistItem = ({ item }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.artistItem}
      onPress={() => handleArtistPress(item)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.artistImage}
      />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName}>{item.name}</Text>
        <Text style={styles.artistDetails}>
          {item.followers} người theo dõi
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Hiển thị nội dung dựa trên tab đang active
  const renderContent = () => {
    // Hiển thị loading state
    if ((activeTab === TabType.ALL && (isLoading || isArtistsLoading)) ||
        (activeTab === TabType.PLAYLISTS && isLoading) ||
        (activeTab === TabType.ARTISTS && isArtistsLoading)) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1DB954" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      );
    }

    // Hiển thị error state
    if ((activeTab === TabType.ARTISTS && artistsError) ||
        (activeTab === TabType.ALL && artistsError)) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{artistsError}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchLikedArtists}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // Hiển thị tất cả (playlist + nghệ sĩ)
    if (activeTab === TabType.ALL) {
      if (filteredPlaylists.length === 0 && filteredArtists.length === 0) {
        return (
          <Text style={styles.emptyState}>
            {searchQuery
              ? 'Không tìm thấy kết quả nào'
              : 'Chưa có nội dung nào. Hãy tạo playlist đầu tiên của bạn!'}
          </Text>
        );
      }

      return (
        <>
          {filteredPlaylists.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Playlist</Text>
              <FlatList
                data={filteredPlaylists}
                renderItem={renderPlaylistItem}
                keyExtractor={(item) => `playlist-${item.id}`}
                scrollEnabled={false}
              />
            </View>
          )}

          {filteredArtists.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Nghệ sĩ</Text>
              <FlatList
                data={filteredArtists}
                renderItem={renderArtistItem}
                keyExtractor={(item) => `artist-${item.id}`}
                scrollEnabled={false}
              />
            </View>
          )}
        </>
      );
    }

    // Chỉ hiển thị playlist
    if (activeTab === TabType.PLAYLISTS) {
      if (filteredPlaylists.length === 0) {
        return (
          <Text style={styles.emptyState}>
            {searchQuery
              ? 'Không tìm thấy playlist nào'
              : 'Chưa có playlist nào. Hãy tạo playlist đầu tiên của bạn!'}
          </Text>
        );
      }

      return (
        <FlatList
          data={filteredPlaylists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => `playlist-${item.id}`}
          scrollEnabled={false}
        />
      );
    }

    // Chỉ hiển thị nghệ sĩ
    if (activeTab === TabType.ARTISTS) {
      if (filteredArtists.length === 0) {
        return (
          <Text style={styles.emptyState}>
            {searchQuery
              ? 'Không tìm thấy nghệ sĩ nào'
              : 'Bạn chưa theo dõi nghệ sĩ nào.'}
          </Text>
        );
      }

      return (
        <FlatList
          data={filteredArtists}
          renderItem={renderArtistItem}
          keyExtractor={(item) => `artist-${item.id}`}
          scrollEnabled={false}
        />
      );
    }
  };

  // Tính toán vị trí của indicator dựa trên tab active
  const translateX = tabIndicatorPosition.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0, 100, 200], // Sẽ được điều chỉnh dựa trên độ rộng thực tế của tab
  });

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor="rgba(18, 18, 18, 1)"
        barStyle="light-content"
        translucent={true}
      />
      <SafeAreaView style={styles.safeAreaContainer}>
        <View style={styles.header}>
          {!isSearchVisible ? (
            <>
              <Text style={styles.title}>Thư viện</Text>
              <TouchableOpacity style={styles.iconButton} onPress={toggleSearch}>
                <SearchNormal1 size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={handleCreatePlaylist}>
                <Add size={24} color="#ffffff" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.searchBarContainer}>
              <View style={styles.searchBar}>
                <SearchNormal1 size={20} color="#000000" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Tìm kiếm trong thư viện"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
                <TouchableOpacity onPress={toggleSearch}>
                  <CloseCircle size={20} color="#000000" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Tab Filter - Redesigned */}
        <View style={styles.tabContainer}>
          <View style={styles.tabButtonsContainer}>
            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab(TabType.ALL)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === TabType.ALL && styles.activeTabText
                ]}
              >
                Tất cả
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab(TabType.PLAYLISTS)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === TabType.PLAYLISTS && styles.activeTabText
                ]}
              >
                Playlist
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tabButton}
              onPress={() => setActiveTab(TabType.ARTISTS)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === TabType.ARTISTS && styles.activeTabText
                ]}
              >
                Nghệ sĩ
              </Text>
            </TouchableOpacity>
          </View>

          {/* Animated Indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              { transform: [{ translateX }] }
            ]}
          />
        </View>

        {/* Animated Content */}
        <Animated.ScrollView
          style={[styles.content, { opacity: tabFade }]}
        >
          {renderContent()}
        </Animated.ScrollView>

        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tạo playlist mới</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <CloseCircle size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Tên playlist</Text>
                <TextInput
                  style={styles.playlistNameInput}
                  placeholder="Nhập tên playlist của bạn"
                  value={playlistName}
                  onChangeText={setPlaylistName}
                  autoFocus
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  playlistName.trim() && !isLoading
                    ? {}
                    : styles.createButtonDisabled,
                ]}
                onPress={handleSubmitPlaylist}
                disabled={!playlistName.trim() || isLoading}
              >
                <Text style={styles.createButtonText}>
                  {isLoading ? 'Đang tạo...' : 'Tạo playlist'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  safeAreaContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
    color: '#000',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Redesigned Tab styles
  tabContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabButtonsContainer: {
    flexDirection: 'row',
    height: '100%',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 8,
  },
  activeTabText: {
    color: '#1DB954',
    fontWeight: 'bold',
  },
  // Content styles
  content: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  playlistCover: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginRight: 12,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  playlistDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  // Artist item styles
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    marginBottom: 8,
  },
  artistImage: {
    width: 56,
    height: 56,
    borderRadius: 28, // Make it circular
    marginRight: 12,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  artistDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  emptyState: {
    textAlign: 'center',
    padding: 20,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 5,
  },
  closeButton: {
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 8,
  },
  playlistNameInput: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  createButton: {
    backgroundColor: '#1DB954',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#1DB954',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 16,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default PlaylistScreen;
