<template>
  <!-- TopLoadingBar from "@netless/loading-bar" -->
  <el-popver trigger="click" placement="left-bottom">
    <template v-for="item of dataArr">
      <div class="oss-upload-box" :key="item">
        <el-upload
          :key="index"
          :accept="item.accept"
          :show-file-list="false"
          :http-request="item.fun"
        >
          <div class="oss-ipload-section">
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
    <el-tooltip placement="right" title="upload">
      <div class="oss-upload-cell-box-left">
        <div class="oss-upload-cell">
          <img :src="isActive ? uploadActive : upload" alt="upload" />
        </div>
      </div>
    </el-tooltip>
  </el-popver>
</template>

<script>
import { PPTKind, Room, WhiteWebSdk } from "white-web-sdk";
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
    }
  },
  data() {
    return {
      upload,
      image,
      uploadActive,
      fileTransWeb,
      Video,
      Audio,
      ossPercent: 0,
      converterPercent: 0,
      // uploadState: PPTProgressPhase.Stop, // 后续添加
      dataArr: [
        [
          { title: "上传图片" },
          { title: "上传视频" },
          { title: "上传音频" },
          { title: "资料转网页" },
          { title: "文档转图片" }
        ],
        [
          nm,
          { img: "image" },
          { img: "Video" },
          { img: "Audio" },
          { img: "fileTransWeb" },
          { img: "fileTransImg" }
        ],
        [
          { text: "支持常见格式,可以改变图片大小和位置。" },
          { text: "支持 MP4 格式" },
          { text: "支持 MP3 格式" },
          { text: "支持 pptx 格式，如果是 ppt 格式，请手动转换。" },
          { text: "支持 ppt、pptx、word and pdf 格式" }
        ],
        [
          { accept: "image/*" },
          { accept: "video/mp4" },
          { accept: "audio/mp3" },
          {
            accept:
              "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          },
          {
            accept:
              "application/pdf, " +
              "application/vnd.openxmlformats-officedocument.presentationml.presentation, " +
              "application/vnd.ms-powerpoint, " +
              "application/msword, " +
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          },
          [
            { fun: "uploadImage" },
            { fun: "uploadVideo" },
            { fun: "uploadAudio" },
            { fun: "uploadDynamic" },
            { fun: "uploadStatic" }
          ]
        ]
      ]
    };
  },
  methods: {
    uploadStatic() {}
  },

  mounted() {}
};
</script>

<style lang="less">
@import "./OssUploadButton.less";
</style>