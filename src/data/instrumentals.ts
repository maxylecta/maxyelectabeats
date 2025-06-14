export interface Instrumental {
  id: string;
  title: string;
  genre: 'DRILL' | 'DRILL MIX' | 'AFRO BEAT' | 'TRAP' | 'R&B' | 'AFRO TRAP' | 'AFRO DRILL' | 'DANCEHALL' | 'REGGAE DANCEHALL' | 'REGGAE';
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
    title: "walk",
    genre: "DRILL",
    price: 24.99,
    audioSrc: "https://maxy-electa-beats.b-cdn.net/walk.mp3",
    bpm: 144,
    length: "2:15",
    dateAdded: "2025-05-02",
    isFeatured: true
  },
  {
    id: "instr-002",
    title: "street corner",
    genre: "DRILL",
    price: 9.99,
    audioSrc: "https://maxy-electa-beats.b-cdn.net/street%20corner.mp3",
    bpm: 72,
    length: "2:30",
    dateAdded: new Date().toISOString().split('T')[0],
    isFeatured: true
  },
  {
    id: "instr-003",
    title: "Tunnel",
    genre: "TRAP",
    price: 74.99,
    audioSrc: "https://maxy-electa-beats.b-cdn.net/tunnel.mp3",
    bpm: 99,
    length: "4:00",
    dateAdded: "2025-05-02"
  },
  {
    id: "instr-004",
    title: "Frostbite Drill",
    genre: "DRILL",
    price: 89.00,
    audioSrc: "https://maxy-electa-beats.b-cdn.net/Frostbite%20Drill%20bunny.mp3",
    bpm: 140,
    length: "3:30",
    dateAdded: new Date().toISOString().split('T')[0],
    isFeatured: true
  }
];

export default instrumentals;