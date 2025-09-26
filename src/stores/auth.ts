import { defineStore } from "pinia";
import type { User } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    setUser(user: User | null) {
      this.user = user;
    },
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setError(error: string | null) {
      this.error = error;
    },
  },
});
