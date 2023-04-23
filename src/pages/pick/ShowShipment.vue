<template>
  <div>
    <q-list
      v-for="pick in shipments"
      :key="pick.id"
      style="text-decoration: none; color: black"
      bordered
      class="flex column justify-center q-mt-sm rounded-borders shadow-2"
    >
      <q-item-label class="text-weight-bold" header>
        {{ pick.waybill_number }}
      </q-item-label>
      <q-separator inset />
      <q-item>
        <q-item-section avatar top>
          <q-avatar color="red" icon="local_shipping" text-color="white" />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-bold">
            {{ pick?.company }}
          </q-item-label>
          <q-item-label caption>
            <div class="q-px-sm q-pb-xs">
              {{ pick?.sales_channel }}
            </div>
          </q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable active-class="bg-grey-9 text-white">
        <q-item-section avatar top>
          <q-avatar color="green" icon="person_pin_circle" text-color="white" />
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
              <b>Mobile</b>:
              <a href="`tel:${pick.phone}`"> {{ pick.phone }} </a>
            </div>
            <div class="q-px-sm">
              <b>Date</b>:
              {{ getDate(pick.shipment_date) }}
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
              </q-item> -->

      <!-- <q-separator /> -->
    </q-list>
  </div>
</template>

<script setup>
import { toRefs, ref } from "vue";
import moment from "moment-timezone";
// PROPS
const props = defineProps({
  shipments: Object,
});
const getDate = (dateTime) => {
  // return moment.tz(dateTime, "Asia/Bangkok");
  return moment(dateTime).tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm");
  // return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
};

const { shipments } = toRefs(props);
</script>

