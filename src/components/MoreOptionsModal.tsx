import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { CloseCircle, Heart, Add } from 'iconsax-react-nativejs';
import { usePlayerStore } from '../stores/usePlayerStore';
import usePlaylistStore from '../stores/usePlaylistStore';
import Toast from 'react-native-toast-message';

interface MoreOptionsModalProps {
  visible: boolean;
  onClose: () => void;
  song: any;
}

const MoreOptionsModal = ({ visible, onClose, song }: MoreOptionsModalProps) => {
  const [showPlaylists, setShowPlaylists] = useState(false);
  const { addToFavorites } = usePlayerStore();
  const { playlists, fetchPlaylists, isLoading } = usePlaylistStore();
  const { addSongToPlaylist } = usePlayerStore();

  useEffect(() => {
    if (visible && showPlaylists) {
      fetchPlaylists();
    }
  }, [visible, showPlaylists, fetchPlaylists]);

  const handleAddToFavorites = async () => {
    if (song) {
      await addToFavorites(song);
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Đã thêm bài hát vào danh sách yêu thích',
      });
      onClose();
    }
  };

  const handleAddToPlaylist = () => {
    setShowPlaylists(true);
  };

  const handleSelectPlaylist = async (playlistId) => {
    if (song && playlistId) {
      const success = await addSongToPlaylist(song.id, playlistId);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã thêm bài hát vào playlist',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể thêm bài hát vào playlist',
        });
      }
      setShowPlaylists(false);
      onClose();
    }
  };

  const renderPlaylistItem = ({ item }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => handleSelectPlaylist(item.id)}
    >
      <Text style={styles.playlistName}>{item.playlist_title}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {showPlaylists ? 'Chọn playlist' : 'Tùy chọn'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <CloseCircle size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {!showPlaylists ? (
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleAddToFavorites}
              >
                <Heart size={24} color="#ffffff" />
                <Text style={styles.optionText}>Thêm vào yêu thích</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.optionItem}
                onPress={handleAddToPlaylist}
              >
                <Add size={24} color="#ffffff" />
                <Text style={styles.optionText}>Thêm vào playlist</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.playlistsContainer}>
              {isLoading ? (
                <ActivityIndicator color="#1DB954" size="large" />
              ) : (
                <FlatList
                  data={playlists}
                  renderItem={renderPlaylistItem}
                  keyExtractor={(item) => item.id.toString()}
                  ListEmptyComponent={
                    <Text style={styles.emptyText}>Không có playlist nào</Text>
                  }
                />
              )}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#212121',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 4,
  },
  optionsContainer: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 16,
  },
  playlistsContainer: {
    padding: 16,
    maxHeight: 300,
  },
  playlistItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playlistName: {
    fontSize: 16,
    color: '#ffffff',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default MoreOptionsModal;