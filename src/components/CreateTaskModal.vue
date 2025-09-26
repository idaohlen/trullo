<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
  <Dialog :open="isOpen" @update:open="handleClose">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{
          isEdit ? "Edit task" : "Create new task"
        }}</DialogTitle>
        <DialogDescription class="sr-only">
          {{ isEdit ? "Edit task form" : "Create new task form" }}
        </DialogDescription>
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

        <div class="flex gap-2">
          <BaseSelect
            v-model="status"
            :options="statusValues"
            placeholder="Select status"
            triggerClass="w-[180px]"
          />

          <BasePopover
            v-model:is-open="userPopoverOpen"
            v-model:search-value="userSearch"
            :options="users"
            :selected-value="assignedUserId"
            :display-text="displayText"
            search-placeholder="Search users..."
            empty-message="No user found."
            trigger-class="justify-between flex-1"
            content-class="w-[300px] p-0"
            :get-label="(user: User) => user.email"
            :get-value="(user: User) => user.id"
            :get-key="(user: User) => user.id"
            @select="(user: User) => selectUser(user.id)"
          />
        </div>

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
import type { Task, User } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";


import {
  ADD_TASK,
  UPDATE_TASK,
  GET_TASK_STATUS_VALUES,
  GET_TASKS,
  GET_USERS,
} from "../api/graphql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import LoaderOverlay from "@/components/LoaderOverlay.vue";
import BaseSelect from "./BaseSelect.vue";
import BasePopover from "./BasePopover.vue";

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

const isEdit = computed(
  () =>
    props.task !== null &&
    typeof props.task?.id === "string" &&
    props.task.id.length > 0
);

const loading = ref(false);
const error = ref("");

// Form inputs
const title = ref("");
const description = ref("");
const status = ref("");
const assignedUserId = ref<string | null>(null);
const userPopoverOpen = ref(false);
const userSearch = ref("");

const selectedUser = computed(() => {
  return users.value.find((u: User) => u.id === assignedUserId.value) || null;
});

const displayText = computed(() => {
  return selectedUser.value?.email ?? "Choose user";
});

const statusValues = computed(() => {
  return statusValuesData.value?.taskStatusValues ?? [];
});

const users = computed(() => {
  return usersData.value?.users ?? [];
});

function selectUser(id: string) {
  assignedUserId.value = id;
  userPopoverOpen.value = false;
}

const { result: usersData } = useQuery(GET_USERS);
const { result: statusValuesData } = useQuery(GET_TASK_STATUS_VALUES);
const { mutate: addTask } = useMutation(ADD_TASK, {
  refetchQueries: [
    { query: GET_TASKS }
  ],
});
const { mutate: updateTask } = useMutation(UPDATE_TASK, {
  refetchQueries: [
    { query: GET_TASKS }
  ],
});

watch(
  () => props.task,
  (task) => {
    if (task) {
      title.value = task.title || "";
      description.value = task.description || "";
      status.value = task.status || "";
      assignedUserId.value = task.assignee?.id ? String(task.assignee.id) : null;
    } else {
      title.value = "";
      description.value = "";
      status.value = "";
      assignedUserId.value = null;
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
    const assignedTo = assignedUserId.value || undefined;
    if (isEdit.value && props.task) {
      await updateTask({
        id: props.task.id,
        title: title.value.trim(),
        description: description.value,
        status: status.value || undefined,
        assignedTo,
      });
    } else {
      await addTask({
        title: title.value.trim(),
        description: description.value,
        status: status.value || undefined,
        assignedTo,
      });
    }

    loading.value = false;
    title.value = "";
    description.value = "";
    status.value = "";
    assignedUserId.value = null;

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
