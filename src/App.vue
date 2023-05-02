<template>
  <router-view />
</template>

<script setup>
import { onMounted } from "vue";
import { server } from "./boot/axios";
import { useRouter } from "vue-router";
import { useUserStore } from "./stores/user-store";

import { useQuasar } from "quasar";

const $q = useQuasar();

const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  // server.interceptors.response.use(
  //   (response) => response,
  //   (error) => {
  //     if (error.response.status === 401) {
  //       $q.dialog({
  //         message:
  //           "Your login was unsuccessful. Please make sure that you are connected to the internet." +
  //           error.response.data.error,
  //       });
  //       // userStore.clearUser()
  //       router.push("/auth");
  //       // console.log("IS EXPIRED hey hey!!!", error.response.status);
  //       // console.log("Error hey hey!!!", error.response.data.error);
  //     }
  //   }
  // );
});
</script>
