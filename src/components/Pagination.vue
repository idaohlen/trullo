<template>
  <nav
    :class="cn('mx-auto flex w-full justify-center', className)"
    role="navigation"
    aria-label="pagination"
  >
    <div class="flex items-center space-x-1">
      <!-- Previous Button -->
      <Button
        variant="ghost"
        size="sm"
        @click="handlePrevious"
        :disabled="page === 1"
        :aria-disabled="page === 1"
        class="h-9 px-3"
      >
        <ChevronLeft class="h-4 w-4" />
        <span class="sr-only">Previous</span>
      </Button>

      <!-- Page Numbers -->
      <template v-for="(p, idx) in pages" :key="getPageKey(p, idx)">
        <!-- Ellipsis -->
        <div
          v-if="p === 'left-ellipsis' || p === 'right-ellipsis'"
          class="flex items-center justify-center h-9 px-3"
        >
          <span class="text-muted-foreground">...</span>
        </div>
        <!-- Page Button -->
        <Button
          v-else
          :variant="p === page ? 'outline' : 'ghost'"
          size="sm"
          @click="() => handlePageClick(p)"
          class="h-9 w-9"
          :class="p === page ? 'text-black' : ''"
        >
          {{ p }}
        </Button>
      </template>

      <!-- Next Button -->
      <Button
        variant="ghost"
        size="sm"
        @click="handleNext"
        :disabled="!hasNextPage"
        :aria-disabled="!hasNextPage"
        class="h-9 px-3"
      >
        <ChevronRight class="h-4 w-4" />
        <span class="sr-only">Next</span>
      </Button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  page: number;
  hasNextPage: boolean;
  totalCount?: number;
  limit: number;
}

interface Emits {
  (e: "setPage", page: number): void;
}

const props = withDefaults(defineProps<Props>(), {
  className: "",
});

const emit = defineEmits<Emits>();

const totalPages = computed(() => {
  if (props.totalCount) {
    return Math.ceil(props.totalCount / props.limit);
  }
  return props.page + (props.hasNextPage ? 1 : 0);
});

const pages = computed(() => {
  const result: (number | string)[] = [];
  const total = totalPages.value;

  // Only show 5 pages at a time, with ellipsis
  if (total <= 5) {
    for (let i = 1; i <= total; i++) {
      result.push(i);
    }
  } else {
    // Always show first and last
    const left = Math.max(2, props.page - 1);
    const right = Math.min(total - 1, props.page + 1);

    result.push(1);

    if (left > 2) {
      result.push("left-ellipsis");
    }

    for (let i = left; i <= right; i++) {
      result.push(i);
    }

    if (right < total - 1) {
      result.push("right-ellipsis");
    }

    result.push(total);
  }

  return result;
});

function handlePrevious(e: Event) {
  e.preventDefault();
  if (props.page > 1) {
    emit("setPage", props.page - 1);
  }
}

function handleNext(e: Event) {
  e.preventDefault();
  if (props.hasNextPage) {
    emit("setPage", props.page + 1);
  }
}

function handlePageClick(pageNumber: number | string) {
  if (typeof pageNumber === "number") {
    emit("setPage", pageNumber);
  }
}

function getPageKey(p: number | string, idx: number): string {
  if (typeof p === "string") {
    return `${p}-${idx}`;
  }
  return p.toString();
}
</script>
