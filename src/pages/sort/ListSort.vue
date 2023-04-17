<template>
  <div id="favoriteRoutes" class="column flex-center">
    <q-toolbar class="bg-red-10 text-white">
      <q-toolbar-title>Add Sorts</q-toolbar-title>
      <q-btn flat round dense size="20px" icon="add" />
    </q-toolbar>

    <div class="section-title">
      <div class="text-h6 q-mx-sm">Select one of your saved sorts!</div>
    </div>

    <div class="text-center q-pt-lg">
      <q-btn
        @click="isLoggedInAddRoute"
        flat
        round
        dense
        size="33px"
        icon="add_circle_outline"
      />
      <div class="text-h6">Add new sort!</div>
      <div class="q-pa-md info">
        This is where you can add the shipments sorting!
      </div>
    </div>

    
    <q-date
      v-model="selectedDate"
      color="red"
      text-color="red-2"
      flat
      bordered
    />
    <pre>{{ selectedDate }}</pre>
  </div>
</template>
<script setup>
// IMPORTS

import { useRouter } from "vue-router";
import { ref , onMounted } from "vue";
const router = useRouter();

const selectedDate = ref();

const videoPlayer = null
     const canvas = null
    const imageUrl = null

// IMPORTS END

// DATA

// DATA END



const isLoggedInAddRoute = () => {
  router.push("/sort/add-sort");
};

const initCamera = async () => {
      this.videoPlayer = this.$refs.videoPlayer;
      this.canvas = this.$refs.canvas;
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.videoPlayer.srcObject = stream;
      this.videoPlayer.play();
}

const captureImage = () => {
      const context = this.canvas.getContext("2d");
      context.drawImage(this.videoPlayer, 0, 0, this.canvas.width, this.canvas.height);
      this.imageUrl = this.canvas.toDataURL("image/png");
}

</script>

<style lang="scss">
#favoriteRoutes {
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
