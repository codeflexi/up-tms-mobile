<template>
  <q-page>
    <q-toolbar class="bg-grey-9 text-white">
      <q-icon
        color="red-9"
        name="local_shipping"
        round
        dense
        size="30px"
      ></q-icon>
      <q-toolbar-title>Pickup Details</q-toolbar-title>
    </q-toolbar>
    <div class="q-pa-md q-gutter-md">
      <q-list bordered class="flex column justify-center">
        <q-item-label header class="text-weight-bold text-subtitle1">
          รับสินค้าจากต้นทาง
        </q-item-label>
        <q-separator inset />
        <q-item clickable active-class="bg-grey-9 text-white">
          <q-item-section avatar>
            <q-avatar>
              <q-icon color="yellow" name="inventory_2" round dense size="40px">
              </q-icon>
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-lable> {{ shipment.pick_number }} </q-item-lable>
          </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
      <q-tabs v-model="currentTab" class="text-weight-bold">
        <q-tab name="shipment" label="Shipments" />
        <q-tab name="image" label="ถ่ายภาพ" />
        <q-tab name="remark" label="ลายเซ็นต์" />
        <q-tab name="detail" label="ตรวจสอบ" />
      </q-tabs>
      <q-tab-panels
        animated
        swipeable
        ref="tabPanels"
        infinite
        v-model="currentTab"
      >
        <q-tab-panel name="shipment">
          <div class="row justify-between q-mb-lg">
            <q-btn
              size="lg"
              icon="qr_code_scanner"
              label="สแกน"
              class="row justify-center bg-red-9 text-white q-mb-xs text-weight-bold"
              @click="setPopupBarcode()"
            >
            </q-btn>
            <AddBarcodeDiaglog
              v-model:dialog="dialogBarcode"
              @shipmentsReturn="shipmentsReturn"
            />

            <q-btn
              size="lg"
              icon="check_box"
              label="Manual"
              class="row justify-center bg-red-9 text-white q-mb-xs text-weight-bold"
              @click="setPopupManual()"
            >
            </q-btn>
            <AddManualDialog
              v-model:dialog="dialogManual"
              :shipmentArr="shipment.shipment_ids"
              @shipmentsReturn="shipmentsReturn"
            />
          </div>
          <div v-if="shipmentArr.length > 0">
            <ShipmentList :shipments="shipmentArr" />
          </div>
          <div v-else>ไม่มีรายการ กรุณากดปุ่ม แสกน!!!</div>
        </q-tab-panel>

        <q-tab-panel name="image">
          <q-btn
            label="กด ถ่ายภาพ"
            class="row justify-center bg-red-9 text-white q-mb-xs text-weight-bold"
            @click="setPopup()"
          >
          </q-btn>
          <Cam
            v-model:dialog="dialog"
            @addToViaArray="setImage"
            @imgReturn="imgReturn"
          />
          <div v-if="imgSorce">
            <q-img :src="imgSorce"></q-img>
          </div>
          <div v-else>ไม่มีภาพ กรุณากดปุ่ม กด ถ่ายภาพ!!!</div>
        </q-tab-panel>

        <q-tab-panel name="remark">
          พิมพ์ลายเซ็นต์ด้านล่าง
          <VueSignaturePad
            id="signature"
            width="100%"
            class="bg-grey-2"
            height="100px"
            ref="signaturePad"
            :options="options"
          />
          <q-img
            v-if="signImg"
            :src="signImg"
            width="100%"
            height="100px"
            class="bg-yellow-1 q-mt-xs q-mb-xs"
          ></q-img>

          <div class="row justify-center q-mt-xl">
            <span class="q-mr-lg">
              <q-btn
                class="full-width bg-white text-black q-mb-xs"
                label="Undo signature"
                @click="undoSignature"
              />
            </span>
            <span>
              <q-btn
                class="full-width bg-red-9 text-white q-mb-xs"
                label="save signature"
                @click="saveSignature"
              />
            </span>
          </div>
        </q-tab-panel>
        <q-tab-panel name="detail">
          Pick-up Detail:

          <q-list
            bordered
            class="flex column justify-center q-mt-sm rounded-borders shadow-2"
          >
            <q-item-label header> {{ shipment.pick_number }} </q-item-label>
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
                  <div class="q-px-sm q-pb-xs">
                    <b>Mobile</b>:
                    <a href="`tel:${shipment.warehouse?.phone}`">
                      {{ shipment.warehouse?.phone }}
                    </a>
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
                  {{ shipment.company?.name }}
                </q-item-label>
                <q-item-label caption>
                  <div class="q-px-sm q-pb-xs">
                    <b>ทะเบียน </b>: {{ shipment.vehicle?.plate_number }}
                    {{ shipment.vehicle?.plate_province }} :
                    {{ shipment.vehicle?.type }}
                  </div>

                  <div class="q-px-sm q-pb-xs">
                    <b>Memo</b>: {{ shipment.memo }}
                  </div>

                  <div class="q-px-sm">
                    <b>Pick</b>:
                    {{ getDate(shipment.planned_date) }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

      <q-separator />

      <div class="row justify-center q-mt-xl">
        <span class="q-mr-lg">
          <q-btn
            to="/pick"
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
            @click="updateShipment"
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
import { usePickingStore } from "src/stores/picking-store";
import { ref, onMounted, computed } from "vue";
import moment from "moment-timezone";
import { Camera, CameraResultType } from "@capacitor/camera";
import Cam from "src/pages/direct/AddImageDialog.vue";
import AddBarcodeDiaglog from "src/pages/pick/AddBarcodeDialog.vue";
import AddManualDialog from "src/pages/pick/AddManualDialog.vue";
import ShipmentList from "src/pages/pick/ShowShipment.vue";
import { VueSignaturePad } from "vue-signature-pad";

const userStore = useUserStore();
const shipmentStore = useShipmentStore();
const pickingStore = usePickingStore();
const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const currentTab = ref("image");
const dialog = ref(false);
const dialogBarcode = ref(false);
const dialogManual = ref(false);

const imgSorce = ref(null);
const shipment = ref({});
const shipmentArr = ref([]);
const signaturePad = ref(null);
const signImg = ref(null);

const options = ref({
  penColor: "#c0f",
});

onMounted(() => {
  // console.log("Get the route id", route.params.id);
  currentTab.value = "shipment";
  fectSingleShipment(route.params.id);
});

const saveSignature = async () => {
  try {
    // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
    const { isEmpty, data } = signaturePad.value.saveSignature();
    signImg.value = data;
    // console.log(isEmpty);
    // console.log(data);
  } catch (error) {}
};

const isChangedComputed = computed(() => {
  if (signImg.value && imgSorce.value && shipmentArr.value.length > 0) {
    return false;
  }

  return true;
});

const imgReturn = (val) => {
  try {
    // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
    imgSorce.value = val;
  } catch (error) {}
};

const shipmentsReturn = (val) => {
  try {
    // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
    shipmentArr.value = val;
  } catch (error) {}
};

const undoSignature = async () => {
  try {
    // const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
    signaturePad.value.undoSignature();
    signImg.value = null;
  } catch (error) {}
};

const fectSingleShipment = async (id) => {
  try {
    // Get the Picking Up List
    const shipmentById = await shipmentStore.fetchPickingById(id);
    if (shipmentById) shipment.value = shipmentById.data.data;
    // Set user data in localstorage (PINIA)
  } catch (error) {}
};

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
const setPopupManual = () => {
  dialogManual.value = !dialogManual.value;
};

const setPopupBarcode = () => {
  dialogBarcode.value = !dialogBarcode.value;
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

const updateShipment = async () => {
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

    // Delete Duplicate
    const unique = checkDuplicate(shipmentArr.value);

    const data = {
      photo: imgSorce.value,
      signature: signImg.value,
      shipment_ids: unique,
    };

    console.log(data);

    await pickingStore.handleCreatePicking(route.params.id, data);

    // Redirect
    router.push("/pick");

    $q.notify({
      type: "positive",
      position: "top-left",
      icon: "check_circle",
      message: "This Picking Number was updated successfully!",
    });
  } catch (error) {
    console.log(error);
    $q.dialog({
      title: "Picked Up failed",
      message:
        "Your pickup was unsuccessful. Please make sure that your details are correct.",
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
