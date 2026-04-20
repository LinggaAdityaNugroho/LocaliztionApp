// src/types/loan.ts
export interface Alat {
  id: number;
  nama_alat: string;
  letak: string;
  jumlah: number;
  kode_tag_list?: string[];
  is_aset?: boolean;
}

export interface CartItem extends Alat {
  selected_tags: string[];
  qty: number;
}

export const RUANGAN_SPESIFIK = [
  "Laboratorium Barat 1",
  "Laboratorium Barat 2",
  "Laboratorium Timur 1",
  "Laboratorium Timur 2",
  "Laboratorium Broadcast",
  "Laboratorium Jaringan Komputer",
];
