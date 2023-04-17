<template>
  <q-page id="selectPickup">
    <q-toolbar class="text-white bg-red-10">
      <q-btn flat round dense icon="menu" />
      <q-toolbar-title> Save Pick Up </q-toolbar-title>
      <q-btn flat round dense icon="more_vert" />
    </q-toolbar>

    <div class="q-pa-md form-style">
      <div class="txt-h6 q-pb-md">Please Scan!</div>

      <q-input outlined stack-label label="Waybill Number">
        <template v-slot:append>
          <q-icon name="qr_code_scanner" />
        </template>
      </q-input>
      <div class="q-pt-md">
        <q-btn
          size="lg"
          class="full-width"
          color="black"
          label="confirm"
        ></q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup></script>

  <style lang="scss">
#selectPickup {
  .form-style {
    margin: 0 auto;
    height: calc(100vh - 180px);
    max-width: 500px;
  }
}
</style>
