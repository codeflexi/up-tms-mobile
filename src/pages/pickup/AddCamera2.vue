<template>
  <q-page padding>
    <p class="text-h6">Camera</p>
    <div class="row">
      <div v-if="isOpenCamera" class="col-12 text-center">
        <video v-if="!isNewPhoto" ref="video" class="aspect-square"></video>
      </div>
      <div class="col-12 text-center">
        <q-btn
          v-if="!isOpenCamera"
          label="Turn on Camera"
          color="primary"
          icon="camera"
          @click="startCamera"
        />
        <q-btn
          v-else
          label="Take Photo"
          color="primary"
          icon="camera"
          @click="takePhoto"
        />
      </div>
      <div class="col-12 text-center">
        <q-img :src="imageCapture" style="height: 320px; max-width: 300px" />
        <img src="" ref="imgTakePhoto" width="250rem" />

        <q-btn
          v-if="imageCapture"
          label="SAVE PHOTO"
          color="black"
          icon="save"
          class="q-mt-lg"
        />
      </div>
    </div>
  </q-page>
</template>
  
<script setup>
import { onMounted, computed, toRefs, ref, reactive } from "vue";
// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template

const emit = defineEmits(["close", "data"]);
const props = defineProps({
  linkId: { type: Number, required: false },
});
const { LinkId } = toRefs(props);
const file = ref(null);
const video = ref(null);
const canvas = ref(null);
const isNewPhoto = ref(null);
const isOpenCamera = ref(null);
const photoData = ref(null);
const uploadedImage = ref(null);
const isTakingPhoto = ref(false);
const myContext = ref(null);
const imageCapture = ref(null);
const imgTakePhoto = ref(null);
const track = ref(null);

const size = reactive({
  w: 200,
  h: 200,
});

const geUploadedImage = (e) => {};
const startCamera = async () => {
  isOpenCamera.value = true;
  imageCapture.value = null;

  if (navigator.mediaDevices) {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { max: 320 },
        height: { max: 400 },
        aspecRatio: { ideal: 1 },
      },
    });
    video.value.srcObject = stream;
    video.value.play();
    track.value = stream.getVideoTracks()[0];
    imageCapture.value = new window.ImageCapture(track.value);

    // return imageCapture.value.takePhoto().then((blob) => {
    //   console.log(blob);
    // });
  }
};

onMounted(() => {
  startCamera();
});

const takePhoto = () => {
  imageCapture.value
    .takePhoto()
    .then((blob) => {
      createImageBitmap(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        // imgTakePhoto.value.src = reader.result;
        imageCapture.value = reader.result;
        if (reader.result) {
          console.log(reader.result);
          isOpenCamera.value = false;
        }
      };
    })
    .catch((error) => console.log(error));
};

const convertBlobToUrl = async () => {
  const blob = await (await fetch(photoData.value)).blob();
  file.value = new File([blob], "NEW_PHOTO.png", { type: blob.type });
  uploadedImage.value = URL.createObjectURL(file.value);
  isOpenCamera.value = false;
};
</script>

