<template>
  <q-page padding>
    <p class="text-h6">Camera</p>
    <div class="row">
      <div class="col-12 text-center">
        <video autoplay width="250rem" ref="videoplay"></video>
        <canvas ref="canvas" style="display: none"></canvas>
        <q-img :src="imageUrl" style="height: 320px; max-width: 300px" />
      </div>
      <div class="col-12 text-center">
        <q-btn
          v-if="!cameraStart"
          label="Turn on Camera"
          color="primary"
          icon="camera"
          :disable="!enableCamera"
          @click="useCamera"
        />
        <q-btn
          v-else
          label="Take Photo"
          color="primary"
          icon="camera"
          @click="takePhoto"
        />
        <q-btn
          v-if="imageUrl"
          label="SAVE PHOTO"
          color="black"
          icon="save"
          class="q-mt-lg"
        />
      </div>
      <div class="col-12 text-center">
        <img src="" ref="imgTakePhoto" width="250rem" height="250rem" />
      </div>
    </div>
  </q-page>
</template>
  
  <script>
export default {
  name: "PageCamera",
  data() {
    return {
      enableCamera: false,
      cameraStart: false,
      imageCapture: null,
      track: null,
      canvas: null,
      imageUrl: null,
    };
  },
  mounted() {
    this.enableCamera = true;
    if (navigator.mediaDevices.getUserMedia) {
      this.enableCamera = true;
    }
  },
  methods: {
    useCamera() {
      try {
        if (navigator.mediaDevices) {
          const stream = navigator.mediaDevices.getUserMedia({
            video: {
              width: { max: 320 },
              height: { max: 800 },
              aspecRatio: { ideal: 1 },
            },
          });
          this.mediaStream = stream;
          const video = this.$refs.videoplay;
          video.play();
        }
      } catch (error) {
        console.error(error);
      }
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((mediaStream) => {
          this.cameraStart = true;
          this.$refs.videoplay.srcObject = mediaStream;
          this.track = mediaStream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(this.track);
        });
    },
    takePhoto() {
      this.imageCapture
        .takePhoto()
        .then((blob) => {
          const video = this.$refs.videoplay;
          const canvas = this.$refs.canvas;
          const ctx = canvas.getContext("2d");
          const width = video.videoWidth;
          const height = video.videoHeight;
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(video, 0, 0, width, height);
          createImageBitmap(blob);
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            this.$refs.imgTakePhoto.src = reader.result;
            this.imageUrl = reader.result;
            if (reader.result) {
              console.log(reader.result);
            }
          };
        })
        .catch((error) => console.log(error));
    },
  },
};
</script>
  


