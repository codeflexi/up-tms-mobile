<template>
  <div id="AddPickups" class="column flex-center">
    <q-toolbar class="bg-grey-10 text-white">
      <q-toolbar-title>Picked Up Lists</q-toolbar-title>
      <!-- <q-btn flat round dense size="20px" icon="add" /> -->
    </q-toolbar>

    <div v-if="listPickings.length > 0" class="section-title">
      <div class="text-h6 q-mx-sm">
        Shipment Scanned : {{ listPickings.length }} of
        {{ pickingStore.getNumberShipment }}
      </div>
      <div>
        <StreamBarcodeReader
          class="rounded-borders"
          style="max-width: 350px"
          @decode="onDecode"
          @loaded="onLoaded"
        ></StreamBarcodeReader>
      </div>

      <q-list class="list">
        <q-item v-for="ship in listPickings" :key="ship.id">
          <q-item-section top avatar>
            <q-avatar color="red" text-color="white" icon="directions" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ ship.waybill_number }}</q-item-label>
            <q-item-label>{{ ship.sales_channel }}</q-item-label>
            <q-item-label caption>
              <div class="q-px-sm q-pb-xs"><b>To</b>: {{ ship.ship_to }}</div>
              <div class="q-px-sm q-pb-xs">
                <b>Shipment#</b>: {{ ship.shipment_number }}
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
              icon="delete_outline"
            />
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
      </q-list>
    </div>

    <div v-if="listPickings.length < 1" class="text-center q-pt-lg">
      <q-btn flat round dense size="33px" icon="add_circle_outline" />
      <div class="text-h6">Scan some shipment!</div>
      <div class="q-pa-md info">
        <StreamBarcodeReader
          class="rounded-borders text-h6 q-mx-sm"
          style="max-width: 500px"
          @decode="onDecode"
          @loaded="onLoaded"
        ></StreamBarcodeReader>
      </div>
    </div>

    <q-scroll-area>
      <q-separator spaced inset />
    </q-scroll-area>
    <div class="q-pt-md">
      <q-btn
        size="lg"
        class="full-width"
        color="black"
        label="Confirm pickup"
        @click="onSubmittedData"
      ></q-btn>
    </div>
  </div>
</template>

<script setup>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { useUserStore } from "src/stores/user-store";
import { usePickingStore } from "src/stores/picking-store";
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { createConditionalExpression } from "@vue/compiler-core";
import { useQuasar } from "quasar";

const $q = useQuasar();
const router = useRouter();
const decodedText = ref("");
const listPickings = ref([]);
const unique = ref([]);

const userStore = useUserStore();
const pickingStore = usePickingStore();

const shipmentId = ref("");
const card = ref(false);

let data = reactive({
  id: null,
  waybill_number: null,
  sales_channel: null,
  ship_to: null,
});

const onDecode = async (result) => {
  decodedText.value = result;
  console.log(result);

  const find = findShipment(listPickings.value, decodedText.value);

  console.log(find);
  if (find === "N") {
    const res = await pickingStore.fetchShipmentById(decodedText.value);

    if (res) {
      data = {
        seq: `PI${Date.now()}${Math.round(Math.random() * 10)}`,
        id: res.data.data[0]._id,
        waybill_number: res.data.data[0].waybill_number,
        sales_channel: res.data.data[0].sales_channel,
        ship_to:
          res.data.data[0].city +
          " " +
          res.data.data[0].state +
          " " +
          res.data.data[0].zipcode,
        shipment_number: res.data.data[0].shipment_number,
      };
      console.log(data);
    }
    try {
      listPickings.value.push(data);
    } catch (err) {
      console.log(err);
    }
  }
};

// const orderShipments = computed(() => {
//   return listPickings.value.sort((a, b) => {
//     return b.seq - a.seq;
//   });
// });

const onSubmittedData = async () => {
  if (!navigator.onLine) {
    $q.dialog({
      title: "Offline",
      message:
        "Sorry, but to update your details you need to be connected to the internet.",
      persistent: true,
    });
  }
  try {
    const unique = checkDuplicate(listPickings.value);
    console.log(unique);
    const upload = {
      pick_id: pickingStore.getId,
      shipment_ids: unique,
    };

    await pickingStore.handleCreatePicking(upload);
    $q.notify({
      color: "positive",
      textColor: "white",
      icon: "check_circle",
      message: "You just successful updated the Data",
      position: "top-left",
      timeout: Math.random() * 5000 + 2000,
    });

    router.push("/pickup");
  } catch (error) {
    $q.notify({
      color: "negative",
      textColor: "white",
      icon: "error",
      message:
        "Oops! Something went wrong with this route. Please try another.",
      position: "top-left",
      timeout: Math.random() * 5000 + 2000,
    });
  }
};

const checkDuplicate = (list) => {
  const duplicateIds = list.reduce((acc, cur) => {
    if (acc[cur.id]) {
      acc[cur.id]++;
    } else {
      acc[cur.id] = 1;
    }
    return acc;
  }, {});

  const result = Object.keys(duplicateIds).filter(
    (id) => duplicateIds[id] >= 1
  );
  return result; // array of duplicate ids
};

const findShipment = (shipments, shipment) => {
  const foundShipment = shipments.find((s) => s.waybill_number === shipment);
  if (foundShipment) {
    return "Y";
  }
  return "N";
};

const onLoaded = async () => {
  try {
    // alert("Ready to start");
    console.log("Ready to start");
  } catch (err) {
    console.log(err);
  }
};
</script>



<style lang="scss">
#AddPickups {
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



