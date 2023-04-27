<template>
  <q-dialog
    v-model="dialogComputed"
    id="imageInfo"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-white card-bg-color">
      <q-toolbar class="bg-red">
        <q-icon name="photo_camera" dense size="40px" color="yellow"></q-icon>
        <q-toolbar-title class="q-pl-xs">เลือก รายการ</q-toolbar-title>
        <q-space />
        <q-btn class="" dense flat size="md" icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-scroll-area class="main">
        <q-list class="q-mt-lg">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 q-pl-sm">
                <div class="row">
                  <div v-if="isOpenCamera" class="col-12 text-center">
                    <StreamBarcodeReader
                      class="rounded-borders"
                      style="max-width: 350px"
                      ref="scanner"
                      @decode="onDecode"
                      @loaded="onLoaded"
                    ></StreamBarcodeReader>
                  </div>
                  <div class="col-12 text-center">
                    <q-btn
                      v-if="isShipment"
                      label="Add+"
                      color="primary"
                      icon="camera"
                      @click="takePhoto"
                    />
                  </div>

                  <div>
                    <q-list>
                      <q-item
                        class="q-text-white"
                        v-for="(ship, index) in shipmentArr"
                        :key="ship._id"
                        clickable
                        v-ripple
                      >
                        <q-item-section top avatar>
                          <q-avatar
                            size="xl"
                            color="blue"
                            text-color="white"
                            icon="inventory_2"
                          />
                        </q-item-section>

                        <q-item-section class="text-white">
                          <q-item-label>{{ ship.waybill_number }}</q-item-label>
                          <q-item-label>{{ ship.sales_channel }}</q-item-label>
                          <q-item-label>{{
                            ship.shipping_full_name
                          }}</q-item-label>
                          <q-item-label caption>
                            <div class="q-px-sm q-pb-xs text-white">
                              <b>To</b>: {{ ship.shipping_address_line1 }}
                            </div>
                            <div class="q-px-sm q-pb-xs text-white">
                              <b>Shipment#</b>: {{ ship.shipment_number }}
                            </div>
                          </q-item-label>
                        </q-item-section>
                        <q-item-section side bottom>
                          <div>
                            <q-checkbox
                              v-model="ship._id"
                              color="blue"
                              @click.stop="takePhoto(index)"
                            />
                          </div>
                        </q-item-section>
                      </q-item>
                      <q-separator color="red" spaced inset />
                    </q-list>
                  </div>

                  <div class="col-12 text-center">
                    <q-img
                      :src="imageCapture"
                      style="height: 320px; max-width: 300px"
                    />
                    <img src="" ref="imgTakePhoto" width="250rem" />

                    <q-btn
                      v-if="shipments"
                      label="SAVE SHIPMENTS"
                      color="black"
                      icon="save"
                      class="q-mt-lg"
                      @click="saveShipment"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset />
        </q-list>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>
  
<script setup>
import { onMounted, onUnmounted, computed, toRefs, ref, reactive } from "vue";
import { useQuasar } from "quasar";
// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
import { StreamBarcodeReader } from "vue-barcode-reader";
import { usePickingStore } from "src/stores/picking-store";
const $q = useQuasar();
const emit = defineEmits(["update:dialog", "shipmentsReturn"]);

const pickingStore = usePickingStore();

// PROPS
const props = defineProps({
  dialog: Boolean,
  shipmentArr: Object,
  via: Array,
});

const { shipmentArr, dialog, via } = toRefs(props);

const isNewPhoto = ref(null);
const isOpenCamera = ref(null);
const isShipment = ref(false);
const imageCapture = ref(null);
const imgTakePhoto = ref(null);
const shipmenNumber = ref(null);
const shipments = ref([]);
const scanner = ref();
const left = ref(false);
const checkbox = ref([]);

let shipmentData = reactive({
  // seq: null,
  // id: null,
  // waybill_number: null,
  // shipment_number: null,
  // shipping_full_name: null,
  // shipping_address_line1: null,
  // ship_to: null,
  // phone: null,
  // sales_channel: null,
  // content_items: [],
});

// PROPS END

const onDecode = async (result) => {
  // console.log(result);

  setTimeout(() => {
    shipmenNumber.value = result;
    takePhoto();
  }, 400);
};

onUnmounted(() => {
  //   video.value.pause();
  //   video.value.currentTime = 0;
});
// beforeDestroy(() => {
//   video.value.destroy();
// });

const saveShipment = () => {
  dialogComputed.value = true;
  setTimeout(() => {
    emit("shipmentsReturn", shipments.value);
  }, 400);
};

const deleteTask = (index) => {
  // alert(index);
  alert(shipmentArr.value[index].waybill_number);
  // shipmentArr.value.splice(index, 1);
};

// COMPUTED
const dialogComputed = computed({
  get: () => dialog.value,
  set: (val) => emit("update:dialog", false),
});

const startCamera = async () => {
  isOpenCamera.value = true;
};

const onLoaded = async () => {
  // console.log("scanner");
  // scanner.value.stream.getTracks().forEach(function (track) {
  //   track.stop();
  // });
};

const clearShipment = () => {
  shipmentData = {
    seq: null,
    id: null,
    shipment_date: null,
    company: null,
    waybill_number: null,
    shipment_number: null,
    shipping_full_name: null,
    shipping_address_line1: null,
    ship_to: null,
    phone: null,
    sales_channel: null,
    content_items: [],
  };
  isShipment.value = false;
};

const takePhoto = async (index) => {
  clearShipment();

  const wayBill = shipmentArr.value[index].waybill_number;
  const res = await pickingStore.fetchShipmentById(wayBill);

  if (res) {
    isShipment.value = true;
    shipmentData.value = {
      seq: `PI${Date.now()}${Math.round(Math.random() * 10)}`,
      id: res.data.data[0]._id,
      company: res.data.data[0].company.name,
      waybill_number: res.data.data[0].waybill_number,
      sales_channel: res.data.data[0].sales_channel,
      shipment_date: res.data.data[0].createAt,
      ship_to:
        res.data.data[0].city +
        " " +
        res.data.data[0].state +
        " " +
        res.data.data[0].zipcode,
      shipment_number: res.data.data[0].shipment_number,
      shipping_full_name: res.data.data[0].shipping_full_name,
      shipping_address_line1: res.data.data[0].shipping_address_line1,
      phone: res.data.data[0].phone,
      content_items: res.data.data[0].content_items,
    };
    // console.log(data);
  }
  setTimeout(() => {
    addShipment(shipmentData.value);
  }, 400);
};

const removeShipment = (shipment) => {
  shipments.value = shipments.value.filter((t) => t !== shipment);
};

const addShipment = (shipment) => {
  const newItem = shipment; // comes from request

  if (newItem.id !== null) {
    const duplicateIndex = shipments.value
      .map((item) => item.waybill_number)
      .indexOf(newItem.waybill_number);

    // returns index of Object that has same name as newItem's name
    // or -1 if not found
    // Post request

    if (duplicateIndex === -1) {
      shipments.value.push(newItem);
      isShipment.value = false;
      $q.notify({
        type: "positive",
        position: "top-left",
        icon: "check_circle",
        message: "Save Succfully " + duplicateIndex + "!",
      });
    } else {
      $q.notify({
        type: "negative",
        position: "top-left",
        icon: "check_circle",
        message: "Duplicate Waybill Number !! ",
      });
    }
    // Put request
  } else {
    // this.items[duplicateIndex] = newItem;
  }
};
</script>


  
  <style lang="scss">
#imageInfo {
  .main {
    height: calc(100vh - 50px);
    margin-top: 30px;
    max-width: 500px;
    margin: 0 auto;
  }

  .row {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .card-bg-color {
    background-color: rgba(9, 8, 8, 0.8) !important;
  }

  .addressSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .connectionTypeSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .companySection {
    padding: 5px 0 5px 8px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .addressSection {
    padding-right: 5px;
    font-size: 16px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .isAvailableClass {
    color: #ffffff;
    background-color: $green-14;
    border-radius: 5px;
    padding: 0 10px 0 10px;
  }

  .isNotAvailableClass {
    color: #ffffff;
    background-color: $red-14;
    border-radius: 5px;
    padding: 0 10px 0 10px;
  }

  .green {
    color: rgba(33, 205, 33, 0.865);
  }

  .red {
    color: rgba(218, 51, 51, 0.865);
  }
}
</style>
  
