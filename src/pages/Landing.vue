<template>
  <LoaderOverlay v-if="loading" text="Logging in..." />
  <div
    class="flex flex-col justify-center items-center flex-1 text-white gap-8"
  >
    <h1 class="text-4xl">
      Welcome to<br />
      <span class="uppercase font-bold text-5xl inline-flex items-center gap-2">
        <ClipboardCheck :size="32" /> Trullo!
        </span>
    </h1>

    <Card class="w-full max-w-xs p-6">
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
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { LOGIN_USER, REGISTER_USER } from "../api/graphql";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoaderOverlay from "@/components/LoaderOverlay.vue";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardCheck, AlertCircle } from "lucide-vue-next";
import { useAuth } from "../composables/useAuth";

const { refetch } = useAuth();
const router = useRouter();

const loading = ref(false);
const error = ref("");

const name = ref("");
const email = ref("");
const password = ref("");

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password required" }),
});

const RegistrationSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.email(),
  password: z
    .string()
    .min(8, "Password needs to be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

const {
  mutate: loginUser,
  onDone: onLoginDone,
  onError: onLoginError,
} = useMutation(LOGIN_USER);
const {
  mutate: registerUser,
  onDone: onRegistrationDone,
  onError: onRegistrationError,
} = useMutation(REGISTER_USER);

function handleLogin() {
  error.value = "";
  loading.value = true;

  const result = LoginSchema.safeParse({
    email: email.value,
    password: password.value,
  });
  if (!result.success) {
    error.value = JSON.parse(result.error.message)
      .map((e: { message: string }) => e.message)
      .join(", ");
    return;
  }
  loginUser({ email: email.value.trim(), password: password.value.trim() });
}

function handleRegistration() {
  error.value = "";
  loading.value = true;

  const result = RegistrationSchema.safeParse({
    name: name.value,
    email: email.value,
    password: password.value,
  });
  if (!result.success) {
    error.value = JSON.parse(result.error.message)
      .map((e: { message: string }) => e.message)
      .join(", ");
    return;
  }
  registerUser({
    name: name.value.trim(),
    email: email.value.trim(),
    password: password.value.trim(),
  });
}

onLoginDone(async ({ data }) => {
  if (data?.loginUser?.token) {
    await refetch();
    router.push("/dashboard");
  } else {
    error.value = "Login failed";
  }
  loading.value = false;
});

onRegistrationDone(async ({ data }) => {
  if (data?.registerUser?.token) {
    await refetch();
    router.push("/dashboard");
  } else {
    error.value = "Registration failed";
  }
  loading.value = false;
});

onLoginError((e) => {
  error.value = e.message || "Login failed";
  loading.value = false;
});

onRegistrationError((e) => {
  error.value = e.message || "Registration failed";
  loading.value = false;
});
</script>
