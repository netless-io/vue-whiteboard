import {
  AnimationMode,
  ApplianceNames,
  createPPTTask,
  PPTKind,
} from "white-web-sdk";
import { v4 as uuidv4 } from "uuid";
// import { MultipartUploadResult } from "ali-oss";
import TaskOperator from "./fetch-middleware";
import default_cover from "./src/image/default_cover.svg";

export class PPTProgressPhase {
  Uploading;
  Converting;
  Stop;
}

export class PPTType {
  dynamic = "dynamic";
  static = "static";
  init = "init";
}

export class UploadManager {
  task = new TaskOperator();

  constructor(ossClient, room) {
    this.ossClient = ossClient;
    this.room = room;
  }

  getFileType = (fileName) => {
    const index1 = fileName.lastIndexOf(".");
    const index2 = fileName.length;
    return fileName.substring(index1, index2);
  };

  async convertFile(
    rawFile,
    pptConverter,
    kind,
    folder,
    uuid,
    sdkToken,
    onProgress
  ) {
    const fileType = this.getFileType(rawFile.name);
    const path = `/${folder}/${uuid}${fileType}`;
    const pptURL = await this.addFile(path, rawFile, onProgress);
    let res;
    if (kind === PPTKind.Static) {
      try {
        res = await pptConverter.convert({
          url: pptURL,
          kind: kind,
          onProgressUpdated: (process) => {
            if (onProgress) {
              onProgress(PPTProgressPhase.Converting, process);
            }
          },
        });
        await this.setUpScenes(res.scenes, uuid, PPTType.static, sdkToken);
        if (onProgress) {
          onProgress(PPTProgressPhase.Stop, 1);
        }
      } catch (error) {
        if (onProgress) {
          onProgress(PPTProgressPhase.Stop, 1);
        }
      }
    } else {
      const taskInf = await this.task.createPPTTaskInf(
        pptURL,
        "dynamic",
        true,
        sdkToken
      );
      const taskToken = await this.task.createTaskToken(
        taskInf.uuid,
        0,
        "admin",
        sdkToken
      );
      const resp = createPPTTask({
        uuid: taskInf.uuid,
        kind: PPTKind.Dynamic,
        taskToken: taskToken,
        callbacks: {
          onProgressUpdated: (progress) => {
            if (onProgress) {
              onProgress(
                PPTProgressPhase.Converting,
                progress.convertedPercentage
              );
            }
          },
          onTaskFail: () => {
            if (onProgress) {
              onProgress(PPTProgressPhase.Stop, 1);
            }
          },
          onTaskSuccess: () => {
            if (onProgress) {
              onProgress(PPTProgressPhase.Stop, 1);
            }
          },
        },
      });
      const ppt = await resp.checkUtilGet();
      await this.setUpScenes(
        ppt.scenes,
        uuid,
        PPTType.dynamic,
        sdkToken,
        taskInf.uuid
      );
    }
  }

  setUpScenes = async (scenes, uuid, type, sdkToken, taskUuid) => {
    const sceneId = `${uuidv4()}`;
    this.room.putScenes(`/${uuid}/${sceneId}`, scenes);
    this.room.setScenePath(`/${uuid}/${sceneId}/${scenes[0].name}`);
    let res;
    try {
      res = await this.task.getCover(
        uuid,
        `/${uuid}/${sceneId}/${scenes[0].name}`,
        192,
        144,
        sdkToken
      );
    } catch (error) {
      res = undefined;
    }

    const documentFile = {
      active: true,
      id: sceneId,
      pptType: type,
      data: scenes,
      cover: res ? res.url : default_cover,
      zipUrl:
        taskUuid &&
        `https://convertcdn.netless.link/${
          type === PPTType.dynamic ? "dynamicConvert" : "staticConvert"
        }/${taskUuid}.zip`,
    };
    const docs = this.room.state.globalState.docs;
    if (docs && docs.length > 0) {
      const oldDocs = docs.map((data) => {
        data.active = false;
        return data;
      });
      const newDocs = [...oldDocs, documentFile];
      this.room.setGlobalState({ docs: newDocs });
    }
    this.pptAutoFullScreen(this.room);
  };

  pptAutoFullScreen = (room) => {
    const scene = room.state.sceneState.scenes[room.state.sceneState.index];
    if (scene && scene.ppt) {
      const width = scene.ppt.width;
      const height = scene.ppt.height;
      room.moveCameraToContain({
        originX: -width / 2,
        originY: -height / 2,
        width: width,
        height: height,
        animationMode: AnimationMode.Immediately,
      });
    }
  };
  getImageSize = (imageInnerSize) => {
    const windowSize = { width: window.innerWidth, height: window.innerHeight };
    const widthHeightProportion = imageInnerSize.width / imageInnerSize.height;
    const maxSize = 960;
    if (
      (imageInnerSize.width > maxSize && windowSize.width > maxSize) ||
      (imageInnerSize.height > maxSize && windowSize.height > maxSize)
    ) {
      if (widthHeightProportion > 1) {
        return {
          width: maxSize,
          height: maxSize / widthHeightProportion,
        };
      } else {
        return {
          width: maxSize * widthHeightProportion,
          height: maxSize,
        };
      }
    } else {
      if (
        imageInnerSize.width > windowSize.width ||
        imageInnerSize.height > windowSize.height
      ) {
        if (widthHeightProportion > 1) {
          return {
            width: windowSize.width,
            height: windowSize.width / widthHeightProportion,
          };
        } else {
          return {
            width: windowSize.height * widthHeightProportion,
            height: windowSize.height,
          };
        }
      } else {
        return {
          width: imageInnerSize.width,
          height: imageInnerSize.height,
        };
      }
    }
  };

  async uploadImageFiles(imageFiles, x, y, onProgress) {
    const newAcceptedFilePromises = imageFiles.map((file) =>
      this.fetchWhiteImageFileWith(file, x, y)
    );
    const newAcceptedFiles = await Promise.all(newAcceptedFilePromises);
    await this.uploadImageFilesArray(newAcceptedFiles, onProgress);
  }

  fetchWhiteImageFileWith(file, x, y) {
    return new Promise((resolve) => {
      const image = new Image();
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        image.src = reader.result;
        image.onload = async () => {
          const res = this.getImageSize(image);
          const imageFile = {
            width: res.width,
            height: res.height,
            file: file,
            coordinateX: x,
            coordinateY: y,
          };
          resolve(imageFile);
        };
      };
    });
  }

  async uploadImageFilesArray(imageFiles, onProgress) {
    if (imageFiles.length > 0) {
      const tasks = imageFiles.map((imageFile) => {
        return {
          uuid: uuidv4(),
          imageFile: imageFile,
        };
      });
      for (const { uuid, imageFile } of tasks) {
        const { x, y } = this.room.convertToPointInWorld({
          x: imageFile.coordinateX,
          y: imageFile.coordinateY,
        });
        this.room.insertImage({
          uuid: uuid,
          centerX: x,
          centerY: y,
          width: imageFile.width,
          height: imageFile.height,
          locked: false,
        });
      }
      await Promise.all(
        tasks.map((task) => this.handleUploadTask(task, onProgress))
      );
      this.room.setMemberState({
        currentApplianceName: ApplianceNames.selector,
      });
    }
  }

  async handleUploadTask(task, onProgress) {
    const fileUrl = await this.addFile(
      `${task.uuid}${task.imageFile.file.name}`,
      task.imageFile.file,
      onProgress
    );
    this.room.completeImageUpload(task.uuid, fileUrl);
  }

  getFile = (name) => {
    return this.ossClient.generateObjectUrl(name);
  };

  addFile = async (path, rawFile, onProgress) => {
    const res = await this.ossClient.multipartUpload(path, rawFile, {
      progress: (p) => {
        if (onProgress) {
          onProgress(PPTProgressPhase.Uploading, p);
        }
      },
    });
    if (onProgress) {
      onProgress(PPTProgressPhase.Stop, 1);
    }
    if (res.res.status === 200) {
      return this.getFile(path);
    } else {
      throw new Error(`upload to ali oss error, status is ${res.res.status}`);
    }
  };
}
