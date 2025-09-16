<template>
  <LoaderOverlay v-if="loading" text="Creating task..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{
          isEdit ? "Edit task" : "Create new task"
        }}</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSaveTask" class="grid gap-3">
        <div class="grid gap-2">
          <Label for="title">Title</Label>
          <Input v-model="title" placeholder="Title" id="title" />
        </div>
        <div class="grid gap-2">
          <Label for="description">Description</Label>
          <Textarea
            v-model="description"
            placeholder="Use markdown for formatting your task description."
            id="description"
          />
        </div>

        <Select v-model="status">
          <SelectTrigger class="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem
                :value="statusOption"
                v-for="statusOption in statusValuesData.taskStatusValues || []"
                :key="statusOption"
              >
                {{ statusOption }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @Click="handleClose"
            >Cancel</Button
          >
          <Button type="submit">{{
            isEdit ? "Save changes" : "Create task"
          }}</Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from "vue";
import { useQuery, useMutation } from "@vue/apollo-composable";
import type { Task } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADD_TASK, UPDATE_TASK, GET_TASK_STATUS_VALUES } from "../api/graphql";
import Button from "./ui/button/Button.vue";
import Input from "./ui/input/Input.vue";
import Textarea from "./ui/textarea/Textarea.vue";
import Label from "./ui/label/Label.vue";
import LoaderOverlay from "@/components/LoaderOverlay.vue";

const props = defineProps({
  isOpen: Boolean,
  onClose: {
    type: Function,
    default: () => {},
  },
  onTaskSaved: {
    type: Function,
    default: () => {},
  },
  task: {
    type: Object as PropType<Task | null>,
    default: null,
  },
});

const isEdit = computed(() => props.task !== null && typeof props.task?.id === 'string' && props.task.id.length > 0);

const loading = ref(false);
const error = ref("");

// Form inputs
const title = ref("");
const description = ref("");
const status = ref("");

const { result: statusValuesData } = useQuery(GET_TASK_STATUS_VALUES);
const { mutate: addTask } = useMutation(ADD_TASK);
const { mutate: updateTask } = useMutation(UPDATE_TASK);

watch(
  () => props.task,
  (task) => {
    if (task) {
      title.value = task.title || "";
      description.value = task.description || "";
      status.value = task.status || "";
    } else {
      title.value = "";
      description.value = "";
      status.value = "";
    }
  },
  { immediate: true }
);

function handleClose() {
  title.value = "";
  description.value = "";
  status.value = "";
  props.onClose();
}

async function handleSaveTask() {
  error.value = "";
  loading.value = true;
  try {
    if (isEdit.value && props.task) {
      await updateTask({
        id: props.task.id,
        title: title.value.trim(),
        description: description.value,
        status: status.value || undefined,
      });
    } else {
      await addTask({
        title: title.value.trim(),
        description: description.value,
        status: status.value || undefined,
      });
    }

    loading.value = false;
    title.value = "";
    description.value = "";
    status.value = "";

    handleClose();
    props.onTaskSaved();
  } catch (e: any) {
    error.value = e?.message || "Failed to save task.";
    console.error("Save task error:", e);
  } finally {
    loading.value = false;
  }
}
</script>
