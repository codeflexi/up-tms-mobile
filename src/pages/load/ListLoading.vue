<template>
  <div id="Directs" class="font-prompt-300">
    <q-toolbar class="bg-grey-10 text-white">
      <q-icon color="red-9" name="view_in_ar" round dense size="30px"></q-icon>
      <q-toolbar-title>Loading Lists</q-toolbar-title>
    </q-toolbar>

    <div v-if="listPickings.length > 0" class="section-title">
      <div class="text-h6 q-mx-sm">
        Select one to Load to Truck! of {{ listPickings.length }} Jobs
      </div>
    </div>

    <div v-if="listPickings.length < 1" class="text-center q-pt-lg">
      <q-btn
        @click="isLoggedInPicking"
        flat
        round
        dense
        size="33px"
        icon="add_circle_outline"
      />
      <div class="text-h6">There is no shipment!</div>
      <div class="q-pa-md info">Wating for loading to truck!</div>
    </div>

    <q-scroll-area v-else class="list">
      <!-- <q-separator spaced inset /> -->

      <!-- <q-list bordered style="width: 300px" class="flex column justify-center"> -->
      <router-link
        v-for="pick in listPickings"
        :key="pick._id"
        :to="`/load/add-load/${pick._id}`"
        class="view_in_ar"
        style="text-decoration: none; color: black"
      >
        <q-list
          bordered
          class="flex column justify-center q-mt-sm rounded-borders shadow-2 bg-green-1"
        >
          <q-item-label
            class="text-weight-bold rounded-borders text-white bg-green-7"
            header
          >
            <div class="q-pb-xs">
              {{ pick.company?.name }}
            </div>
            {{ pick.dispatch_number }}
          </q-item-label>

          <q-separator inset />
          <q-item>
            <q-item-section avatar top>
              <q-avatar color="blue" icon="warehouse" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ pick.warehouse?.name }}
              </q-item-label>
              <q-item-label caption>
                <div class="q-px-sm q-pb-xs">
                  {{ pick.warehouse?.address_line1 }}
                </div>
                <div class="q-px-sm q-pb-xs">
                  <b>Mobile</b>:
                  <a href="`tel:${pick.phone}`">
                    {{ pick.warehouse?.phone }}
                  </a>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable active-class="bg-grey-9 text-white">
            <q-item-section avatar top>
              <q-avatar color="red" icon="today" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ pick.company?.name }}
              </q-item-label>
              <q-item-label caption>
                <div class="q-px-sm q-pb-xs">
                  <b>ทะเบียน </b>: {{ pick.vehicle?.plate_number }}
                  {{ pick.vehicle?.plate_province }} :
                  {{ pick.vehicle?.type }}
                </div>

                <div class="q-px-sm q-pb-xs"><b>Memo</b>: {{ pick.memo }}</div>

                <div class="q-px-sm">
                  <b>Load</b>:
                  {{ getDate(pick.planned_date) }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />

          <q-item>
            <q-item-section side>
              <q-icon color="deep-orange" name="inventory_2" size="xl" />
            </q-item-section>
            <q-btn class="q-mx-xs q-text-center q-ml-lg" size="sm" color="black"
              >{{ pick.shipment_ids.length }} Boxes</q-btn
            >
            <q-item-section> </q-item-section>
          </q-item>

          <q-separator />
        </q-list>
      </router-link>
    </q-scroll-area>
  </div>
</template>

<script setup>
// IMPORTS

import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { useLoadingStore } from "src/stores/loading-store";
import { reactive, ref, onMounted } from "vue";
import moment from "moment-timezone";

const userStore = useUserStore();
const pickingStore = useLoadingStore();
const router = useRouter();
const $q = useQuasar();

const userId = ref("");
const items = ref([
  {
    label: "One",
  },
  {
    label: "Two",
  },
]);

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

const isLoggedInPicking = () => {
  if (!userStore.email) {
    const res = $q.dialog({
      title: "You're not logged in!",
      message: "Login to process the pick-up",
      cancel: true,
      persistent: true,
    });

    res.onOk(() => {
      router.push("/auth");
    });

    return;
  }
  router.push("/load");
};

const getDate = (dateTime) => {
  // return moment.tz(dateTime, "Asia/Bangkok");
  return moment(dateTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm");
  // return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
};

const fechPicking = async (driver) => {
  try {
    // Get the Picking Up List
    const picking = await pickingStore.fetchPicking(driver);
    if (picking) listPickings.value = picking.data.data;
    // Set user data in localstorage (PINIA)
  } catch (error) {}
};
</script>


<style lang="scss">
#Directs {
  .form-style {
    margin: 0 auto;
    height: calc(100vh - 180px);
    max-width: 500px;
  }
  .section-title {
    padding: 12px 10px 8px 10px;
    max-width: 500px;
    margin: 0 auto;
  }

  .info {
    font-size: 16px;
  }

  .borderBottom {
    border-bottom: 1px solid rgb(201, 201, 201);
  }

  .list {
    margin: 0 auto;
    height: calc(100vh - 250px);
    max-width: 800px;
  }
}
</style>



