<template>
  <!-- TopLoadingBar from "@netless/loading-bar" -->
  <el-popover trigger="click" placement="right">
    <template v-for="item in dataArr">
      <div class="oss-upload-box" :key="item.value">
        <el-upload
          action=""
          :http-request="item.method"
          :accept="item.accept"
          :show-file-list="false"
        >
          <div class="oss-upload-section">
            <div class="oss-upload-section-inner">
              <div class="oss-upload-title-section">
                <div class="oss-upload-title">{{ item.title }}</div>
                <div class="oss-upload-icon">
                  <img :src="item.img" />
                </div>
              </div>
              <div class="oss-upload-section-script">
                <div class="oss-upload-section-text">
                  {{ item.text }}
                </div>
              </div>
            </div>
          </div>
        </el-upload>
        <div :style="{ width: 208, height: 0.5, backgroundColor: '#E7E7E7' }" />
      </div>
    </template>
    <el-tooltip
      placement="right"
      title="upload"
      slot="reference"
      content="upload"
    >
      <div class="oss-upload-cell-box-left">
        <div class="oss-upload-cell">
          <img :src="isActive ? uploadActive : upload" alt="upload" />
        </div>
      </div>
    </el-tooltip>
  </el-popover>
</template>

<script>
import { PPTKind, WhiteWebSdk } from "white-web-sdk";
import OSS from "ali-oss";
import { PPTProgressPhase, UploadManager } from "../oss-upload-manager/index";
import { v4 as uuidv4 } from "uuid";
import upload from "./src/image/upload.svg";
import image from "./src/image/image.svg";
import uploadActive from "./src/image/upload-active.svg";
import fileTransWeb from "./src/image/file-trans-web.svg";
import fileTransImg from "./src/image/file-trans-img.svg";
import Video from "./src/image/video.svg";
import Audio from "./src/image/audio.svg";

export default {
  name: "OssUploadButton",
  props: {
    room: {
      type: Object,
      require: true
    },
    oss: {
      type: Object
    },
    appIdentifier: {
      type: String
    },
    sdkToken: {
      type: String
    }
  },
  data() {
    return {
      upload,
      image,
      uploadActive,
      fileTransWeb,
      fileTransImg,
      Video,
      Audio,
      isActive: false,
      ossPercent: 0,
      converterPercent: 0,
      uploadState: PPTProgressPhase.Stop,
      client: new OSS({
        accessKeyId: this.oss.accessKeyId,
        accessKeySecret: this.oss.accessKeySecret,
        region: this.oss.region,
        bucket: this.oss.bucket
      }),
      dataArr: {
        picture: {
          title: "上传图片",
          img: image,
          text: "支持常见格式，可以改变图片大小和位置。",
          accept: "image/*",
          method: this.uploadImage
        },
        video: {
          title: "上传视频",
          img: Video,
          text: "支持 MP4 格式。",
          accept: "video/mp4",
          method: this.uploadVideo
        },
        audio: {
          title: "上传音频",
          img: Audio,
          text: "支持 MP3 格式。",
          accept: "audio/mp3",
          method: this.uploadAudio
        },
        fileTransWeb: {
          title: "资料转网页",
          img: fileTransWeb,
          text: "支持 pptx 格式，如果是 ppt 格式，请手动转换。",
          accept:
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          method: this.uploadDynamic
        },
        fileTransImg: {
          title: "文档转图片",
          img: fileTransImg,
          text: "支持 ppt、pptx、word and pdf 格式。",
          accept:
            "application/pdf, " +
            "application/vnd.openxmlformats-officedocument.presentationml.presentation, " +
            "application/vnd.ms-powerpoint, " +
            "application/msword, " +
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          method: this.uploadStatic
        }
      }
    };
  },
  methods: {
    async uploadStatic(event) {
      const { uuid, roomToken } = this.room;
      const uploadManager = new UploadManager(this.client, this.room);
      const whiteWebSdk = new WhiteWebSdk({
        appIdentifier: this.appIdentifier
      });
      const pptConverter = whiteWebSdk.pptConverter(roomToken);
      try {
        await uploadManager.convertFile(
          event.file,
          pptConverter,
          PPTKind.Static,
          this.oss.folder,
          uuid,
          this.sdkToken,
          this.progress
        );
      } catch (error) {
        this.$message(error);
      }
    },

    async uploadDynamic(event) {
      const { uuid, roomToken } = this.room;
      const uploadManager = new UploadManager(this.client, this.room);
      const whiteWebSdk = new WhiteWebSdk({
        appIdentifier: this.appIdentifier
      });
      const pptConverter = whiteWebSdk.pptConverter(roomToken);
      try {
        await uploadManager.convertFile(
          event.file,
          pptConverter,
          PPTKind.Dynamic,
          this.oss.folder,
          uuid,
          this.sdkToken,
          this.progress
        );
      } catch (error) {
        this.$message(error);
      }
    },

    async uploadImage(event) {
      const uploadFileArray = [];
      uploadFileArray.push(event.file);
      const uploadManager = new UploadManager(this.client, this.room);
      try {
        if (this.$parent.$refs.bindRoom) {
          const { clientWidth, clientHeight } = this.$parent.$refs.bindRoom;
          await uploadManager.uploadImageFiles(
            uploadFileArray,
            clientWidth / 2,
            clientHeight / 2,
            this.progress
          );
          console.log("图片上传成功");
        }
      } catch (error) {
        this.$message(error);
      }
    },

    async getUrl(event) {
      const uploadManager = new UploadManager(this.client, this.room);
      const res = await uploadManager.addFile(
        `${uuidv4()}/${event.file.name}`,
        event.file,
        this.progress
      );
      const isHttps = res.indexOf("https") !== -1;
      let url;
      if (isHttps) {
        url = res;
      } else {
        url = res.replace("http", "https");
      }
      return url;
    },

    async uploadVideo(event) {
      try {
        const url = await this.getUrl(event);
        if (url) {
          this.room.insertPlugin("video", {
            originX: -240,
            originY: -135,
            width: 480,
            height: 270,
            attributes: {
              pluginVideoUrl: url
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    },

    async uploadAudio(event) {
      try {
        const url = await this.getUrl(event);
        if (url) {
          this.room.insertPlugin("audio", {
            originX: -240,
            originY: -43,
            width: 480,
            height: 86,
            attributes: {
              pluginAudioUrl: url
            }
          });
          console.log("上传音频成功");
        }
      } catch (error) {
        console.log(error);
      }
    },

    progress(phase, percent) {
      this.uploadState = phase;
      switch (phase) {
        case PPTProgressPhase.Uploading: {
          this.ossPercent = percent * 100;
          break;
        }
        case PPTProgressPhase.Converting: {
          this.converterPercent = percent * 100;
          break;
        }
        case PPTProgressPhase.Stop: {
          this.converterPercent = 0;
          this.ossPercent = 0;
        }
      }
    }
  },

  updated(prevState) {
    // this.$watch(expOrFn, callback, [options])
    if (this.uploadState !== prevState.uploadState) {
      if (this.uploadState === PPTProgressPhase.Uploading) {
        this.$message({
          message: "正在上传",
          iconClass: "el-icon-loading"
        });
      } else if (this.uploadState === PPTProgressPhase.Converting) {
        this.message({
          message: "正在转码",
          iconClass: "el-icon-loading"
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "./OssUploadButton.less";
</style>
