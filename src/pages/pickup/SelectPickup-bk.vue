<template>
  <q-page id="selectPickup">
    <q-toolbar class="text-white bg-red-10">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title> Pick Up </q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <div
      class="q-pa-md text-center row justify-center"
      style="max-width: 350px"
    >
      <q-list>
        <q-item>
          <q-item-section>
            <q-item-label>IP-One WH</q-item-label>
            <q-item-label caption>Brand: Hi Channel : Shopee</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="5 Boxes" />
          </q-item-section>
          <div class="text-center q-pt-lg">
            <q-btn
              @click="isLoggedInAddRoute"
              flat
              round
              dense
              size="11px"
              icon="qr_code_scanner"
            />
          </div>
        </q-item>

        <q-separator spaced inset />

        <q-item>
          <q-item-section>
            <q-item-label>Up eCommerce</q-item-label>
            <q-item-label caption>Brand: Pureen Channel : Lazada</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10 Boxes" />
          </q-item-section>

          <div class="text-center q-pt-lg">
            <q-btn
              @click="isLoggedInAddRoute"
              flat
              round
              dense
              size="11px"
              icon="qr_code_scanner"
            />
          </div>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup>
// IMPORTS

import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { usePickingStore } from "src/stores/picking-store";
import { reactive, ref, onMounted } from "vue";

const userStore = useUserStore();
const pickingStore = usePickingStore();
const router = useRouter();
const $q = useQuasar();

const userId = ref("");

// DATA
const card = ref(false);
const listPickings = ref([]);
// DATA END

const errors = reactive({
  userId: { errorMsg: null, errorType: null },
});
onMounted(() => {
  userId.value = userStore.getId ? userStore.getId : "";
  fechPicking(userId.value);
});

const isLoggedInAddRoute = () => {
  if (!userStore.email) {
    const res = $q.dialog({
      title: 'You\'re not logged in!',
      message: 'Login to add and see your favourite routes',
      cancel: true,
      persistent: true
    })

    res.onOk(() => {
      router.push('/auth')
    })

    return
  }
  router.push("/pickup/add-pickup");
}

const fechPicking = async (driver) => {
  try {
    // Get the Picking Up List
    const picking = await pickingStore.fetchPicking(driver);
    if (picking) listPickings.value = picking.data.data;
    console.log(listPickings.value);
    // Set user data in localstorage (PINIA)
  } catch (error) {}
};

</script>
<style lang="scss">
#selectPickup {
  .form-style {
    margin: 0 auto;
    height: calc(100vh - 180px);
    max-width: 500px;
  }
}
</style>
