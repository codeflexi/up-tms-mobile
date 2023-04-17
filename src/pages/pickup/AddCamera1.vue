// some Vue file
// remember this is simply an example;
// only look at how we use the API described in the plugin's page;
// the rest of things here are of no importance

<template>
  <div>
    <q-btn color="primary" label="Get Picture" @click="captureImage" />
    <img height="20"  :src="imageSrc" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Camera, CameraResultType } from "@capacitor/camera";

const imageSrc = ref("");

async function captureImage() {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri,
  });
  // The result will vary on the value of the resultType option.
  // CameraResultType.Uri - Get the result from image.webPath
  // CameraResultType.Base64 - Get the result from image.base64String
  // CameraResultType.DataUrl - Get the result from image.dataUrl
  imageSrc.value = image.webPath;
}
</script>
