import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { usePlayerStore } from '../stores/usePlayerStore';

const { width, height } = Dimensions.get('window');

const MoreOptionsModal = ({ visible, onClose, song }) => {
  const navigation = useNavigation();
  const { setCurrentTrack, togglePlay } = usePlayerStore();

  if (!song) return null;

  const handlePlaySong = async () => {
    try {
      // Cập nhật trạng thái trong store
      await setCurrentTrack(song.id, song);

      // Phát bài hát
      await togglePlay();

      onClose();
    } catch (error) {
      console.error('Lỗi khi phát bài hát:', error);
    }
  };

  const handleAddToPlaylist = () => {
    onClose();
    navigation.navigate('AddToPlaylistScreen', { song });
  };

  const handleViewArtist = () => {
    onClose();
    // Nếu đang ở màn hình nghệ sĩ, không cần chuyển hướng
    // Nếu không, chuyển đến màn hình nghệ sĩ
    // navigation.navigate('ProfileArtist', { artistId: song.artistId });
  };

  const handleShareSong = () => {
    // Xử lý chia sẻ bài hát
    onClose();
  };

  const handleDownloadSong = () => {
    // Xử lý tải bài hát
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.songInfoContainer}>
                <Image source={{ uri: song.artwork }} style={styles.songImage} />
                <View style={styles.songDetails}>
                  <Text style={styles.songTitle} numberOfLines={1}>{song.title}</Text>
                  <Text style={styles.songArtist} numberOfLines={1}>{song.artist}</Text>
                </View>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.optionsContainer}>
                <TouchableOpacity style={styles.option} onPress={handlePlaySong}>
                  <Icon name="play-circle-outline" size={24} color="#fff" />
                  <Text style={styles.optionText}>Phát</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={handleAddToPlaylist}>
                  <Icon name="add-circle-outline" size={24} color="#fff" />
                  <Text style={styles.optionText}>Thêm vào playlist</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={handleViewArtist}>
                  <Icon name="person-outline" size={24} color="#fff" />
                  <Text style={styles.optionText}>Xem nghệ sĩ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={handleShareSong}>
                  <Icon name="share-social-outline" size={24} color="#fff" />
                  <Text style={styles.optionText}>Chia sẻ</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.option} onPress={handleDownloadSong}>
                  <Icon name="download-outline" size={24} color="#fff" />
                  <Text style={styles.optionText}>Tải xuống</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#282828',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: height * 0.7,
  },
  songInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  songImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  songDetails: {
    flex: 1,
    marginLeft: 12,
  },
  songTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  optionsContainer: {
    maxHeight: height * 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 16,
  },
});

export default MoreOptionsModal;
