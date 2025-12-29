import axios from "axios";

import moment from "moment";
import {
  getDatesType,
  getJobType,
  getLocationFilter,
  getSalaryEstimate,
  getSortBy,
  getWorkType,
  setSearchKeyword,
} from "services/utils";
import urls from "./urls";

const facade = {};

const api = axios.create({
  baseURL: urls.SearchIndex.URL,
  headers: { "api-key": urls.SearchIndex.Key },
});

facade.request = (config) => api.request(config);
["get", "head"].forEach((method) => {
  facade[method] = (url, config) => facade.request({ ...config, method, url });
});
["delete", "post", "put", "patch"].forEach((method) => {
  facade[method] = (url, data, config) =>
    facade.request({ ...config, method, url, data });
});


class API {
  static fetchAllPosts(payload) {
    const date = moment(new Date())
      .subtract(1, "days")
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");
    const formatDate = `${date}Z`;

    // const {salaryEstimate = 'All salary estimates', jobType = 'All job types', closeDate= 'Closing anytime', keyword='' } = payload.filters;
    const sortBy = payload.filters.sortBy || 0;
    const salaryEstimate =
      payload.filters.salaryEstimate || "All salary estimates";
    const jobType = payload.filters.jobType || "All job types";
    const workType = payload.filters.workType || "All work types";
    const closeDate = payload.filters.closeDate || "Closing anytime";
    const keyword = payload.filters.keyword || "";
    const isCompany = payload.filters.isCompany || false;

    //filtering and sorting query build
    const closing =
      closeDate !== "Closing anytime"
        ? getDatesType(closeDate, "closing_date")
        : "";
    const jobFilter =
      jobType !== "All job types"
        ? getJobType(jobType, "job_type_array_facet")
        : "";
    const workFilter =
      workType !== "All work types"
        ? getWorkType(workType, "job_schd_facet")
        : "";
    const salaryFilter =
      salaryEstimate !== "All salary estimates"
        ? getSalaryEstimate(
            salaryEstimate,
            "salary_annually",
            "salary_annually_end"
          )
        : "";
    const sort =
      // keyword === "" || sortBy !== 0 ? getSortBy(1, "updated_time") : "";
      keyword === "" || sortBy !== 0 ? getSortBy(1, "closing_date") : "";
    const keywordFiltering =
      keyword !== "" ? setSearchKeyword(keyword, isCompany) : "";
    const locationFiltering =
      payload.location !== "Global" ? getLocationFilter(payload.location) : "";

    // check for location data
    // const userLocation = payload.location !== undefined ? payload.location : 'Austin, TX';
    // const filteredLocation = userLocation.match(/[^,]+,[^,]+/g)[0];

    let filtering =
      locationFiltering +
      closing +
      jobFilter +
      workFilter +
      salaryFilter +
      keywordFiltering +
      " and (status eq 2 or status eq null) and closing_date gt " +
      formatDate;
    filtering = filtering.substring(5);

    return facade.get(
      "/indexes/job-board-uat/docs?api-version=2017-11-11&search=*&$top=10&$filter=" +
        filtering +
        "&$count=true&facet=closing_date,count:10000&facet=job_type_array_facet&facet=job_schd_facet&facet=salary_annually_facet,count:10000" +
        sort
    );
  }

  static fetchMorePosts(payload) {
    const date = moment(new Date())
      .subtract(1, "days")
      .endOf("day")
      .format("YYYY-MM-DDTHH:mm:ss");
    const formatDate = `${date}Z`;

    // const {salaryEstimate = 'All salary estimates', jobType = 'All job types', closeDate= 'Closing anytime', keyword='' } = payload.filters;
    const sortBy = payload.filters.sortBy || 0;
    const salaryEstimate =
      payload.filters.salaryEstimate || "All salary estimates";
    const jobType = payload.filters.jobType || "All job types";
    const workType = payload.filters.workType || "All work types";
    const closeDate = payload.filters.closeDate || "Closing anytime";
    const keyword = payload.filters.keyword || "";

    //filtering and sorting query build
    const closing =
      closeDate !== "Closing anytime"
        ? getDatesType(closeDate, "closing_date")
        : "";
    const jobFilter =
      jobType !== "All job types"
        ? getJobType(jobType, "job_type_array_facet")
        : "";
    const workFilter =
      workType !== "All work types"
        ? getWorkType(workType, "job_schd_facet")
        : "";
    const salaryFilter =
      salaryEstimate !== "All salary estimates"
        ? getSalaryEstimate(
            salaryEstimate,
            "salary_annually",
            "salary_annually_end"
          )
        : "";
    const sort =
      // keyword === "" || sortBy !== 0 ? getSortBy(1, "updated_time") : "";
      keyword === "" || sortBy !== 0 ? getSortBy(1, "closing_date") : "";
    const keywordFiltering = keyword !== "" ? setSearchKeyword(keyword) : "";
    const locationFiltering =
      payload.location !== "Global" ? getLocationFilter(payload.location) : "";

    // check for location data
    // const userLocation = payload.location !== undefined ? payload.location : 'Austin, TX';
    // const filteredLocation = userLocation.match(/[^,]+,[^,]+/g)[0];

    let pageNumber = payload.page !== undefined ? parseInt(payload.page) : 0;
    if (payload.page === 1 || payload.page === 0) {
      pageNumber = 10;
    }

    let filtering =
      locationFiltering +
      closing +
      jobFilter +
      workFilter +
      salaryFilter +
      keywordFiltering +
      " and (status eq 2 or status eq null) and closing_date gt " +
      formatDate;
    filtering = filtering.substring(5);

    return facade.get(
      "/indexes/job-board-uat/docs?api-version=2017-11-11&search=*&$skip=" +
        pageNumber +
        "&$top=10&$filter=" +
        filtering +
        "&$count=true&" +
        sort
    );
  }

  static countAllJobs() {
    return facade.get(
      "/indexes/job-board-uat/docs?api-version=2017-11-11&count=*"
    );
  }

  static fetchPost(id) {
    return facade.get(
      `/indexes/job-board-uat/docs/${id}?api-version=2017-11-11`
    );
  }

  static fetchSimilarJobs(id) {
    const date = moment(new Date())
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    return facade.get(
      `/indexes/job-board-uat/docs?moreLikeThis=${id}&searchFields=j_title&$filter=closing_date gt ${date} and (status eq 2 or status eq null)&api-version=2016-09-01-Preview`
    );
  }

  static checkCompanyJobs(payload) {
    const date = moment(new Date())
      .subtract(1, "days")
      .format("YYYY-MM-DD");
    return facade.get(
      `/indexes/job-board-uat/docs?api-version=2017-11-11&search=*&$filter=closing_date gt ${date} and (status eq 2 or status eq null) and location eq '${
        payload.location
      }' and company_name eq '${payload.company}' and j_id ne '${
        payload.id
      }'&$count=true`
    );
  }

  static fetchAutocomplete(text) {
    return facade.get(
      `/indexes/job-board-uat/docs/suggest?api-version=2017-11-11&search='${text}'&suggesterName=title-and-company`
    );
  }

  // User APIS
  static fetchUserProfile(token) {
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.API,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(facade2.get("/api/v1/profile"));
  }

  static signOutUser(token) {
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.API,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(facade2.post("/api/v1/user/signout"));
  }

  static fetchExternalJob(token, jobId, activeJobName){
    const facade2 = {}
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.get(`/api/v1/profile/match/${activeJobName}Jobs/${jobId}/extjob`)
    );
  }

  static fetchSavedJobs(payload, type) {
    const facade2 = {};
    const { token, page } = payload;
    const api2 = axios.create({
      // baseURL: urls.API,
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    const pageNumber = page === undefined ? 0 : page;

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      // facade2.get(`/api/v1/user/vacancy/${type}/savedlist?page=${pageNumber}`)
      facade2.get(`/api/v1/user/job/${type}/savedlist?page=${pageNumber}`)
    );
  }

  static fetchSavedJobsList(token) {
  //   const facade2 = {};
  //   const api2 = axios.create({
  //     baseURL: urls.API,
  //     headers: { Authorization: token },
  //   });
  //
  //   facade2.request = (config) => api2.request(config);
  //   ["get", "head"].forEach((method) => {
  //     facade2[method] = (url, config) =>
  //       facade2.request({ ...config, method, url });
  //   });
  //   ["delete", "post", "put", "patch"].forEach((method) => {
  //     facade2[method] = (url, data, config) =>
  //       facade2.request({ ...config, method, url, data });
  //   });
  //   return Promise.resolve(facade2.get("/api/v1/user/vacancy/savedlist/ids"));
  }

  static fetchAppliedJobs(payload, type) {
    const facade2 = {};
    const { token, page = 0 } = payload;
    const api2 = axios.create({
      // baseURL: urls.API,
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      // facade2.get(`/api/v1/user/vacancy/${type}/appliedlist?page=${page}`)
    facade2.get(`/api/v1/user/job/${type}/appliedlist?page=${page}`)
    );
  }

  static saveJob(payload) {
    const { token, jobId } = payload;
    const facade2 = {};
    const api2 = axios.create({
      // baseURL: urls.API,
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      // facade2.post(`api/v1/user/vacancy/save?job_id=${jobId}`)
      facade2.post(`/api/v1/user/job/save?job_id=${jobId}`)
    );
  }

  static removeJob(payload) {
    const { token, jobId } = payload;
    const facade2 = {};
    const api2 = axios.create({
      // baseURL: urls.API,
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      // facade2.post(`api/v1/user/vacancy/ujobs/remove?job_id=${jobId}`)
      facade2.post(`api/v1/user/job/ujobs/remove?job_id=${jobId}`)
    );
  }

  static postUpdate(id) {
    const facade2 = {};
    const api2 = axios.create({ baseURL: urls.HireAPI });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.get(`/api/v1/jobboard/vacancy/view?postId=${id}`)
    );
  }

  static getPopularJobs(location) {
    const facade2 = {};
    const api2 = axios.create({ baseURL: urls.HireAPI });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    const sentLocation =
      location == "" || location == "Global" ? "Austin, TX, USA" : location;
    let filterLocation;
    try {
      filterLocation = sentLocation.match(/[^,]+,[^,]+/g)[0];
    } catch (e) {
      filterLocation = "Austin, TX";
    }
    return Promise.resolve(
      facade2.get(
        `/api/v1/jobboard/vacancy/mostviews?page=0&location=${filterLocation}`
      )
    );
  }

  static fetchNotifications(token) {
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.API,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(facade2.get("/api/v1/profile/get/headerData"));
  }

  static fetchUnnanuJobs(payload) {
    const facade2 = {};
    const { token, page = 0 } = payload;
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.get(`/api/v1/profile/match/unnanulist?page=${page}`)
    );
  }

  static fetchExternalJobs(payload, type) {
    const facade2 = {};
    const { token, page = 0 } = payload;
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });

    return Promise.resolve(
      facade2.get(`/api/v1/profile/match/${type}/extlist?page=${page}`)
    );
  }

  static saveExternalJob(payload, type) {
    const { token, jobId, job } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(
        `api/v1/profile/match/${jobId}/${type}/true/update/${job.is_applied}`
      )
    );
  }

  static removeSaveExternalJob(payload, type) {
    const { token, jobId, job } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(
        `api/v1/profile/match/${jobId}/${type}/false/update/${job.is_applied}`
      )
    );
  }

  static inProcessExternalJob(payload, type, status) {
    const { token, jobId, inProgress } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(
        `api/v1/profile/match/${jobId}/${type}/inprocess/${inProgress}`
      )
    );
  }

  static applyExternalJob(payload, type) {
    const { token, jobId, job } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(
        `api/v1/profile/match/${jobId}/${type}/${job.is_saved}/update/true`
      )
    );
  }

  static withdrawJob(payload, type) {
    const { token, jobId } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.API,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(`api/v1/user/vacancy/${jobId}/${type}/withdraw`)
    );
  }

  static deleteJob(payload, type) {
    const { token, jobId } = payload;
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(
      facade2.post(`api/v1/profile/match/${jobId}/${type}/delete`)
    );
  }

  static fetchJobExtractActivity(token) {
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(facade2.get("/api/v1/profile/match/activity"));
  }

  static fetchJobsHeaderCount(token) {
    const facade2 = {};
    const api2 = axios.create({
      baseURL: urls.TalentOtherAPI,
      headers: { Authorization: token },
    });

    facade2.request = (config) => api2.request(config);
    ["get", "head"].forEach((method) => {
      facade2[method] = (url, config) =>
        facade2.request({ ...config, method, url });
    });
    ["delete", "post", "put", "patch"].forEach((method) => {
      facade2[method] = (url, data, config) =>
        facade2.request({ ...config, method, url, data });
    });
    return Promise.resolve(facade2.get("/api/v1/profile/match/headercount"));
  }
}

export default API;
