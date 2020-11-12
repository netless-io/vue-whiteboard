import Fetcher from "@netless/fetch-middleware";
import { netlessToken } from "../appToken";

const fetcher = new Fetcher(5000, "https://shunt-api.netless.link/v5");

class RoomOperator {
  async createRoomApi() {
    const json = await fetcher.post({
      path: `rooms`,
      headers: {
        token: netlessToken.sdkToken,
      },
      body: {
        name: "whiteboard",
        limit: 0,
      },
    });
    return json;
  }

  async joinRoomApi(uuid) {
    const json = await fetcher.post({
      path: `tokens/rooms/${uuid}`,
      headers: {
        token: netlessToken.sdkToken,
      },
      body: {
        lifespan: 0,
        role: "admin",
      },
    });
    return json;
  }
}

const netlessWhiteboardApi = new (class {
  room = new RoomOperator();
})();

export { netlessWhiteboardApi, RoomOperator };
