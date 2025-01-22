import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

import appReducer from "./slices/app";
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import chatReducer from "./slices/chat";
import requestReducer from "./slices/request";

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  blacklist: ["app", "chat"],
  whitelist: ["auth", "user", "request"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  app: appReducer,
  user: userReducer,
  chat: chatReducer,
  request: requestReducer,
});

export { rootReducer, rootPersistConfig };
