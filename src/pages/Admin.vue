<template>
  <h1 class="text-white text-2xl mb-4 font-bold tracking-wider">Admin</h1>
  <div v-if="loading" class="text-white">Loading...</div>
  <div v-else-if="error">
    <Alert variant="destructive">
      <AlertCircle class="h-4 w-4" />
      <AlertTitle>Error: {{ error.graphQLErrors[0].extensions.code }}</AlertTitle>
      <AlertDescription>
        {{ error.graphQLErrors[0].message }}
      </AlertDescription>
    </Alert>
  </div>
  <Card v-else-if="users.length == 0">
    No users found.
  </Card>
  <Card v-else class="p-6">
    <h2 class="font-semibold mb-4">Users</h2>
    <div class="grid grid-cols-[1fr_2fr_auto] gap-4 p-8 pt-0">
      <!-- Header -->
      <div class="font-medium text-gray-600">Name</div>
      <div class="font-medium text-gray-600">Email</div>
      <div class="font-medium text-gray-600">Actions</div>
      
      <!-- User rows -->
      <template v-for="user in users" :key="user.id">
        <div class="border-b border-gray-100 font-semibold text-sm">{{ user.name }}</div>
        <div class="border-b border-gray-100 text-gray-500 text-sm">{{ user.email }}</div>
        <div class="border-b border-gray-100">
          <Button variant="destructive" size="sm">
            <Trash class="h-4 w-4" /> Delete
          </Button>
        </div>
      </template>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useQuery } from "@vue/apollo-composable";
import { GET_USERS } from "@/api/graphql";
import type { User } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash } from "lucide-vue-next";

const { result, loading, error, refetch } = useQuery<{ users: User[] }>(
  GET_USERS
);

const users = computed(() => result.value?.users ?? []);

console.log(useQuery<{ users: User[] }>(GET_USERS));
</script>
