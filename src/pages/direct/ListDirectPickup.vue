<template>
  <div id="Directs" class="font-prompt-300">
    <q-toolbar class="bg-grey-10 text-white">
      <q-icon
        color="red-9"
        name="local_shipping"
        round
        dense
        size="30px"
      ></q-icon>
      <q-toolbar-title>Direct Pick-Up Lists</q-toolbar-title>
    </q-toolbar>

    <div v-if="listPickings.length > 0" class="section-title">
      <div class="text-h6 q-mx-sm">
        Select one to pick up! of {{ listPickings.length }} Jobs
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
      <div class="q-pa-md info">Wating for pick up!</div>
    </div>

    <q-scroll-area v-else class="list">
      <!-- <q-separator spaced inset /> -->

      <!-- <q-list bordered style="width: 300px" class="flex column justify-center"> -->
      <router-link
        v-for="pick in listPickings"
        :key="pick._id"
        :to="`/direct/add-direct/${pick._id}`"
        class="cursor-pointe"
        style="text-decoration: none; color: black"
      >
        <q-list
          bordered
          class="flex column justify-center q-mt-sm rounded-borders shadow-3 bg-blue-1"
        >
          <q-item-label
            class="text-weight-bold rounded-borders text-white bg-blue-8"
            header
          >
            <div class="q-pb-xs">
              {{ pick.company?.name }}
            </div>
            {{ pick.waybill_number }}
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
                  <a href="`tel:${pick.warehouse?.phone}`">
                    {{ pick.warehouse?.phone }}
                  </a>
                </div>
                <div class="q-px-sm">
                  <b>Date</b>:
                  {{ getDate(pick.picking_date) }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable active-class="bg-grey-9 text-white">
            <q-item-section avatar top>
              <q-avatar
                color="red"
                icon="person_pin_circle"
                text-color="white"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-bold">
                {{ pick?.shipping_address_line1 }}
              </q-item-label>
              <q-item-label caption>
                <div class="q-px-sm q-pb-xs">
                  <b>{{ pick?.shipment_number }} </b> |
                  {{ pick.content_items ? pick.content_items : "" }}
                </div>
                <div class="q-px-sm q-pb-xs">
                  <b>Name</b>: {{ pick.shipping_full_name }}
                </div>
                <div class="q-px-sm q-pb-xs">
                  <b>Mobile</b>: <a href="tel:0863953212"> {{ pick.phone }} </a>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <!-- <q-separator />

          <q-item>
            <q-item-section side>
              <q-icon color="deep-orange" name="brightness_medium" />
             </q-item-section> 

            <q-item-section>
              <q-slider
                :model-value="5"
                :min="0"
                :max="10"
                label
                color="deep-orange"
              />
            </q-item-section>
          </q-item>

          <q-separator />  -->
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
import { useShipmentStore } from "src/stores/shipment-store";
import { reactive, ref, onMounted } from "vue";
import moment from "moment-timezone";

const userStore = useUserStore();
const shipmentStore = useShipmentStore();
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
  router.push("/direct");
};

const getDate = (dateTime) => {
  // return moment.tz(dateTime, "Asia/Bangkok");
  return moment(dateTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm");
  // return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
};

const fechPicking = async (driver) => {
  try {
    // Get the Picking Up List
    const picking = await shipmentStore.fetchShipmentByDriver(driver);
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



