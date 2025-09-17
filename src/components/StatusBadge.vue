<template>
  <Badge variant="outline" :class="className">{{ status.label }}</Badge>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TaskStatus } from "@/types";
import { Badge } from "@/components/ui/badge";

const props = defineProps(["data"]);

const status = computed(() => statusLookup(props.data));

const className = computed(
  () =>
    `${status.value.textColor} ${status.value.bgColor} ${status.value.borderColor}`
);

function statusLookup(status: TaskStatus) {
  const lookup = {
    TO_DO: {
      label: "Todo",
      textColor: "text-blue-500",
      borderColor: "border-blue-500",
      bgColor: "bg-blue-100",
    },
    IN_PROGRESS: {
      label: "In progress",
      textColor: "text-yellow-600",
      borderColor: "border-yellow-600",
      bgColor: "bg-yellow-100",
    },
    BLOCKED: {
      label: "Blocked",
      textColor: "text-red-500",
      borderColor: "border-red-500",
      bgColor: "bg-red-100",
    },
    DONE: {
      label: "Done",
      textColor: "text-green-600",
      borderColor: "border-green-600",
      bgColor: "bg-green-100",
    },
  };
  return lookup[status];
}
</script>
