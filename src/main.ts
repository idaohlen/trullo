
import { createApp } from "vue";
import App from "./App.vue";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { provideApolloClient } from "@vue/apollo-composable";
import router from "./router";
import "./style.css";


const httpLink = createHttpLink({
  uri: "/graphql", // Vite proxy forwards to backend
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

provideApolloClient(apolloClient);

const app = createApp(App);
app.use(router);
app.mount("#app");
