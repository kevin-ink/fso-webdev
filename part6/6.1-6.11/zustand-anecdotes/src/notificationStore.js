import { create } from "zustand";

const useNotificationStore = create((set) => ({
  message: null,

  actions: {
    setNotification: (text) => {
      set(() => ({ message: text }));
      setTimeout(() => {
        set(() => ({ message: null }));
      }, 5000);
    },
  },
}));

export const useNotificationActions = () =>
  useNotificationStore((state) => state.actions);

export const useNotification = () =>
  useNotificationStore((state) => state.message);
