<template>
  <LoaderOverlay v-if="loading" text="Loading..." />
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

        <div class="flex gap-2">
          <Select v-model="status">
            <SelectTrigger class="w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  :value="statusOption"
                  v-for="statusOption in statusValuesData.taskStatusValues ||
                  []"
                  :key="statusOption"
                >
                  {{ statusOption }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Popover v-model:open="userPopoverOpen">
            <PopoverTrigger as-child>
              <Button
                type="button"
                variant="outline"
                class="justify-between flex-1"
              >
              <div class="truncate">{{ selectedUser?.email ?? "Choose user" }}</div>
                <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-[300px] p-0">
              <Command>
                <div>
                  <CommandInput
                    v-model="userSearch"
                    placeholder="Search users..."
                    class="flex-1"
                  />
                </div>
                <CommandList>
                  <CommandEmpty>No user found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      v-for="user in filteredUsers"
                      :key="user.id"
                      :value="user.id"
                      @select="selectUser(user.id)"
                      class="px-3 py-2"
                      :class="{ 'bg-accent': user.id === assignedUserId }"
                    >
                      {{ user.email }}
                      <Check
                        v-if="user.id === assignedUserId"
                        class="ml-auto h-4 w-4"
                      />
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

import {
  ADD_TASK,
  UPDATE_TASK,
  GET_TASK_STATUS_VALUES,
  GET_USERS,
} from "../api/graphql";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import LoaderOverlay from "@/components/LoaderOverlay.vue";
import { Check, ChevronsUpDown } from "lucide-vue-next";

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
  const users = usersData.value?.users ?? [];
  return users.find((u: User) => u.id === assignedUserId.value) || null;
});

const filteredUsers = computed(() => {
  const users = usersData.value?.users ?? [];
  if (!userSearch.value) return users;
  return users.filter((u: User) =>
    u.email.toLowerCase().includes(userSearch.value.toLowerCase())
  );
});

function selectUser(id: string) {
  assignedUserId.value = id;
  userPopoverOpen.value = false;
}

const { result: usersData } = useQuery(GET_USERS);
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
      assignedUserId.value = task.user?.id ? String(task.user.id) : null;
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
