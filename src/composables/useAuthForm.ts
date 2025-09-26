import { ref } from "vue";
import { z } from "zod";
import { useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { LOGIN_USER, REGISTER_USER } from "@/api/auth.gql";
import { useAuth } from "./useAuth";
import { useLoading } from "@/stores/loading";

const LoginSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password required" }),
});

const RegistrationSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, "Password needs to be at least 8 characters")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must contain at least one special character"
    ),
});

export function useAuthForm() {
  const router = useRouter();
  const { refetch } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const error = ref("");

  const name = ref("");
  const email = ref("");
  const password = ref("");

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
    showLoading("Logging in...");

    const result = LoginSchema.safeParse({
      email: email.value,
      password: password.value,
    });
    
    if (!result.success) {
      error.value = JSON.parse(result.error.message)
        .map((e: { message: string }) => e.message)
        .join(", ");
      hideLoading();
      return;
    }
    
    loginUser({ 
      email: email.value.trim(), 
      password: password.value.trim() 
    });
  }

  function handleRegistration() {
    error.value = "";
    showLoading("Creating account...");

    const result = RegistrationSchema.safeParse({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    
    if (!result.success) {
      error.value = JSON.parse(result.error.message)
        .map((e: { message: string }) => e.message)
        .join(", ");
      hideLoading();
      return;
    }
    
    registerUser({
      name: name.value.trim(),
      email: email.value.trim(),
      password: password.value.trim(),
    });
  }

  function resetForm() {
    name.value = "";
    email.value = "";
    password.value = "";
    error.value = "";
  }

  // Login success handler
  onLoginDone(async ({ data }) => {
    if (data?.loginUser?.token) {
      await refetch();
      resetForm();
      hideLoading();
      router.push("/");
    } else {
      error.value = "Login failed";
      hideLoading();
    }
  });

  // Registration success handler
  onRegistrationDone(async ({ data }) => {
    if (data?.registerUser?.token) {
      await refetch();
      resetForm();
      hideLoading();
      router.push("/");
    } else {
      error.value = "Registration failed";
      hideLoading();
    }
  });

  // Error handlers
  onLoginError((e) => {
    error.value = e.message || "Login failed";
    hideLoading();
  });

  onRegistrationError((e) => {
    error.value = e.message || "Registration failed";
    hideLoading();
  });

  return {
    // Form state
    name,
    email,
    password,
    error,
    
    // Form actions
    handleLogin,
    handleRegistration,
    resetForm,
    
    // Validation schemas (if needed externally)
    LoginSchema,
    RegistrationSchema,
  };
}
