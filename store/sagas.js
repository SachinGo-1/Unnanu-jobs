import { all } from "redux-saga/effects";

import postSagas from "store/posts/sagas";
import postsAppSagas from "store/app/sagas";

export default function* rootSaga(services = {}) {
  yield all([postSagas(), postsAppSagas()]);
}
