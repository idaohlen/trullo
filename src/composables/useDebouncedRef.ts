import { ref, watch, type Ref } from "vue";

export function useDebouncedRef<T>(source: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref<T>(source.value);
  let timeout: ReturnType<typeof setTimeout>;
  watch(source, (val) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = val;
    }, delay);
  });
  return debounced as Ref<T>;
}
