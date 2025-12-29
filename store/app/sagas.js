import { takeLatest, fork, call, put } from "redux-saga/effects";
import { clearToken } from "store/localStorage";
import { destroyCookie } from "nookies"; // Replace Cookies import

import api from "services/api";
import {
  FETCH_USER_PROFILE_REQUEST,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAIL,
  SIGN_OUT,
  SIGN_OUT_SUCCESS,
  SIGN_OUT_FAIL,
  FETCH_POPULAR_JOBS_REQUEST,
  FETCH_POPULAR_JOBS_SUCCESS,
  FETCH_POPULAR_JOBS_FAIL,
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAIL,
  FETCH_SAVED_JOBS_REQUEST,
  FETCH_SAVED_JOBS_SUCCESS,
  FETCH_SAVED_JOBS_FAIL,
  FETCH_SAVED_JOBS_LIST_REQUEST,
  FETCH_SAVED_JOBS_LIST_SUCCESS,
  FETCH_SAVED_JOBS_LIST_FAIL,
  FETCH_SAVED_X_JOBS_REQUEST,
  FETCH_SAVED_X_JOBS_SUCCESS,
  FETCH_SAVED_X_JOBS_FAIL,
  FETCH_SAVED_INDEED_JOBS_REQUEST,
  FETCH_SAVED_INDEED_JOBS_SUCCESS,
  FETCH_SAVED_INDEED_JOBS_FAIL,
  FETCH_SAVED_LINKEDIN_JOBS_REQUEST,
  FETCH_SAVED_LINKEDIN_JOBS_SUCCESS,
  FETCH_SAVED_LINKEDIN_JOBS_FAIL,
  FETCH_SAVED_GOOGLE_JOBS_REQUEST,
  FETCH_SAVED_GOOGLE_JOBS_SUCCESS,
  FETCH_SAVED_GOOGLE_JOBS_FAIL,
  FETCH_SAVED_GLASSDOOR_JOBS_REQUEST,
  FETCH_SAVED_GLASSDOOR_JOBS_SUCCESS,
  FETCH_SAVED_GLASSDOOR_JOBS_FAIL,
  FETCH_SAVED_ZIPRECRUITER_JOBS_REQUEST,
  FETCH_SAVED_ZIPRECRUITER_JOBS_SUCCESS,
  FETCH_SAVED_ZIPRECRUITER_JOBS_FAIL,
  SAVE_JOB_REQUEST,
  SAVE_JOB_SUCCESS,
  SAVE_JOB_FAIL,
  REMOVE_JOB_REQUEST,
  REMOVE_JOB_SUCCESS,
  REMOVE_JOB_FAIL,
  FETCH_APPLIED_JOBS_REQUEST,
  FETCH_APPLIED_JOBS_SUCCESS,
  FETCH_APPLIED_JOBS_FAIL,
  FETCH_UNNANU_JOBS_REQUEST,
  FETCH_UNNANU_JOBS_SUCCESS,
  FETCH_UNNANU_JOBS_FAIL,
  WITHDRAW_UNNANU_JOB_REQUEST,
  WITHDRAW_UNNANU_JOB_SUCCESS,
  WITHDRAW_UNNANU_JOB_FAIL,
  // X imports
  FETCH_X_JOBS_REQUEST,
  FETCH_X_JOBS_SUCCESS,
  FETCH_X_JOBS_FAIL,
  SAVE_X_JOB_REQUEST,
  SAVE_X_JOB_SUCCESS,
  SAVE_X_JOB_FAIL,
  REMOVE_SAVE_X_JOB_REQUEST,
  REMOVE_SAVE_X_JOB_SUCCESS,
  REMOVE_SAVE_X_JOB_FAIL,
  IN_PROCESS_X_JOB_REQUEST,
  IN_PROCESS_X_JOB_SUCCESS,
  IN_PROCESS_X_JOB_FAIL,
  APPLY_X_JOB_REQUEST,
  APPLY_X_JOB_SUCCESS,
  APPLY_X_JOB_FAIL,
  WITHDRAW_X_JOB_REQUEST,
  WITHDRAW_X_JOB_SUCCESS,
  WITHDRAW_X_JOB_FAIL,
  FETCH_APPLIED_X_JOBS_REQUEST,
  FETCH_APPLIED_X_JOBS_SUCCESS,
  FETCH_APPLIED_X_JOBS_FAIL,
  // Indeed imports
  FETCH_INDEED_JOBS_REQUEST,
  FETCH_INDEED_JOBS_SUCCESS,
  FETCH_INDEED_JOBS_FAIL,
  SAVE_INDEED_JOB_REQUEST,
  SAVE_INDEED_JOB_SUCCESS,
  SAVE_INDEED_JOB_FAIL,
  REMOVE_SAVE_INDEED_JOB_REQUEST,
  REMOVE_SAVE_INDEED_JOB_SUCCESS,
  REMOVE_SAVE_INDEED_JOB_FAIL,
  IN_PROCESS_INDEED_JOB_REQUEST,
  IN_PROCESS_INDEED_JOB_SUCCESS,
  IN_PROCESS_INDEED_JOB_FAIL,
  APPLY_INDEED_JOB_REQUEST,
  APPLY_INDEED_JOB_SUCCESS,
  APPLY_INDEED_JOB_FAIL,
  WITHDRAW_INDEED_JOB_REQUEST,
  WITHDRAW_INDEED_JOB_SUCCESS,
  WITHDRAW_INDEED_JOB_FAIL,
  FETCH_APPLIED_INDEED_JOBS_REQUEST,
  FETCH_APPLIED_INDEED_JOBS_SUCCESS,
  FETCH_APPLIED_INDEED_JOBS_FAIL,
  // Google imports
  FETCH_GOOGLE_JOBS_REQUEST,
  FETCH_GOOGLE_JOBS_SUCCESS,
  FETCH_GOOGLE_JOBS_FAIL,
  SAVE_GOOGLE_JOB_REQUEST,
  SAVE_GOOGLE_JOB_SUCCESS,
  SAVE_GOOGLE_JOB_FAIL,
  IN_PROCESS_GOOGLE_JOB_REQUEST,
  IN_PROCESS_GOOGLE_JOB_SUCCESS,
  IN_PROCESS_GOOGLE_JOB_FAIL,
  APPLY_GOOGLE_JOB_REQUEST,
  APPLY_GOOGLE_JOB_SUCCESS,
  APPLY_GOOGLE_JOB_FAIL,
  REMOVE_SAVE_GOOGLE_JOB_REQUEST,
  REMOVE_SAVE_GOOGLE_JOB_SUCCESS,
  REMOVE_SAVE_GOOGLE_JOB_FAIL,
  WITHDRAW_GOOGLE_JOB_REQUEST,
  WITHDRAW_GOOGLE_JOB_SUCCESS,
  WITHDRAW_GOOGLE_JOB_FAIL,
  FETCH_APPLIED_GOOGLE_JOBS_REQUEST,
  FETCH_APPLIED_GOOGLE_JOBS_SUCCESS,
  FETCH_APPLIED_GOOGLE_JOBS_FAIL,
  // Linkedin imports
  FETCH_LINKEDIN_JOBS_REQUEST,
  FETCH_LINKEDIN_JOBS_SUCCESS,
  FETCH_LINKEDIN_JOBS_FAIL,
  SAVE_LINKEDIN_JOB_REQUEST,
  SAVE_LINKEDIN_JOB_SUCCESS,
  SAVE_LINKEDIN_JOB_FAIL,
  IN_PROCESS_LINKEDIN_JOB_REQUEST,
  IN_PROCESS_LINKEDIN_JOB_SUCCESS,
  IN_PROCESS_LINKEDIN_JOB_FAIL,
  APPLY_LINKEDIN_JOB_REQUEST,
  APPLY_LINKEDIN_JOB_SUCCESS,
  APPLY_LINKEDIN_JOB_FAIL,
  REMOVE_SAVE_LINKEDIN_JOB_REQUEST,
  REMOVE_SAVE_LINKEDIN_JOB_SUCCESS,
  REMOVE_SAVE_LINKEDIN_JOB_FAIL,
  WITHDRAW_LINKEDIN_JOB_REQUEST,
  WITHDRAW_LINKEDIN_JOB_SUCCESS,
  WITHDRAW_LINKEDIN_JOB_FAIL,
  FETCH_APPLIED_LINKEDIN_JOBS_REQUEST,
  FETCH_APPLIED_LINKEDIN_JOBS_SUCCESS,
  FETCH_APPLIED_LINKEDIN_JOBS_FAIL,
  // Glassdoor imports
  FETCH_GLASSDOOR_JOBS_REQUEST,
  FETCH_GLASSDOOR_JOBS_SUCCESS,
  FETCH_GLASSDOOR_JOBS_FAIL,
  SAVE_GLASSDOOR_JOB_REQUEST,
  SAVE_GLASSDOOR_JOB_SUCCESS,
  SAVE_GLASSDOOR_JOB_FAIL,
  IN_PROCESS_GLASSDOOR_JOB_REQUEST,
  IN_PROCESS_GLASSDOOR_JOB_SUCCESS,
  IN_PROCESS_GLASSDOOR_JOB_FAIL,
  APPLY_GLASSDOOR_JOB_REQUEST,
  APPLY_GLASSDOOR_JOB_SUCCESS,
  APPLY_GLASSDOOR_JOB_FAIL,
  REMOVE_SAVE_GLASSDOOR_JOB_REQUEST,
  REMOVE_SAVE_GLASSDOOR_JOB_SUCCESS,
  REMOVE_SAVE_GLASSDOOR_JOB_FAIL,
  WITHDRAW_GLASSDOOR_JOB_REQUEST,
  WITHDRAW_GLASSDOOR_JOB_SUCCESS,
  WITHDRAW_GLASSDOOR_JOB_FAIL,
  FETCH_APPLIED_GLASSDOOR_JOBS_REQUEST,
  FETCH_APPLIED_GLASSDOOR_JOBS_SUCCESS,
  FETCH_APPLIED_GLASSDOOR_JOBS_FAIL,
  // Ziprecruiter imports
  FETCH_ZIPRECRUITER_JOBS_REQUEST,
  FETCH_ZIPRECRUITER_JOBS_SUCCESS,
  FETCH_ZIPRECRUITER_JOBS_FAIL,
  SAVE_ZIPRECRUITER_JOB_REQUEST,
  SAVE_ZIPRECRUITER_JOB_SUCCESS,
  SAVE_ZIPRECRUITER_JOB_FAIL,
  IN_PROCESS_ZIPRECRUITER_JOB_REQUEST,
  IN_PROCESS_ZIPRECRUITER_JOB_SUCCESS,
  IN_PROCESS_ZIPRECRUITER_JOB_FAIL,
  APPLY_ZIPRECRUITER_JOB_REQUEST,
  APPLY_ZIPRECRUITER_JOB_SUCCESS,
  APPLY_ZIPRECRUITER_JOB_FAIL,
  REMOVE_SAVE_ZIPRECRUITER_JOB_REQUEST,
  REMOVE_SAVE_ZIPRECRUITER_JOB_SUCCESS,
  REMOVE_SAVE_ZIPRECRUITER_JOB_FAIL,
  WITHDRAW_ZIPRECRUITER_JOB_REQUEST,
  WITHDRAW_ZIPRECRUITER_JOB_SUCCESS,
  WITHDRAW_ZIPRECRUITER_JOB_FAIL,
  FETCH_APPLIED_ZIPRECRUITER_JOBS_REQUEST,
  FETCH_APPLIED_ZIPRECRUITER_JOBS_SUCCESS,
  FETCH_APPLIED_ZIPRECRUITER_JOBS_FAIL,
  DELETE_UNNANU_JOB_REQUEST,
  DELETE_UNNANU_JOB_SUCCESS,
  DELETE_UNNANU_JOB_FAIL,
  DELETE_X_JOB_REQUEST,
  DELETE_X_JOB_SUCCESS,
  DELETE_X_JOB_FAIL,
  DELETE_INDEED_JOB_REQUEST,
  DELETE_INDEED_JOB_SUCCESS,
  DELETE_INDEED_JOB_FAIL,
  DELETE_LINKEDIN_JOB_REQUEST,
  DELETE_LINKEDIN_JOB_SUCCESS,
  DELETE_LINKEDIN_JOB_FAIL,
  DELETE_GOOGLE_JOB_REQUEST,
  DELETE_GOOGLE_JOB_SUCCESS,
  DELETE_GOOGLE_JOB_FAIL,
  DELETE_GLASSDOOR_JOB_REQUEST,
  DELETE_GLASSDOOR_JOB_SUCCESS,
  DELETE_GLASSDOOR_JOB_FAIL,
  DELETE_ZIPRECRUITER_JOB_REQUEST,
  DELETE_ZIPRECRUITER_JOB_SUCCESS,
  DELETE_ZIPRECRUITER_JOB_FAIL,
  FETCH_JOB_EXTRACT_ACTIVITY_FAIL,
  FETCH_JOB_EXTRACT_ACTIVITY_REQUEST,
  FETCH_JOB_EXTRACT_ACTIVITY_SUCCESS,
  FETCH_JOBS_HEADER_COUNT_FAIL,
  FETCH_JOBS_HEADER_COUNT_REQUEST,
  FETCH_JOBS_HEADER_COUNT_SUCCESS,
  setJobLoading
} from "store/app/actions";

import { notify } from "react-notify-toast";

// Create notification queue with 500ms initial delay and 300ms increment
const notificationQueue = notify.createShowQueue(500, 300);

function* fetchUserProfile({ payload }) {
  try {
    const post = yield call(api.fetchUserProfile, payload);
    yield put({ type: FETCH_USER_PROFILE_SUCCESS, payload: post.data.Data });
  } catch (error) {
    yield put({ type: SIGN_OUT_SUCCESS });
    yield put({ type: FETCH_USER_PROFILE_FAIL, error });
  }
}

function* watchFetchUserProfile() {
  yield takeLatest(FETCH_USER_PROFILE_REQUEST, fetchUserProfile);
}

function* userSignOut({ payload }) {
  try {
    const post = yield call(api.signOutUser, payload);
    yield put({ type: SIGN_OUT_SUCCESS, payload: post.data.Data });
    clearToken();
    destroyCookie(null, "token");
    destroyCookie(null, "filters");
    notificationQueue("Successfully signed out", "success");
  } catch (error) {
    yield put({ type: SIGN_OUT_FAIL, error });
    notificationQueue("Failed to sign out", "error");
  }
}

function* watchSignOutUser() {
  yield takeLatest(SIGN_OUT, userSignOut);
}

function* fetchPopularJobs({ payload }) {
  try {
    const post = yield call(api.getPopularJobs, payload);
    yield put({ type: FETCH_POPULAR_JOBS_SUCCESS, payload: post.data.Data });
  } catch (error) {
    yield put({ type: FETCH_POPULAR_JOBS_FAIL, error });
  }
}

function* watchFetchPopularJobs() {
  yield takeLatest(FETCH_POPULAR_JOBS_REQUEST, fetchPopularJobs);
}

function* fetchNotifications({ payload }) {
  try {
    const post = yield call(api.fetchNotifications, payload);
    yield put({ type: FETCH_NOTIFICATIONS_SUCCESS, payload: post.data.Data });
  } catch (error) {
    yield put({ type: FETCH_NOTIFICATIONS_FAIL, error });
  }
}

function* watchFetchNotifications() {
  yield takeLatest(FETCH_NOTIFICATIONS_REQUEST, fetchNotifications);
}

function* fetchSavedJobs({ payload }) {
  try {
    const post = yield call(api.fetchSavedJobs, payload, "ujobs");
    yield put({ type: FETCH_SAVED_JOBS_SUCCESS, payload: post.data.Data });
  } catch (error) {
    yield put({ type: FETCH_SAVED_JOBS_FAIL, error });
  }
}

function* watchFetchSavedJobs() {
  yield takeLatest(FETCH_SAVED_JOBS_REQUEST, fetchSavedJobs);
}

function* fetchSavedJobsList({ payload }) {
  try {
    const post = yield call(api.fetchSavedJobsList, payload);
    yield put({ type: FETCH_SAVED_JOBS_LIST_SUCCESS, payload: post.data.Data });
  } catch (error) {
    yield put({ type: FETCH_SAVED_JOBS_LIST_FAIL, error });
  }
}

function* watchFetchSavedJobsList() {
  yield takeLatest(FETCH_SAVED_JOBS_LIST_REQUEST, fetchSavedJobsList);
}

function* fetchSavedXJobs({ payload }) {
  const { token, page = 0, jobCount=0 } = payload;
  try {
    yield put(setJobLoading("xSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount }, "xjobs");
    yield put({
      type: FETCH_SAVED_X_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_X_JOBS_FAIL, error });
  }
}

function* watchFetchSavedXJobs() {
  yield takeLatest(FETCH_SAVED_X_JOBS_REQUEST, fetchSavedXJobs);
}

function* fetchSavedIndeedJobs({ payload }) {
  const { token, page = 0, jobCount=0 } = payload;
  try {
    yield put(setJobLoading("indeedSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount }, "indeedjobs");
    yield put({
      type: FETCH_SAVED_INDEED_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_INDEED_JOBS_FAIL, error });
  }
}

function* watchFetchSavedIndeedJobs() {
  yield takeLatest(FETCH_SAVED_INDEED_JOBS_REQUEST, fetchSavedIndeedJobs);
}

// Add similar handlers for Linkedin, Glassdoor, Ziprecruiter

// Add saga handlers for Linkedin
function* fetchSavedLinkedinJobs({ payload }) {
  const { token, page = 0, jobCount=0 } = payload;
  try {
    yield put(setJobLoading("linkedinSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount }, "linkedinjobs");
    yield put({
      type: FETCH_SAVED_LINKEDIN_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_LINKEDIN_JOBS_FAIL, error });
  }
}

function* watchFetchSavedLinkedinJobs() {
  yield takeLatest(FETCH_SAVED_LINKEDIN_JOBS_REQUEST, fetchSavedLinkedinJobs);
}

// Add saga handlers for Google
function* fetchSavedGoogleJobs({ payload }) {
  const { token, page = 0, jobCount=0 } = payload;
  try {
    yield put(setJobLoading("googleSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount }, "googlejobs");
    yield put({
      type: FETCH_SAVED_GOOGLE_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_GOOGLE_JOBS_FAIL, error });
  }
}

function* watchFetchSavedGoogleJobs() {
  yield takeLatest(FETCH_SAVED_GOOGLE_JOBS_REQUEST, fetchSavedGoogleJobs);
}

// Add saga handlers for Glassdoor
function* fetchSavedGlassdoorJobs({ payload }) {
  const { token, page = 0, jobCount=0 } = payload;
  try {
    yield put(setJobLoading("glassdoorSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount }, "glassdoorjobs");
    yield put({
      type: FETCH_SAVED_GLASSDOOR_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_GLASSDOOR_JOBS_FAIL, error });
  }
}

function* watchFetchSavedGlassdoorJobs() {
  yield takeLatest(FETCH_SAVED_GLASSDOOR_JOBS_REQUEST, fetchSavedGlassdoorJobs);
}

// Add saga handlers for Ziprecruiter
function* fetchSavedZiprecruiterJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("ziprecruiterSaved", true));
    const post = yield call(api.fetchSavedJobs, { token, page:jobCount  }, "zip_recruiterjobs");
    yield put({
      type: FETCH_SAVED_ZIPRECRUITER_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_SAVED_ZIPRECRUITER_JOBS_FAIL, error });
  }
}

function* watchFetchSavedZiprecruiterJobs() {
  yield takeLatest(
    FETCH_SAVED_ZIPRECRUITER_JOBS_REQUEST,
    fetchSavedZiprecruiterJobs
  );
}

// Update fetch sagas to handle pagination
function* fetchUnnanuJobs({ payload }) {
  const { token, page = 0 } = payload;

  try {
    yield put(setJobLoading("unnanu", true));
    const post = yield call(api.fetchUnnanuJobs, { token, page });

    yield put({
      type: FETCH_UNNANU_JOBS_SUCCESS,
      payload: {
        data: post.data.Data,
        page
      }
    });
  } catch (error) {
    yield put({ type: FETCH_UNNANU_JOBS_FAIL, error });
  }
}

function* watchFetchUnnanuJobs() {
  yield takeLatest(FETCH_UNNANU_JOBS_REQUEST, fetchUnnanuJobs);
}

function* fetchXJobs({ payload }) {
  try {
    const { token, page = 0, jobCount } = payload;
    yield put(setJobLoading("x", true));
    const post = yield call(api.fetchExternalJobs, { token, page:jobCount }, "xjobs");
    yield put({
      type: FETCH_X_JOBS_SUCCESS,
      payload: { data: post.data.Data, page }
    });
  } catch (error) {
    yield put({ type: FETCH_X_JOBS_FAIL, error });
  }
}

function* watchFetchXJobs() {
  yield takeLatest(FETCH_X_JOBS_REQUEST, fetchXJobs);
}

function* fetchIndeedJobs({ payload }) {
  try {
    const { token, page = 0, jobCount } = payload;
    yield put(setJobLoading("indeed", true));
    const post = yield call(
      api.fetchExternalJobs,
      { token, page:jobCount },
      "indeedjobs"
    );
    yield put({
      type: FETCH_INDEED_JOBS_SUCCESS,
      payload: { data: post.data.Data, page }
    });
  } catch (error) {
    yield put({ type: FETCH_INDEED_JOBS_FAIL, error });
  }
}

function* watchFetchIndeedJobs() {
  yield takeLatest(FETCH_INDEED_JOBS_REQUEST, fetchIndeedJobs);
}

function* fetchLinkedinJobs({ payload }) {
  const { token, page = 0, jobCount } = payload;
  yield put(setJobLoading("linkedin", true));
  try {
    const post = yield call(
      api.fetchExternalJobs,
      { token, page:jobCount },
      "linkedinjobs"
    );
    yield put(setJobLoading("linkedin", true));
    yield put({
      type: FETCH_LINKEDIN_JOBS_SUCCESS,
      payload: { data: post.data.Data, page }
    });
  } catch (error) {
    yield put({ type: FETCH_LINKEDIN_JOBS_FAIL, error });
  }
}

function* watchFetchLinkedinJobs() {
  yield takeLatest(FETCH_LINKEDIN_JOBS_REQUEST, fetchLinkedinJobs);
}

function* fetchGoogleJobs({ payload }) {
  try {
    const { token, page = 0, jobCount } = payload;
    yield put(setJobLoading("google", true));
    const post = yield call(
      api.fetchExternalJobs,
      { token, page:jobCount },
      "googlejobs"
    );
    yield put({
      type: FETCH_GOOGLE_JOBS_SUCCESS,
      payload: { data: post.data.Data, page }
    });
  } catch (error) {
    yield put({ type: FETCH_GOOGLE_JOBS_FAIL, error });
  }
}

function* watchFetchGoogleJobs() {
  yield takeLatest(FETCH_GOOGLE_JOBS_REQUEST, fetchGoogleJobs);
}

function* fetchGlassdoorJobs({ payload }) {
  try {
    yield put(setJobLoading("glassdoor", true));
    const { token, page = 0, jobCount} = payload;
    const post = yield call(
      api.fetchExternalJobs,
      { token, page:jobCount },
      "glassdoorjobs"
    );
    yield put({
      type: FETCH_GLASSDOOR_JOBS_SUCCESS,
      payload: { data: post.data.Data, page }
    });
  } catch (error) {
    yield put({ type: FETCH_GLASSDOOR_JOBS_FAIL, error });
  }
}

function* watchFetchGlassdoorJobs() {
  yield takeLatest(FETCH_GLASSDOOR_JOBS_REQUEST, fetchGlassdoorJobs);
}

function* fetchZiprecruiterJobs({ payload }) {

  try {
    yield put(setJobLoading("ziprecruiter", true));
    const { token, jobCount } = payload;
    const post = yield call(
      api.fetchExternalJobs,
      { token, page:jobCount },
      "zip_recruiterjobs"
    );
    yield put({
      type: FETCH_ZIPRECRUITER_JOBS_SUCCESS,
      payload: { data: post.data.Data, page:jobCount || 0 }
    });
  } catch (error) {
    yield put({ type: FETCH_ZIPRECRUITER_JOBS_FAIL, error });
  }
}

function* watchFetchZiprecruiterJobs() {
  yield takeLatest(FETCH_ZIPRECRUITER_JOBS_REQUEST, fetchZiprecruiterJobs);
}

function* fetchSaveJob({ payload }) {
  try {
    yield call(api.saveJob, payload);
    yield put({ type: SAVE_JOB_SUCCESS, payload: payload.job });
    notificationQueue("Job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_JOB_FAIL, error });
    notificationQueue("Failed to save job", "error");
  }
}

function* watchSaveJob() {
  yield takeLatest(SAVE_JOB_REQUEST, fetchSaveJob);
}

function* saveXJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "xjobs");
    yield put({
      type: SAVE_X_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("X job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_X_JOB_FAIL, error });
    notificationQueue("Failed to save X job", "error");
  }
}

function* watchSaveXJob() {
  yield takeLatest(SAVE_X_JOB_REQUEST, saveXJob);
}

function* saveIndeedJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "indeedjobs");
    yield put({
      type: SAVE_INDEED_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Indeed job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to save Indeed job", "error");
  }
}

function* watchSaveIndeedJob() {
  yield takeLatest(SAVE_INDEED_JOB_REQUEST, saveIndeedJob);
}

function* saveLinkedinJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "linkedinjobs");
    yield put({
      type: SAVE_LINKEDIN_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Linkedin job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to save Linkedin job", "error");
  }
}

function* watchSaveLinkedinJob() {
  yield takeLatest(SAVE_LINKEDIN_JOB_REQUEST, saveLinkedinJob);
}

function* saveGoogleJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "googlejobs");
    yield put({
      type: SAVE_GOOGLE_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Google job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to save Google job", "error");
  }
}

function* watchSaveGoogleJob() {
  yield takeLatest(SAVE_GOOGLE_JOB_REQUEST, saveGoogleJob);
}

function* saveGlassdoorJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "glassdoorjobs");
    yield put({
      type: SAVE_GLASSDOOR_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Glassdoor job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to save Glassdoor job", "error");
  }
}

function* watchSaveGlassdoorJob() {
  yield takeLatest(SAVE_GLASSDOOR_JOB_REQUEST, saveGlassdoorJob);
}

function* saveZiprecruiterJob({ payload }) {
  try {
    yield call(api.saveExternalJob, payload, "zip_recruiterjobs");
    yield put({
      type: SAVE_ZIPRECRUITER_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Ziprecruiter job saved successfully!", "success");
  } catch (error) {
    yield put({ type: SAVE_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue("Failed to save Ziprecruiter job", "error");
  }
}

function* watchSaveZiprecruiterJob() {
  yield takeLatest(SAVE_ZIPRECRUITER_JOB_REQUEST, saveZiprecruiterJob);
}

function* fetchRemoveJob({ payload }) {
  try {
    yield call(api.removeJob, payload);
    yield put({ type: REMOVE_JOB_SUCCESS, payload: payload.jobId });
    notificationQueue("Job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_JOB_FAIL, error });
    notificationQueue("Failed to remove job", "error");
  }
}

function* watchRemoveJob() {
  yield takeLatest(REMOVE_JOB_REQUEST, fetchRemoveJob);
}

function* removeSaveXJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "xjobs");
    yield put({
      type: REMOVE_SAVE_X_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("X job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_X_JOB_FAIL, error });
    notificationQueue("Failed to remove X job", "error");
  }
}

function* watchRemoveSaveXJob() {
  yield takeLatest(REMOVE_SAVE_X_JOB_REQUEST, removeSaveXJob);
}

function* removeSaveIndeedJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "indeedjobs");
    yield put({
      type: REMOVE_SAVE_INDEED_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Indeed job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to remove Indeed job", "error");
  }
}

function* watchRemoveSaveIndeedJob() {
  yield takeLatest(REMOVE_SAVE_INDEED_JOB_REQUEST, removeSaveIndeedJob);
}

function* removeSaveLinkedinJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "linkedinjobs");
    yield put({
      type: REMOVE_SAVE_LINKEDIN_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Linkedin job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to remove Linkedin job", "error");
  }
}

function* watchRemoveSaveLinkedinJob() {
  yield takeLatest(REMOVE_SAVE_LINKEDIN_JOB_REQUEST, removeSaveLinkedinJob);
}

function* removeSaveGoogleJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "googlejobs");
    yield put({
      type: REMOVE_SAVE_GOOGLE_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Google job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to remove Google job", "error");
  }
}

function* watchRemoveSaveGoogleJob() {
  yield takeLatest(REMOVE_SAVE_GOOGLE_JOB_REQUEST, removeSaveGoogleJob);
}

function* removeSaveGlassdoorJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "glassdoorjobs");
    yield put({
      type: REMOVE_SAVE_GLASSDOOR_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Glassdoor job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to remove Glassdoor job", "error");
  }
}

function* watchRemoveSaveGlassdoorJob() {
  yield takeLatest(REMOVE_SAVE_GLASSDOOR_JOB_REQUEST, removeSaveGlassdoorJob);
}

function* removeSaveZiprecruiterJob({ payload }) {
  try {
    yield call(api.removeSaveExternalJob, payload, "zip_recruiterjobs");
    yield put({
      type: REMOVE_SAVE_ZIPRECRUITER_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Ziprecruiter job removed successfully!", "success");
  } catch (error) {
    yield put({ type: REMOVE_SAVE_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue("Failed to remove Ziprecruiter job", "error");
  }
}

function* watchRemoveSaveZiprecruiterJob() {
  yield takeLatest(
    REMOVE_SAVE_ZIPRECRUITER_JOB_REQUEST,
    removeSaveZiprecruiterJob
  );
}

function* inProcessXJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "xjobs");
    yield put({
      type: IN_PROCESS_X_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`X job marked as ${payload.inProgress ? 'in process': 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_X_JOB_FAIL, error });
    notificationQueue("Failed to mark X job as in process", "error");
  }
}

function* watchInProcessXJob() {
  yield takeLatest(IN_PROCESS_X_JOB_REQUEST, inProcessXJob);
}

function* applyXJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "xjobs");
    yield put({
      type: APPLY_X_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to X job!", "success");
  } catch (error) {
    yield put({ type: APPLY_X_JOB_FAIL, error });
    notificationQueue("Failed to apply to X job", "error");
  }
}

function* watchApplyXJob() {
  yield takeLatest(APPLY_X_JOB_REQUEST, applyXJob);
}

function* inProcessIndeedJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "indeedjobs");
    yield put({
      type: IN_PROCESS_INDEED_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`Indeed job marked as ${payload.inProgress ? 'in process': 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to mark Indeed job as in process", "error");
  }
}

function* watchInProcessIndeedJob() {
  yield takeLatest(IN_PROCESS_INDEED_JOB_REQUEST, inProcessIndeedJob);
}

function* applyIndeedJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "indeedjobs");
    yield put({
      type: APPLY_INDEED_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to Indeed job!", "success");
  } catch (error) {
    yield put({ type: APPLY_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to apply to Indeed job", "error");
  }
}

function* watchApplyIndeedJob() {
  yield takeLatest(APPLY_INDEED_JOB_REQUEST, applyIndeedJob);
}

function* inProcessLinkedinJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "linkedinjobs");
    yield put({
      type: IN_PROCESS_LINKEDIN_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`Linkedin job marked as ${payload.inProgress ? 'in process' : 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to mark Linkedin job as in process", "error");
  }
}

function* watchInProcessLinkedinJob() {
  yield takeLatest(IN_PROCESS_LINKEDIN_JOB_REQUEST, inProcessLinkedinJob);
}

function* applyLinkedinJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "linkedinjobs");
    yield put({
      type: APPLY_LINKEDIN_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to Linkedin job!", "success");
  } catch (error) {
    yield put({ type: APPLY_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to apply to Linkedin job", "error");
  }
}

function* watchApplyLinkedinJob() {
  yield takeLatest(APPLY_LINKEDIN_JOB_REQUEST, applyLinkedinJob);
}

function* inProcessGoogleJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "googlejobs");
    yield put({
      type: IN_PROCESS_GOOGLE_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`Google job marked as ${payload.inProgress ? 'in process' : 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to mark Google job as in process", "error");
  }
}

function* watchInProcessGoogleJob() {
  yield takeLatest(IN_PROCESS_GOOGLE_JOB_REQUEST, inProcessGoogleJob);
}

function* applyGoogleJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "googlejobs");
    yield put({
      type: APPLY_GOOGLE_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to Google job!", "success");
  } catch (error) {
    yield put({ type: APPLY_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to apply to Google job", "error");
  }
}

function* watchApplyGoogleJob() {
  yield takeLatest(APPLY_GOOGLE_JOB_REQUEST, applyGoogleJob);
}

function* inProcessGlassdoorJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "glassdoorjobs");
    yield put({
      type: IN_PROCESS_GLASSDOOR_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`Glassdoor job marked as ${payload.inProgress ? 'in process' : 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to mark Glassdoor job as in process", "error");
  }
}

function* watchInProcessGlassdoorJob() {
  yield takeLatest(IN_PROCESS_GLASSDOOR_JOB_REQUEST, inProcessGlassdoorJob);
}

function* applyGlassdoorJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "glassdoorjobs");
    yield put({
      type: APPLY_GLASSDOOR_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to Glassdoor job!", "success");
  } catch (error) {
    yield put({ type: APPLY_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to apply to Glassdoor job", "error");
  }
}

function* watchApplyGlassdoorJob() {
  yield takeLatest(APPLY_GLASSDOOR_JOB_REQUEST, applyGlassdoorJob);
}

function* inProcessZiprecruiterJob({ payload }) {
  try {
    yield call(api.inProcessExternalJob, payload, "zip_recruiterjobs");
    yield put({
      type: IN_PROCESS_ZIPRECRUITER_JOB_SUCCESS,
      payload: { id: payload.jobId, inProgress: payload.inProgress }
    });
    notificationQueue(`Ziprecruiter job marked as ${payload.inProgress ? 'in process' : 'Apply Now'}`, "success");
  } catch (error) {
    yield put({ type: IN_PROCESS_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue("Failed to mark Ziprecruiter job as in process", "error");
  }
}

function* watchInProcessZiprecruiterJob() {
  yield takeLatest(
    IN_PROCESS_ZIPRECRUITER_JOB_REQUEST,
    inProcessZiprecruiterJob
  );
}

function* applyZiprecruiterJob({ payload }) {
  try {
    yield call(api.applyExternalJob, payload, "zip_recruiterjobs");
    yield put({
      type: APPLY_ZIPRECRUITER_JOB_SUCCESS,
      payload: payload.job
    });
    notificationQueue("Successfully applied to Ziprecruiter job!", "success");
  } catch (error) {
    yield put({ type: APPLY_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue("Failed to apply to Ziprecruiter job", "error");
  }
}

function* watchApplyZiprecruiterJob() {
  yield takeLatest(APPLY_ZIPRECRUITER_JOB_REQUEST, applyZiprecruiterJob);
}

function* withdrawUnnanuJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "ujobs");
    yield put({
      type: WITHDRAW_UNNANU_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Unnanu job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_UNNANU_JOB_FAIL, error });
    notificationQueue("Failed to withdraw Unnanu job", "error");
  }
}

function* watchWithdrawUnnanuJob() {
  yield takeLatest(WITHDRAW_UNNANU_JOB_REQUEST, withdrawUnnanuJob);
}

function* withdrawXJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "xjobs");
    yield put({
      type: WITHDRAW_X_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from X job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_X_JOB_FAIL, error });
    notificationQueue("Failed to withdraw X job application", "error");
  }
}

function* watchWithdrawXJob() {
  yield takeLatest(WITHDRAW_X_JOB_REQUEST, withdrawXJob);
}

function* withdrawIndeedJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "indeedjobs");
    yield put({
      type: WITHDRAW_INDEED_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Indeed job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to withdraw Indeed job application", "error");
  }
}

function* watchWithdrawIndeedJob() {
  yield takeLatest(WITHDRAW_INDEED_JOB_REQUEST, withdrawIndeedJob);
}

function* withdrawLinkedinJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "linkedinjobs");
    yield put({
      type: WITHDRAW_LINKEDIN_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Linkedin job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to withdraw Linkedin job application", "error");
  }
}

function* watchWithdrawLinkedinJob() {
  yield takeLatest(WITHDRAW_LINKEDIN_JOB_REQUEST, withdrawLinkedinJob);
}

function* withdrawGoogleJob({ payload }) {
  try {
    // TODO: Change from gjobs to googlejobs once the api changes
    yield call(api.withdrawJob, payload, "gjobs");
    yield put({
      type: WITHDRAW_GOOGLE_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Google job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to withdraw Google job application", "error");
  }
}

function* watchWithdrawGoogleJob() {
  yield takeLatest(WITHDRAW_GOOGLE_JOB_REQUEST, withdrawGoogleJob);
}

function* withdrawGlassdoorJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "glassdoorjobs");
    yield put({
      type: WITHDRAW_GLASSDOOR_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Glassdoor job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to withdraw Glassdoor job application", "error");
  }
}

function* watchWithdrawGlassdoorJob() {
  yield takeLatest(WITHDRAW_GLASSDOOR_JOB_REQUEST, withdrawGlassdoorJob);
}

function* withdrawZiprecruiterJob({ payload }) {
  try {
    yield call(api.withdrawJob, payload, "zip_recruiterjobs");
    yield put({
      type: WITHDRAW_ZIPRECRUITER_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue(
      "Successfully withdrawn from Ziprecruiter job application",
      "success"
    );
  } catch (error) {
    yield put({ type: WITHDRAW_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue(
      "Failed to withdraw Ziprecruiter job application",
      "error"
    );
  }
}

function* watchWithdrawZiprecruiterJob() {
  yield takeLatest(WITHDRAW_ZIPRECRUITER_JOB_REQUEST, withdrawZiprecruiterJob);
}

function* fetchAppliedJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("unnanuApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "ujobs");
    yield put({ type: FETCH_APPLIED_JOBS_SUCCESS, payload: { data: post.data.Data, page }});
  } catch (error) {
    yield put({ type: FETCH_APPLIED_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedJobs() {
  yield takeLatest(FETCH_APPLIED_JOBS_REQUEST, fetchAppliedJobs);
}

function* fetchAppliedXJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("xApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "xjobs");
    yield put({
      type: FETCH_APPLIED_X_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_X_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedXJobs() {
  yield takeLatest(FETCH_APPLIED_X_JOBS_REQUEST, fetchAppliedXJobs);
}

function* fetchAppliedIndeedJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("indeedApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "indeedjobs");
    yield put({
      type: FETCH_APPLIED_INDEED_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_INDEED_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedIndeedJobs() {
  yield takeLatest(FETCH_APPLIED_INDEED_JOBS_REQUEST, fetchAppliedIndeedJobs);
}

function* fetchAppliedLinkedinJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("linkedinApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "linkedinjobs");
    yield put({
      type: FETCH_APPLIED_LINKEDIN_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_LINKEDIN_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedLinkedinJobs() {
  yield takeLatest(
    FETCH_APPLIED_LINKEDIN_JOBS_REQUEST,
    fetchAppliedLinkedinJobs
  );
}

function* fetchAppliedGoogleJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("googleApplied", true));
    const post = yield call(
      api.fetchAppliedJobs,
      { token, page:jobCount },
      "googlejobs"
    );
    yield put({
      type: FETCH_APPLIED_GOOGLE_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_GOOGLE_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedGoogleJobs() {
  yield takeLatest(FETCH_APPLIED_GOOGLE_JOBS_REQUEST, fetchAppliedGoogleJobs);
}

function* fetchAppliedGlassdoorJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("xApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "glassdoorjobs");
    yield put({
      type: FETCH_APPLIED_GLASSDOOR_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_GLASSDOOR_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedGlassdoorJobs() {
  yield takeLatest(
    FETCH_APPLIED_GLASSDOOR_JOBS_REQUEST,
    fetchAppliedGlassdoorJobs
  );
}

function* fetchAppliedZiprecruiterJobs({ payload }) {
  try {
    const { token, page = 0, jobCount=0 } = payload;
    yield put(setJobLoading("ziprecruiterApplied", true));
    const post = yield call(api.fetchAppliedJobs, { token, page:jobCount }, "zip_recruiterjobs");
    yield put({
      type: FETCH_APPLIED_ZIPRECRUITER_JOBS_SUCCESS,
      payload: { data: post.data.Data, page: payload.page }
    });
  } catch (error) {
    yield put({ type: FETCH_APPLIED_ZIPRECRUITER_JOBS_FAIL, error });
  }
}

function* watchFetchAppliedZiprecruiterJobs() {
  yield takeLatest(
    FETCH_APPLIED_ZIPRECRUITER_JOBS_REQUEST,
    fetchAppliedZiprecruiterJobs
  );
}

function* deleteUnnanuJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "ujobs");
    yield put({
      type: DELETE_UNNANU_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Unnanu job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_UNNANU_JOB_FAIL, error });
    notificationQueue("Failed to delete Unnanu job", "error");
  }
}

function* watchDeleteUnnanuJob() {
  yield takeLatest(DELETE_UNNANU_JOB_REQUEST, deleteUnnanuJob);
}

function* deleteXJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "xjobs");
    yield put({
      type: DELETE_X_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("X job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_X_JOB_FAIL, error });
    notificationQueue("Failed to delete X job", "error");
  }
}

function* watchDeleteXJob() {
  yield takeLatest(DELETE_X_JOB_REQUEST, deleteXJob);
}

function* deleteIndeedJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "indeedjobs");
    yield put({
      type: DELETE_INDEED_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Indeed job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_INDEED_JOB_FAIL, error });
    notificationQueue("Failed to delete Indeed job", "error");
  }
}

function* watchDeleteIndeedJob() {
  yield takeLatest(DELETE_INDEED_JOB_REQUEST, deleteIndeedJob);
}

function* deleteLinkedinJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "linkedinjobs");
    yield put({
      type: DELETE_LINKEDIN_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Linkedin job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_LINKEDIN_JOB_FAIL, error });
    notificationQueue("Failed to delete Linkedin job", "error");
  }
}

function* watchDeleteLinkedinJob() {
  yield takeLatest(DELETE_LINKEDIN_JOB_REQUEST, deleteLinkedinJob);
}

function* deleteGoogleJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "googlejobs");
    yield put({
      type: DELETE_GOOGLE_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Google job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_GOOGLE_JOB_FAIL, error });
    notificationQueue("Failed to delete Google job", "error");
  }
}

function* watchDeleteGoogleJob() {
  yield takeLatest(DELETE_GOOGLE_JOB_REQUEST, deleteGoogleJob);
}

function* deleteGlassdoorJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "glassdoorjobs");
    yield put({
      type: DELETE_GLASSDOOR_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Glassdoor job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_GLASSDOOR_JOB_FAIL, error });
    notificationQueue("Failed to delete Glassdoor job", "error");
  }
}

function* watchDeleteGlassdoorJob() {
  yield takeLatest(DELETE_GLASSDOOR_JOB_REQUEST, deleteGlassdoorJob);
}

function* deleteZiprecruiterJob({ payload }) {
  try {
    yield call(api.deleteJob, payload, "zip_recruiterjobs");
    yield put({
      type: DELETE_ZIPRECRUITER_JOB_SUCCESS,
      payload: { id: payload.jobId }
    });
    notificationQueue("Ziprecruiter job deleted successfully!", "success");
  } catch (error) {
    yield put({ type: DELETE_ZIPRECRUITER_JOB_FAIL, error });
    notificationQueue("Failed to delete Ziprecruiter job", "error");
  }
}

function* watchDeleteZiprecruiterJob() {
  yield takeLatest(DELETE_ZIPRECRUITER_JOB_REQUEST, deleteZiprecruiterJob);
}

function* fetchJobExtractActivity({ payload }) {
  try {
    const post = yield call(api.fetchJobExtractActivity, payload);
    yield put({
      type: FETCH_JOB_EXTRACT_ACTIVITY_SUCCESS,
      payload: post.data.Data
    });
  } catch (error) {
    yield put({ type: FETCH_JOB_EXTRACT_ACTIVITY_FAIL, error });
  }
}

function* watchFetchJobExtractActivity() {
  yield takeLatest(FETCH_JOB_EXTRACT_ACTIVITY_REQUEST, fetchJobExtractActivity);
}

function* fetchJobsHeaderCount({ payload }) {
  try {
    const post = yield call(api.fetchJobsHeaderCount, payload);
    yield put({
      type: FETCH_JOBS_HEADER_COUNT_SUCCESS,
      payload: post.data.Data
    });
  } catch (error) {
    yield put({ type: FETCH_JOBS_HEADER_COUNT_FAIL, error });
  }
}

function* watchFetchJobsHeaderCount() {
  yield takeLatest(FETCH_JOBS_HEADER_COUNT_REQUEST, fetchJobsHeaderCount);
}

export default function* postsAppSagas() {
  yield fork(watchFetchUserProfile);
  yield fork(watchSignOutUser);
  yield fork(watchFetchPopularJobs);
  yield fork(watchFetchNotifications);

  yield fork(watchFetchSavedJobs);
  yield fork(watchFetchSavedJobsList);

  yield fork(watchFetchUnnanuJobs);
  yield fork(watchFetchXJobs);
  yield fork(watchFetchIndeedJobs);
  yield fork(watchFetchLinkedinJobs);
  yield fork(watchFetchGoogleJobs);
  yield fork(watchFetchGlassdoorJobs);
  yield fork(watchFetchZiprecruiterJobs);

  yield fork(watchSaveJob);
  yield fork(watchSaveXJob);
  yield fork(watchSaveIndeedJob);
  yield fork(watchSaveLinkedinJob);
  yield fork(watchSaveGoogleJob);
  yield fork(watchSaveGlassdoorJob);
  yield fork(watchSaveZiprecruiterJob);

  yield fork(watchRemoveJob);
  yield fork(watchRemoveSaveXJob);
  yield fork(watchRemoveSaveIndeedJob);
  yield fork(watchRemoveSaveLinkedinJob);
  yield fork(watchRemoveSaveGoogleJob);
  yield fork(watchRemoveSaveGlassdoorJob);
  yield fork(watchRemoveSaveZiprecruiterJob);

  yield fork(watchInProcessXJob);
  yield fork(watchInProcessIndeedJob);
  yield fork(watchInProcessLinkedinJob);
  yield fork(watchInProcessGoogleJob);
  yield fork(watchInProcessGlassdoorJob);
  yield fork(watchInProcessZiprecruiterJob);

  yield fork(watchApplyXJob);
  yield fork(watchApplyIndeedJob);
  yield fork(watchApplyLinkedinJob);
  yield fork(watchApplyGoogleJob);
  yield fork(watchApplyGlassdoorJob);
  yield fork(watchApplyZiprecruiterJob);

  yield fork(watchWithdrawUnnanuJob);
  yield fork(watchWithdrawXJob);
  yield fork(watchWithdrawIndeedJob);
  yield fork(watchWithdrawLinkedinJob);
  yield fork(watchWithdrawGoogleJob);
  yield fork(watchWithdrawGlassdoorJob);
  yield fork(watchWithdrawZiprecruiterJob);

  yield fork(watchFetchAppliedJobs);
  yield fork(watchFetchAppliedXJobs);
  yield fork(watchFetchAppliedIndeedJobs);
  yield fork(watchFetchAppliedLinkedinJobs);
  yield fork(watchFetchAppliedGoogleJobs);
  yield fork(watchFetchAppliedGlassdoorJobs);
  yield fork(watchFetchAppliedZiprecruiterJobs);

  yield fork(watchDeleteUnnanuJob);
  yield fork(watchDeleteXJob);
  yield fork(watchDeleteIndeedJob);
  yield fork(watchDeleteLinkedinJob);
  yield fork(watchDeleteGoogleJob);
  yield fork(watchDeleteGlassdoorJob);
  yield fork(watchDeleteZiprecruiterJob);

  yield fork(watchFetchJobExtractActivity);
  yield fork(watchFetchJobsHeaderCount);

  yield fork(watchFetchSavedXJobs);
  yield fork(watchFetchSavedGoogleJobs);
  yield fork(watchFetchSavedIndeedJobs);
  yield fork(watchFetchSavedLinkedinJobs);
  yield fork(watchFetchSavedGlassdoorJobs);
  yield fork(watchFetchSavedZiprecruiterJobs);
}
