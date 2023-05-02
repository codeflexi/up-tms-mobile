<template>
  <q-page>
    <q-toolbar class="bg-grey-9 text-white">
      <q-icon
        color="yellow"
        name="person_pin_circle"
        round
        dense
        size="30px"
      ></q-icon>
      <q-toolbar-title>UN Delivery</q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md q-gutter-md">
      <q-tabs v-model="currentTab" class="text-weight-bold">
        <q-tab name="detail" label="ลูกค้า" />
      </q-tabs>
      <q-tab-panels
        animated
        swipeable
        ref="tabPanels"
        infinite
        v-model="currentTab"
      >
        <q-tab-panel name="detail">
          <q-list
            bordered
            class="flex column justify-center q-mt-sm rounded-borders shadow-2"
          >
            <q-item-label header> {{ shipment.waybill_number }} </q-item-label>
            <q-separator inset />
            <q-item>
              <q-item-section avatar top>
                <q-avatar color="blue" icon="warehouse" text-color="white" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ shipment.warehouse?.name }}
                </q-item-label>
                <q-item-label caption>
                  <div class="q-px-sm q-pb-xs">
                    {{ shipment.warehouse?.address_line1 }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item active-class="bg-grey-9 text-white">
              <q-item-section avatar top>
                <q-avatar
                  color="red"
                  icon="person_pin_circle"
                  text-color="white"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold">
                  {{ shipment?.shipping_address_line1 }}
                </q-item-label>
                <q-item-label caption>
                  <div class="q-px-sm q-pb-xs">
                    <b>{{ shipment?.shipment_number }} </b> |
                    {{ shipment.content_items ? shipment.content_items : "" }}
                  </div>
                  <div class="q-px-sm q-pb-xs">
                    <b>Name</b>: {{ shipment?.shipping_full_name }}
                  </div>
                  <div class="q-px-sm q-pb-xs">
                    <b>Mobile</b>:
                    <a href="`tel:${shipment.phone}`"> {{ shipment.phone }} </a>
                  </div>
                  <div class="q-px-sm">
                    <b>Date</b>:
                    {{ getDate(shipment.picking_date) }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section
                class="bg-red-9 text-white"
                v-if="shipment.cargo_info?.iscod === 'Y'"
              >
                COD AMOUNT :
                <div class="q-mr-5 text-white text-h3 text-bold rounded-lg">
                  {{ shipment.cargo_info?.cod_amount }} THB
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

      <q-list bordered class="flex column justify-center">
        <q-item-label header class="text-weight-bold text-subtitle1">
          ส่งสินค้าปลายทางไม่ผ่าน เพราะ {{ color }}
        </q-item-label>
        <q-separator inset />
        <q-item clickable active-class="bg-grey-9 text-white">
          <q-item-section>
            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="color" val="not-home" color="teal" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Not Home</q-item-label>
                <q-item-label caption>ลูกค้า ไม่อยู่บ้าน</q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar>
                <q-radio v-model="color" val="re-schedule" color="orange" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Re-Schedule</q-item-label>
                <q-item-label caption>ลูกค้า เลื่อนรับ </q-item-label>
              </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
              <q-item-section avatar top>
                <q-radio v-model="color" val="refused" color="cyan" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Refused</q-item-label>
                <q-item-label caption>ลูกค้ายกเลิก</q-item-label>
              </q-item-section>
            </q-item>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>

      <div class="row justify-center q-mt-xl">
        <span class="q-mr-lg">
          <q-btn
            to="/dispatch"
            size="lg"
            class="full-width bg-white text-black q-mb-xs"
            label="Cancel"
        /></span>
        <span>
          <q-btn
            :disable="isChangedComputed"
            size="lg"
            class="full-width bg-black text-white q-mb-xs"
            label="Save"
            icon="save"
            @click="updateDispatch"
        /></span>
      </div>

      <!-- <q-btn label="popup" @click="setPopup()"></q-btn>
    <q-btn label="next" @click="$refs.tabPanels.next()" />
    <q-btn label="previous" @click="$refs.tabPanels.previous()" /> -->
      <!-- <q-btn label="go to" @click="$refs.tabPanels.goTo('lily')" /> -->
    </div>
  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { useQuasar, date } from "quasar";
import { useUserStore } from "src/stores/user-store";
import { useShipmentStore } from "src/stores/shipment-store";
import { ref, onMounted, computed } from "vue";
import moment from "moment-timezone";
import { Camera, CameraResultType } from "@capacitor/camera";
import Cam from "src/pages/direct/AddImageDialog.vue";
import { VueSignaturePad } from "vue-signature-pad";

const userStore = useUserStore();
const shipmentStore = useShipmentStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const userId = ref("");

const currentTab = ref("detail");
const dialog = ref(false);
const dialog1 = ref(false);
const imgSorce = ref(null);
const maximizedToggle = ref(true);
const shipment = ref({});
const signaturePad = ref(null);
const signImg = ref(null);
const isCodReceived = ref(false);
const color = ref(null);
const isCod = ref("");

const options = ref({
  penColor: "#c0f",
});

onMounted(() => {
  // console.log("Get the route id", route.params.id);
  currentTab.value = "detail";
  fectSingleShipment(route.params.id);
});

const fectSingleShipment = async (id) => {
  try {
    // Get the Picking Up List
    const shipmentById = await shipmentStore.fetchSingleShipment(id);
    if (shipmentById) shipment.value = shipmentById.data.data;
    console.log(shipment.value.cargo_info?.iscod);
    if (shipment.value.cargo_info?.iscod === "Y") {
      isCodReceived.value = false;
    } else {
      isCodReceived.value = true;
    }

    // Set user data in localstorage (PINIA)
  } catch (error) {}
};

const saveSignature = async () => {
  try {
    // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();

    const { isEmpty, data } = signaturePad.value.saveSignature();
    signImg.value = data;
    currentTab.value = "detail";
  } catch (error) {}
};

const isChangedComputed = computed(() => {
  if (color.value) {
    return false;
  } else {
    return true;
  }
});

const getDate = (dateTime) => {
  // return moment.tz(dateTime, "Asia/Bangkok");
  return moment(dateTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm");
  // return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
};

const setImage = (img) => {
  imgSorce.value = img;
};

const setPopup = () => {
  dialog.value = !dialog.value;
};

const updateDispatch = async () => {
  if (!navigator.onLine) {
    $q.dialog({
      title: "Offline",
      message:
        "Your login was unsuccessful. Please make sure that you are connected to the internet.",
      persistent: true,
    });
    return "";
  }

  try {
    // Get the tokens/cookies
    // await userStore.getSanctumCookie()
    // Login user
    const data = {
      reason: color.value,
    };
    const update = await shipmentStore.updateUnDispatch(route.params.id, data);
    console.log("Undel");
    console.log(update);
    // Redirect
    router.push("/dispatch");

    $q.notify({
      type: "positive",
      position: "top-left",
      icon: "check_circle",
      message:
        "Waybill Number: " + shipment.value.waybill_number + " " + "Updated!",
    });
  } catch (error) {
    console.log(error);
    $q.dialog({
      title: "Picked Up failed",
      message:
        "Your Delivery was unsuccessful. Please make sure that your details are correct.",
      persistent: true,
    });
  }
};
</script>

<style lang="scss">
#signature {
  .signbox {
    height: calc(100vh - 50px);
    margin-top: 30px;
    max-width: 500px;
    margin: 0 auto;
    border-color: black;
  }
}
</style>
