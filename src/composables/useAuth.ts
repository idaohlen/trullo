import { useQuery } from "@vue/apollo-composable";
import { GET_ME } from "@/api/graphql";
import { computed } from "vue";

export function useAuth() {
  const { result, loading, error, refetch } = useQuery(GET_ME);
  const isLoggedIn = computed(() => !!result.value?.me && !error.value);

  return { user: result, isLoggedIn, loading, error, refetch };
}
