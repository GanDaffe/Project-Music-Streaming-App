import { create } from 'zustand';
import PlaylistService from '../service/apiPlaylist';
import Toast from 'react-native-toast-message';
import { usePlayerStore } from './usePlayerStore';

const usePlaylistStore = create((set, get) => ({
  playlists: [],
  currentPlaylist: null,
  isLoading: false,
  error: null,

  // Lấy danh sách playlist từ API
  fetchPlaylists: async () => {
    set({ isLoading: true, error: null });
    try {
      const playlistsData = await PlaylistService.getUserPlaylists();
      set({ playlists: playlistsData, isLoading: false });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đã tải danh sách playlist',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể tải danh sách playlist',
      });
    }
  },

  // Tạo playlist mới
  createPlaylist: async (playlistTitle) => {
    set({ isLoading: true, error: null });
    try {
      const newPlaylist = await PlaylistService.createPlaylist(playlistTitle);
      set((state) => ({
        playlists: [...state.playlists, newPlaylist],
        isLoading: false,
      }));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Playlist đã được tạo',
      });
      return newPlaylist;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể tạo playlist',
      });
      throw error;
    }
  },

  // Get a specific playlist with songs
  getPlaylistDetails: async (playlistId) => {
    set({ isLoading: true, error: null });
    try {
      const playlistDetails = await PlaylistService.getPlaylistDetails(playlistId);
      set({ currentPlaylist: playlistDetails, isLoading: false });
      return playlistDetails;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể tải thông tin playlist',
      });
      throw error;
    }
  },

  // Update playlist
  updatePlaylist: async (playlistId, playlistData) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPlaylist = await PlaylistService.updatePlaylist(playlistId, playlistData);
      set((state) => ({
        playlists: state.playlists.map(p => p.id === playlistId ? updatedPlaylist : p),
        currentPlaylist: state.currentPlaylist?.id === playlistId ? updatedPlaylist : state.currentPlaylist,
        isLoading: false,
      }));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Playlist đã được cập nhật',
      });
      return updatedPlaylist;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể cập nhật playlist',
      });
      throw error;
    }
  },

  // Delete playlist
  deletePlaylist: async (playlistId) => {
    set({ isLoading: true, error: null });
    try {
      await PlaylistService.deletePlaylist(playlistId);
      set((state) => ({
        playlists: state.playlists.filter(p => p.id !== playlistId),
        currentPlaylist: state.currentPlaylist?.id === playlistId ? null : state.currentPlaylist,
        isLoading: false,
      }));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Playlist đã được xóa',
      });
    } catch (error) {
      set({ isLoading: false, error: error.message });
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Không thể xóa playlist',
      });
      throw error;
    }
  },

  // Play playlist
  playPlaylist: async (playlistId, shuffle = false) => {
    const { currentPlaylist } = get();
    const playlist = currentPlaylist?.id === playlistId
      ? currentPlaylist
      : await PlaylistService.getPlaylistDetails(playlistId);

    if (!playlist || !playlist.songs || playlist.songs.length === 0) {
      Toast.show({
        type: 'info',
        text1: 'Thông báo',
        text2: 'Playlist không có bài hát nào',
      });
      return;
    }

    const tracks = playlist.songs.map(song => ({
      id: String(song.id),
      url: song.url,
      title: song.title,
      artist: song.artist,
      artwork: song.artwork,
      liked: song.liked,
    }));

    // Use existing player store to handle playback
    const playerStore = usePlayerStore.getState();

    try {
      await TrackPlayer.reset();
      await TrackPlayer.add(tracks);

      if (shuffle) {
        playerStore.toggleShuffle();
      } else {
        await TrackPlayer.play();
        playerStore.setIsPlaying(true);
      }

      // Set current track
      const currentTrackIndex = await TrackPlayer.getCurrentTrack();
      if (currentTrackIndex !== null) {
        const currentTrack = tracks[currentTrackIndex];
        playerStore.setCurrentTrack(currentTrack.id, currentTrack);
      }
    } catch (error) {
      console.error('Error playing playlist:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể phát playlist',
      });
    }
  },
}));

export default usePlaylistStore;
