<template>
  <div
    class="flex flex-col justify-center items-center flex-1 text-white gap-8"
  >
    <h1 class="text-4xl">Welcome to Trullo!</h1>

    <Card class="w-full max-w-xs p-6">
      <Tabs default-value="account" class="w-full">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        <!-- Login -->
        <TabsContent value="login">
          <form
            @submit.prevent="handleLogin"
            class="flex flex-col gap-2 w-full"
          >
            <div class="flex flex-col gap-2">
              <Label for="email">Email</Label>
              <Input
                v-model="email"
                id="email"
                type="email"
                placeholder="Email"
                class="bg-white text-black"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="password">Password</Label>
              <Input
                v-model="password"
                id="password"
                type="password"
                placeholder="Password"
                class="bg-white text-black"
              />
            </div>
            <Button class="mt-3">Login</Button>
          </form>
        </TabsContent>
        <!-- Register -->
        <TabsContent value="register">
          <form
            @submit.prevent="handleRegistration"
            class="flex flex-col gap-2 w-full"
          >
            <div class="flex flex-col gap-2">
              <Label for="name">Name</Label>
              <Input
                v-model="name"
                id="name"
                type="name"
                placeholder="Name"
                class="bg-white text-black"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="email">Email</Label>
              <Input
                v-model="email"
                id="email"
                type="email"
                placeholder="Email"
                class="bg-white text-black"
              />
            </div>
            <div class="flex flex-col gap-2">
              <Label for="password">Password</Label>
              <Input
                v-model="password"
                id="password"
                type="password"
                placeholder="Password"
                class="bg-white text-black"
              />
            </div>
            <Button class="mt-3">Register</Button>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
    <div v-if="error" class="text-red-300 text-sm mt-2">
      {{ error }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useMutation } from "@vue/apollo-composable";
import { LOGIN_USER } from "../api/graphql";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const name = ref("");
const email = ref("");
const password = ref("");
const error = ref("");

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password required" }),
});

const { mutate: loginUser, onDone, onError } = useMutation(LOGIN_USER);

function handleLogin() {
  error.value = "";
  const result = LoginSchema.safeParse({
    email: email.value,
    password: password.value,
  });
  if (!result.success) {
    error.value = JSON.parse(result.error.message)
      .map((e) => e.message)
      .join(", ");
    return;
  }
  loginUser({ email: email.value.trim(), password: password.value.trim() });
}

function handleRegistration() {}

onDone(({ data }) => {
  if (data?.loginUser?.token) {
    localStorage.setItem("token", data.loginUser.token);
    window.location.href = "/dashboard";
  } else {
    error.value = "Login failed";
  }
});

onError((e) => {
  error.value = e.message || "Login failed";
});
</script>
