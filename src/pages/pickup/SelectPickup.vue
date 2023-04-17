<template>
  <div id="Pickups">
    <q-toolbar class="bg-grey-10 text-white">
      <q-toolbar-title>Picked Up Lists</q-toolbar-title>
      <q-btn
        @click="isLoggedInAddRoute"
        flat
        round
        dense
        size="20px"
        icon="add"
      />
    </q-toolbar>

    <div v-if="listPickings.length > 0" class="section-title">
      <div class="text-h6 q-mx-sm">
        Select one to pick up! of {{ listPickings.length }} Jobs
      </div>
    </div>

    <div v-if="listPickings.length < 1" class="text-center q-pt-lg">
      <q-btn
        @click="isLoggedInAddRoute"
        flat
        round
        dense
        size="33px"
        icon="add_circle_outline"
      />
      <div class="text-h6">Select some pickup!</div>
      <div class="q-pa-md info">Pick up!</div>
    </div>

    <q-scroll-area v-else class="list">
      <q-separator spaced inset />

      <q-list
        v-for="pick in listPickings"
        :key="pick._id"
        @click="card = !card"
      >
        <q-item>
          <q-item-section top avatar>
            <q-avatar color="red" text-color="white" icon="directions" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ pick.company?.name }}</q-item-label>
            <q-item-label>{{ pick.pick_number }}</q-item-label>
            <q-item-label caption>
              <div class="q-px-sm q-pb-xs">
                <b>From</b>: {{ pick.warehouse?.address_line1 }}
              </div>
              <div class="q-px-sm q-pb-xs"><b>Memo</b>: {{ pick.memo }}</div>
              <div class="q-px-sm">
                <b>Date</b>: {{ getDate(pick.planned_date) }}
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section side bottom>
            <q-btn
              class="q-ma-sm"
              size="xl"
              color="black"
              flat
              round
              dense
              icon="qr_code_scanner"
              @click="scanPickup(pick._id)"
            />
            <q-btn class="q-mx-xs" size="sm" color="green"
              >{{ pick.shipment_ids.length }} Boxes</q-btn
            >
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>
    </q-scroll-area>
  </div>
</template>

<script setup>
// IMPORTS

import { useRouter } from "vue-router";
import { useQuasar, date } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { usePickingStore } from "src/stores/picking-store";
import { reactive, ref, onMounted } from "vue";
import moment from "moment-timezone";

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
      title: "You're not logged in!",
      message: "Login to select shipment for pickup",
      cancel: true,
      persistent: true,
    });

    res.onOk(() => {
      router.push("/auth");
    });

    return;
  }
  router.push("/pickup/add-pickup");
};

const fechPicking = async (driver) => {
  try {
    // Get the Picking Up List
    const picking = await pickingStore.fetchPicking(driver);
    if (picking) listPickings.value = picking.data.data;

    // Set user data in localstorage (PINIA)
  } catch (error) {}
};

const scanPickup = async (id) => {
  console.log(id);

  const pickingid = await pickingStore.fetchPickingById(id);
  const data = {
    id: pickingid.data.data._id,
    picking_number: pickingid.data.data.pick_number,
    warehouse: pickingid.data.data.warehouse.name,
    address: pickingid.data.data.warehouse.address_line1,
    company: pickingid.data.data._id,
    number_shipment: pickingid.data.data.shipment_ids.length,
  };
  pickingStore.setPicking(data);
  router.push("/pickup/add-pickup");
};

const getDate = (dateTime) => {
  // return moment.tz(dateTime, "Asia/Bangkok");
  return moment(dateTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm");
  // return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
};
</script>


<style lang="scss">
#Pickups {
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


