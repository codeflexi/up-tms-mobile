<template>
  <div id="AddPickups">
    <q-toolbar class="text-white bg-red-10">
      <q-toolbar-title> ADD Pick Up </q-toolbar-title>
    </q-toolbar>

    <q-scroll-area class="q-pa-md form-style">
      <div class="txt-h6 q-pb-md">Please Scan!</div>

      <q-input outlined stack-label label="Waybill Number">
        <template v-slot:append>
          <q-icon name="qr_code_scanner" />
        </template>
      </q-input>
      <StreamBarcodeReader
        class="rounded-borders"
        style="max-width: 350px"
        @decode="onDecode"
        @loaded="onLoaded"
      ></StreamBarcodeReader>
      <div class="q-pa-md q-gutter-md q-pt-md">
        <q-list
          bordered
          padding
          class="rounded-borders"
          style="max-width: 350px"
        >
          <q-item-label header>Shipments</q-item-label>
          <q-item clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="view_in_ar" color="primary" text-color="white" />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="1">{{ decodedText }}</q-item-label>

              <q-item-label lines="1">TH0956545</q-item-label>
              <q-item-label caption>Pureen</q-item-label>
              <q-item-label caption>February 22nd, 2019</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="delete_outline" color="black" />
            </q-item-section>
          </q-item>
          <q-separator spaced />
        </q-list>
      </div>

      <div class="q-pt-md">
        <q-btn
          size="lg"
          class="full-width"
          color="black"
          label="Confirm pickup"
        ></q-btn>
      </div>
    </q-scroll-area>
  </div>
</template>



<script setup>
import { StreamBarcodeReader } from "vue-barcode-reader";
import { ref } from "vue";
const decodedText = ref("");
const shipments = ref([]);
const onDecode = async (result) => {
  try {
    decodedText.value = result;
    shipments.value.push(decodedText.value);
    // console.log(shipments.value);
  } catch (err) {
    console.log(err);
  }
};

const onLoaded = async () => {
  try {
    // alert("Ready to start");
    // console.log("Ready to start");
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
    max-width: 500px;
  }
}
</style>



