import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  favorites: string[];
  playlists: {
    id: string;
    name: string;
    beats: string[];
  }[];
  addToFavorites: (beatId: string) => void;
  removeFromFavorites: (beatId: string) => void;
  createPlaylist: (name: string) => void;
  addToPlaylist: (playlistId: string, beatId: string) => void;
  removeFromPlaylist: (playlistId: string, beatId: string) => void;
  deletePlaylist: (playlistId: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      favorites: [],
      playlists: [],
      addToFavorites: (beatId) =>
        set((state) => ({
          favorites: [...new Set([...state.favorites, beatId])]
        })),
      removeFromFavorites: (beatId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== beatId)
        })),
      createPlaylist: (name) =>
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              id: `playlist_${Date.now()}`,
              name,
              beats: []
            }
          ]
        })),
      addToPlaylist: (playlistId, beatId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  beats: [...new Set([...playlist.beats, beatId])]
                }
              : playlist
          )
        })),
      removeFromPlaylist: (playlistId, beatId) =>
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? {
                  ...playlist,
                  beats: playlist.beats.filter((id) => id !== beatId)
                }
              : playlist
          )
        })),
      deletePlaylist: (playlistId) =>
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== playlistId)
        }))
    }),
    {
      name: 'user-storage'
    }
  )
);