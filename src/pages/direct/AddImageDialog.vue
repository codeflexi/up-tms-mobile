<template>
  <q-dialog
    v-model="dialogComputed"
    id="imageInfo"
    persistent
    :maximized="true"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card class="text-white card-bg-color">
      <q-toolbar class="bg-red">
        <q-icon name="photo_camera" dense size="40px" color="yellow"></q-icon>
        <q-toolbar-title class="q-pl-xs">ถ่ายรูป</q-toolbar-title>
        <q-space />
        <q-btn
          class=""
          dense
          flat
          size="md"
          icon="close"
          @click="stopCamera"
          v-close-popup
        >
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-scroll-area class="main">
        <q-list class="q-mt-lg">
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 q-pl-sm">
                <div class="row">
                  <div v-if="isOpenCamera" class="col-12 text-center">
                    <video ref="video" class="aspect-square"></video>
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
                    <q-img
                      :src="imageCapture"
                      style="height: 320px; max-width: 300px"
                    />
                    <img src="" ref="imgTakePhoto" width="250rem" />

                    <q-btn
                      v-if="isNewPhoto"
                      label="SAVE PHOTO"
                      color="black"
                      icon="save"
                      class="q-mt-lg"
                      @click="saveImage"
                      v-close-popup
                    />
                  </div>
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced inset />
        </q-list>
      </q-scroll-area>
    </q-card>
  </q-dialog>
</template>
  
<script setup>
import { onMounted, onUnmounted, computed, toRefs, ref, reactive } from "vue";
// The important part: the name of the variable needs to be equal to the ref's name of the canvas element in the template
const emit = defineEmits(["update:dialog", "imgReturn"]);

// PROPS
const props = defineProps({
  dialog: Boolean,
  clickedLocation: Object,
  via: Array,
});

const { clickedLocation, dialog, via } = toRefs(props);
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

// PROPS END

onUnmounted(() => {
  //   video.value.pause();
  //   video.value.currentTime = 0;
});
// beforeDestroy(() => {
//   video.value.destroy();
// });

const saveImage = () => {
  dialogComputed.value = true;
  stopCamera();
  setTimeout(() => {
    emit("imgReturn", imageCapture.value);
  }, 400);
};

// COMPUTED
const dialogComputed = computed({
  get: () => dialog.value,
  set: (val) => emit("update:dialog", false),
});

const startCamera = async () => {
  isOpenCamera.value = true;

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

const stopCamera = async () => {
  if (isOpenCamera.value) {
    track.value.stop();
  }
};

const takePhoto = () => {
  imageCapture.value
    .takePhoto()
    .then((blob) => {
      createImageBitmap(blob);
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        imageCapture.value = reader.result;
        if (reader.result) {
          console.log(reader.result);
          isNewPhoto.value = true;
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


  
  <style lang="scss">
#imageInfo {
  .main {
    height: calc(100vh - 50px);
    margin-top: 30px;
    max-width: 500px;
    margin: 0 auto;
  }

  .row {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .card-bg-color {
    background-color: rgba(0, 0, 0, 0.8) !important;
  }

  .addressSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .connectionTypeSection {
    font-size: 16px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .companySection {
    padding: 5px 0 5px 8px;
    padding-right: 5px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .addressSection {
    padding-right: 5px;
    font-size: 16px;
    line-height: 25px;
    color: rgb(184, 184, 184);
  }

  .isAvailableClass {
    color: #ffffff;
    background-color: $green-14;
    border-radius: 5px;
    padding: 0 10px 0 10px;
  }

  .isNotAvailableClass {
    color: #ffffff;
    background-color: $red-14;
    border-radius: 5px;
    padding: 0 10px 0 10px;
  }

  .green {
    color: rgba(33, 205, 33, 0.865);
  }

  .red {
    color: rgba(218, 51, 51, 0.865);
  }
}
</style>
  
