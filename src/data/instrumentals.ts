export interface Instrumental {
  id: string;
  title: string;
  genre: 'DRILL' | 'DRILL MIX TRAP' | 'TRAP' | 'R&B';
  price: number;
  audioSrc: string;
  bpm: number;
  length: string;
  dateAdded: string;
  isFeatured?: boolean;
}

export type SortOption = 'price-asc' | 'price-desc' | 'bpm-asc' | 'bpm-desc' | 'date-desc';

export const sortOptions = [
  { id: 'date-desc', label: 'Newest First' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'bpm-asc', label: 'BPM: Low to High' },
  { id: 'bpm-desc', label: 'BPM: High to Low' },
] as const;

const instrumentals: Instrumental[] = [
  {
    id: "instr-001",
    title: "Night Rider",
    genre: "DRILL",
    price: 39.99,
    audioSrc: "https://your-storage-url.com/beats/night-rider-preview.mp3",
    bpm: 140,
    length: "3:15",
    dateAdded: "2023-07-15",
    isFeatured: true
  },
  {
    id: "instr-002",
    title: "Custum",
    genre: "DRILL",
    price: 44.99,
    audioSrc: "https://your-storage-url.com/beats/tunnel-preview.mp3",
    bpm: 145,
    length: "3:30",
    dateAdded: new Date().toISOString().split('T')[0],
    isFeatured: true
  },
  {
    id: "instr-003",
    title: "Tunnel",
    genre: "TRAP",
    price: 34.99,
    audioSrc: "https://maxy-electa-beats.b-cdn.net/tunnel.mp3",
    bpm: 99,
    length: "4:00",
    dateAdded: "2024-01-01"
  }
];

export default instrumentals;