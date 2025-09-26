import { useQuery } from "@vue/apollo-composable";
import { GET_ME } from "@/api/user.gql";
import { computed } from "vue";

export function useAuth() {
  const { result, loading, error, refetch } = useQuery(GET_ME);
  const isLoggedIn = computed(() => !!result.value?.me && !error.value);
  const isAdmin = computed(() => result.value?.me.role === "ADMIN" && !error.value);

  return { user: result, isLoggedIn, isAdmin, loading, error, refetch };
}
