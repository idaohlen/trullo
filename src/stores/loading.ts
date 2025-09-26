import { defineStore } from "pinia";

export interface LoadingState {
  isLoading: boolean;
  message: string;
}

export const useLoadingStore = defineStore("loading", {
  state: (): LoadingState => ({
    isLoading: false,
    message: "",
  }),
  
  actions: {
    show(message: string = "Loading...") {
      this.isLoading = true;
      this.message = message;
    },
    
    hide() {
      this.isLoading = false;
      this.message = "";
    },
    
    updateMessage(message: string) {
      this.message = message;
    },
  },
});

// Composable for easier use in components
export function useLoading() {
  const store = useLoadingStore();
  
  return {
    isLoading: store.isLoading,
    message: store.message,
    showLoading: store.show,
    hideLoading: store.hide,
    updateMessage: store.updateMessage,
  };
}
