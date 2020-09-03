import Fetcher from "@netless/fetch-middleware";
import { netlessToken } from "../appToken";

const fetcher = new Fetcher(5000, "https://cloudcapiv4.herewhite.com");

class RoomOperator {
  async createRoomApi(name, limit, mode) {
    const json = await fetcher.post({
      path: `room`,
      query: {
        token: netlessToken.sdkToken,
      },
      body: {
        name,
        limit,
        mode,
      },
    });
    return json;
  }

  async joinRoomApi(uuid) {
    const json = await fetcher.post({
      path: `room/join`,
      query: {
        uuid,
        token: netlessToken.sdkToken,
      },
    });
    return json;
  }
}

const netlessWhiteboardApi = new (class {
  room = new RoomOperator();
})();

export { netlessWhiteboardApi, RoomOperator };
