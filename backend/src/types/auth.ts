import { UserType } from "./UserType";

export type JWTUserPayload = {
  id: string;
  email: string;
  type: UserType;
};
