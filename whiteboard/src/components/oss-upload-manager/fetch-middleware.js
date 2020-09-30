import Fetcher from "@netless/fetch-middleware";
const fetcher = new Fetcher(5000, "https://shunt-api.netless.link/v5");

export default class TaskOperator {

  async createPPTTaskInf(pptURL, type, preview, sdkToken) {
    const json = await fetcher.post({
      path: `services/conversion/tasks`,
      headers: {
        token: sdkToken,
      },
      body: {
        resource: pptURL,
        type,
        preview,
      },
    });
    return json;
  }

  // roomToken  sdkToken
  async getCover(uuid, path, width, height, token) {
    const json = await fetcher.post({
      path: `room/${uuid}/screenshots`,
      heeaders: {
        token
      },
      body: {
        path,
        width,
        height
      }
    });
    return json;
  }

  async createTaskToken(taskUuid, lifespan, role, sdkToken) {
    const json = await fetcher.post({
      path: `tokens/tasks/${taskUuid}`,
      headers: {
        token: sdkToken
      },
      body: {
        lifespan,
        role
      }
    })
    return json
  }
}
