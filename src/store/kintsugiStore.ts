import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
export type Effect = {
  id: 'pixelate' | 'rgbShift' | 'noise';
  name: string;
  active: boolean;
  params: { [key: string]: { value: number; min: number; max: number; step: number; label: string } };
};
type KintsugiState = {
  image: HTMLImageElement | null;
  effects: {
    [key in Effect['id']]: Effect;
  };
};
type KintsugiActions = {
  setImage: (image: HTMLImageElement | null) => void;
  toggleEffect: (id: Effect['id']) => void;
  setEffectParam: (id: Effect['id'], param: string, value: number) => void;
  resetEffects: () => void;
};
const initialState: KintsugiState = {
  image: null,
  effects: {
    pixelate: {
      id: 'pixelate',
      name: 'Pixelate',
      active: false,
      params: {
        blockSize: { value: 10, min: 1, max: 50, step: 1, label: 'Block Size' },
      },
    },
    rgbShift: {
      id: 'rgbShift',
      name: 'RGB Shift',
      active: false,
      params: {
        offset: { value: 5, min: 0, max: 30, step: 1, label: 'Offset' },
      },
    },
    noise: {
      id: 'noise',
      name: 'Noise',
      active: false,
      params: {
        amount: { value: 20, min: 0, max: 100, step: 1, label: 'Amount' },
      },
    },
  },
};
export const useKintsugiStore = create<KintsugiState & KintsugiActions>()(
  immer((set) => ({
    ...initialState,
    setImage: (image) => set({ image }),
    toggleEffect: (id) => {
      set((state) => {
        state.effects[id].active = !state.effects[id].active;
      });
    },
    setEffectParam: (id, param, value) => {
      set((state) => {
        state.effects[id].params[param].value = value;
      });
    },
    resetEffects: () => {
        set((state) => {
            state.effects = initialState.effects;
        });
    }
  }))
);