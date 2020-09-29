<template>
  <div class="oss-upload-box">
    <el-upload>
      <div class="oss-ipload-section">
        <div class="oss-upload-section-inner">
          <div class="oss-upload-title-section">
            <div class="oss-upload-title">上传图片</div>
            <div class="oss-upload-icon">
              <img :src="image" />
            </div>
          </div>
          <div class="oss-upload-section-script">
            <div class="oss-upload-section-text">
              支持常见格式，可以改变图片大小和位置
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <div :style="{ width: 208, height: 0.5, backgroundColor: '#E7E7E7' }" />
    <el-upload>
      <div class="oss-upload-section">
        <div class="oss-upload-section-inner">
          <div class="oss-upload-title-section">
            <div class="oss-upload-title">上传视频</div>
            <div class="oss-upload-icon">
              <img :src="Video" />
            </div>
          </div>
          <div class="oss-upload-section-script">
            <div class="oss-upload-section-text">
              支持 MP4 格式
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <el-upload>
      <div class="oss-upload-section">
        <div class="oss-upload-section-inner">
          <div class="oss-upload-title-section">
            <div class="oss-upload-title">上传视频</div>
            <div class="oss-upload-icon">
              <img :src="Video" />
            </div>
          </div>
          <div class="oss-upload-section-script">
            <div class="oss-upload-section-text">
              支持 MP4 格式
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <el-upload>
      <div class="oss-upload-section">
        <div class="oss-upload-section-inner">
          <div class="oss-upload-title-section">
            <div class="oss-upload-title">上传视频</div>
            <div class="oss-upload-icon">
              <img :src="Video" />
            </div>
          </div>
          <div class="oss-upload-section-script">
            <div class="oss-upload-section-text">
              支持 MP4 格式
            </div>
          </div>
        </div>
      </div>
    </el-upload>
    <el-upload>
  </div>
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
      Audio
    };
  },

  methods: {},

  mounted() {}
};
</script>

<style lang="less">
@import "./OssUploadButton.less";
</style>