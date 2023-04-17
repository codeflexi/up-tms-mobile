<template>
  <q-page id="selectPickup">
    <q-toolbar class="text-white bg-red-10">
      <q-toolbar-title> ADD Sorting </q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>
    <q-scroll-area class="q-pa-md form-style">
      <div class="txt-h6 q-pb-md">PLEASE SCAN!</div>

      <q-input outlined stack-label label="AWB/Shipment Number">
        <template v-slot:append>
          <q-icon name="qr_code_scanner" />
        </template>
      </q-input>
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
              <q-item-label lines="1">TH0956545</q-item-label>
              <q-item-label caption>Pureen</q-item-label>
              <q-item-label caption>February 22nd, 2019</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="delete_outline" color="black" />
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple>
            <q-item-section avatar top>
              <q-avatar icon="view_in_ar" color="primary" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">TH0987878</q-item-label>
              <q-item-label caption>Pureen</q-item-label>
              <q-item-label caption>February 22nd, 2019</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="delete_outline" color="black" />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="q-pt-md">
        <q-btn
          size="lg"
          class="full-width"
          color="black"
          label="Confirm sort"
        ></q-btn>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
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
