<template>
  <q-layout>
    <q-header class="bg-red-14">
      <q-toolbar>
        <q-toolbar-title> UP TMS App </q-toolbar-title>
        <q-btn flat round dense icon="login" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer elevated>
      <q-tabs class="text-light bg-red-14">
        <q-route-tab
          to="/pickup"
          name="/pickup"
          icon="local_shipping"
          label="Pickup"
        />
        <q-route-tab
          to="/sort"
          name="/sort"
          icon="precision_manufacturing"
          label="Sort"
        />
        <q-route-tab to="/shiping" name="/Shiping" icon="send" label="Ship" />
        <q-route-tab to="/auth" name="/auth" icon="login" label="Auth" />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
<script setup>
</script>
