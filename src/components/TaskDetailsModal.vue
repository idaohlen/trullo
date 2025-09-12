<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent v-if="task">
      <DialogHeader>
        <DialogTitle>{{ task.title }}</DialogTitle>
      </DialogHeader>
      {{ task.description }}
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const props = defineProps(["task", "isOpen", "onClose"]);

function handleClose() {
  props.onClose();
}

</script>
