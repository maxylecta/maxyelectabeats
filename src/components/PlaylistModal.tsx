import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  beatId: string;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({ isOpen, onClose, beatId }) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const { playlists, createPlaylist, addToPlaylist, removeFromPlaylist } = useUserStore();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      toast.success('Playlist created');
    }
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, beatId);
    toast.success('Added to playlist');
  };

  const handleRemoveFromPlaylist = (playlistId: string) => {
    removeFromPlaylist(playlistId, beatId);
    toast.success('Removed from playlist');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-dark-900 rounded-xl p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add to Playlist</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="New playlist name..."
                  className="flex-1 bg-dark-800 text-white rounded-lg px-4 py-2 outline-none border border-dark-700 focus:border-primary-500"
                />
                <button
                  onClick={handleCreatePlaylist}
                  disabled={!newPlaylistName.trim()}
                  className="bg-primary-500 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center justify-between bg-dark-800 rounded-lg p-4"
                >
                  <span className="text-white">{playlist.name}</span>
                  <button
                    onClick={() => 
                      playlist.beats.includes(beatId)
                        ? handleRemoveFromPlaylist(playlist.id)
                        : handleAddToPlaylist(playlist.id)
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      playlist.beats.includes(beatId)
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    {playlist.beats.includes(beatId) ? (
                      <Trash2 size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PlaylistModal;