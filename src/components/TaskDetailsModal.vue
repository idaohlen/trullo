<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent v-if="task">
      <DialogHeader>
        <DialogTitle>{{ task.title }}</DialogTitle>
      </DialogHeader>
      <Card class="p-2 rounded-sm">
        <vue-markdown :source="task.description" />
      </Card>
      <DialogFooter>
        <Button variant="outline" class="text-red-500"><Trash /> Delete</Button>
        <Button variant="outline"><Edit /> Edit</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import VueMarkdown from "vue-markdown-render";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Trash } from "lucide-vue-next";

const props = defineProps(["task", "isOpen", "onClose"]);

function handleClose() {
  props.onClose();
}

</script>
