import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
import { TemplateId } from '@/lib/templates';
export type EffectId = 'pixelate' | 'rgbShift' | 'noise' | 'scanLines' | 'glitchLines';
export type Effect = {
  id: EffectId;
  name: string;
  active: boolean;
  params: { [key: string]: { value: number; min: number; max: number; step: number; label: string } };
};
export type Preset = {
  id: string;
  name: string;
  effects: KintsugiState['effects'];
};
type KintsugiState = {
  image: HTMLImageElement | null;
  templateId: TemplateId | null;
  effects: {
    [key in EffectId]: Effect;
  };
  presets: Preset[];
};
type KintsugiActions = {
  setImage: (image: HTMLImageElement | null) => void;
  setTemplate: (templateId: TemplateId | null) => void;
  toggleEffect: (id: EffectId) => void;
  setEffectParam: (id: EffectId, param: string, value: number) => void;
  resetEffects: () => void;
  loadPresets: () => void;
  addPreset: (name: string) => void;
  applyPreset: (id: string) => void;
  deletePreset: (id: string) => void;
};
const initialEffectsState: KintsugiState['effects'] = {
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
  scanLines: {
    id: 'scanLines',
    name: 'Scan Lines',
    active: false,
    params: {
      lineWidth: { value: 1, min: 1, max: 10, step: 1, label: 'Line Width' },
      lineGap: { value: 4, min: 1, max: 20, step: 1, label: 'Line Gap' },
      lineAlpha: { value: 0.1, min: 0, max: 1, step: 0.05, label: 'Line Alpha' },
    },
  },
  glitchLines: {
    id: 'glitchLines',
    name: 'Glitch Lines',
    active: false,
    params: {
      amount: { value: 5, min: 1, max: 30, step: 1, label: 'Amount' },
      blockHeight: { value: 8, min: 1, max: 50, step: 1, label: 'Block Height' },
    },
  },
};
const initialState: Omit<KintsugiState, 'presets' | 'effects'> = {
  image: null,
  templateId: null,
};
export const useKintsugiStore = create<KintsugiState & KintsugiActions>()(
  immer((set, get) => ({
    ...initialState,
    effects: JSON.parse(JSON.stringify(initialEffectsState)),
    presets: [],
    setImage: (image) => set({ image, templateId: null }),
    setTemplate: (templateId) => set({ templateId, image: null }),
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
      set({ effects: JSON.parse(JSON.stringify(initialEffectsState)) });
    },
    loadPresets: () => {
      try {
        const storedPresets = localStorage.getItem('kintsugi-presets');
        if (storedPresets) {
          set({ presets: JSON.parse(storedPresets) });
        }
      } catch (error) {
        console.error("Failed to load presets from localStorage", error);
      }
    },
    addPreset: (name) => {
      if (!name.trim()) return;
      const newPreset: Preset = {
        id: uuidv4(),
        name,
        effects: JSON.parse(JSON.stringify(get().effects)), // Deep copy current effects
      };
      set((state) => {
        state.presets.push(newPreset);
        try {
          localStorage.setItem('kintsugi-presets', JSON.stringify(state.presets));
        } catch (error) {
          console.error("Failed to save presets to localStorage", error);
        }
      });
    },
    applyPreset: (id) => {
      const preset = get().presets.find((p) => p.id === id);
      if (preset) {
        set({ effects: JSON.parse(JSON.stringify(preset.effects)) });
      }
    },
    deletePreset: (id) => {
      set((state) => {
        state.presets = state.presets.filter((p) => p.id !== id);
        try {
          localStorage.setItem('kintsugi-presets', JSON.stringify(state.presets));
        } catch (error) {
          console.error("Failed to save presets to localStorage", error);
        }
      });
    },
  }))
);