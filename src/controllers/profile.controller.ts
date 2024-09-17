import { RequestHandler } from "express"
import { OK } from "~/core/success.response"
// ----------- MOCK DATA ----------- //
const profiles = [
  {
    userId: 1,
    userName: "CR7",
    userAvatar: "test1"
  },
  {
    userId: 2,
    userName: "M10",
    userAvatar: "test2"
  },
  {
    userId: 3,
    userName: "LHT",
    userAvatar: "test3"
  }
]
// ----------- END OF MOCK DATA ----------- //

export class ProfileController {
  static getProfiles: RequestHandler = async (_, res) => {
    new OK({
      message: "Get Profiles Success",
      metadata: { data: profiles }
    }).send(res)
  }

  static getProfile: RequestHandler = async (_, res) => {
    new OK({
      message: "Get Profile Success",
      metadata: { data: profiles[2] }
    }).send(res)
  }
}
