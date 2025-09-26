<template>
  <Card class="w-full p-6">
    <Tabs default-value="login" class="w-full">
      <TabsList class="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <!-- Login -->
      <TabsContent value="login">
        <form @submit.prevent="handleLogin" class="grid gap-2 w-full">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              v-model="email"
              id="email"
              type="email"
              placeholder="Email"
              autocomplete="email"
              class="bg-white text-black"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              v-model="password"
              id="password"
              type="password"
              placeholder="Password"
              autocomplete="current-password"
              class="bg-white text-black"
            />
          </div>
          <Button class="mt-3">Login</Button>
        </form>
      </TabsContent>
      <!-- Register -->
      <TabsContent value="register">
        <form @submit.prevent="handleRegistration" class="grid gap-4 w-full">
          <div class="grid gap-2">
            <Label for="name">Name</Label>
            <Input
              v-model="name"
              id="name"
              type="name"
              placeholder="Name"
              class="bg-white text-black"
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              v-model="email"
              id="email"
              type="email"
              placeholder="Email"
              autocomplete="username"
              class="bg-white text-black"
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              v-model="password"
              id="password"
              type="password"
              placeholder="Password"
              autocomplete="new-password"
              class="bg-white text-black"
            />
          </div>
          <Button class="mt-3">Register</Button>
        </form>
      </TabsContent>
    </Tabs>
  </Card>
  <Alert v-if="error" variant="destructive" class="max-w-xs">
    <AlertCircle class="w-4 h-4" />
    <AlertTitle>Invalid input</AlertTitle>
    <AlertDescription>
      {{ error }}
    </AlertDescription>
  </Alert>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-vue-next";
import { useAuthForm } from "@/composables/useAuthForm";

const {
  name,
  email,
  password,
  error,
  handleLogin,
  handleRegistration,
} = useAuthForm();
</script>
