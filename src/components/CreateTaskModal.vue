<template>
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create new task</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleCreateTask" class="grid gap-3">
        <div class="grid gap-2">
          <Label for="title">Title</Label>
          <Input v-model="title" placeholder="Title" id="title" />
        </div>
        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Input v-model="description" placeholder="Description" id="description" />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose">Cancel</Button>
          <Button type="submit">Create task</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Button from "./ui/button/Button.vue";
import Input from "./ui/input/Input.vue";
import Label from "./ui/label/Label.vue";

const props = defineProps(["isOpen", "onClose"]);

const title = ref("");
const description = ref("");

function handleClose() {
  props.onClose();
}

function handleCreateTask() {

}
</script>
