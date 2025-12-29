import React, { Component } from "react";
import PropTypes from "prop-types";
import nookies, { parseCookies, setCookie } from "nookies"; // Replace Cookies import

import {
  changeClosingDate,
  changeJobType,
  changeSalaryEstimate,
  changeSortBy,
  changeWorkType,
  fetchPosts,
  setFilterKeyword,
} from "store/posts/actions";
import {
  fetchAppliedJobs,
  fetchLocation,
  fetchUnnanuJobs,
  fetchNotifications,
  fetchPopularJobs,
  fetchSavedJobs,
  fetchSavedJobsList,
  fetchUserProfile,
  storeToken,
  fetchJobExtractActivity,
  fetchJobsHeaderCount,
} from "store/app/actions";

import Layout from "components/Layout";
import SidebarLeft from "components/SidebarLeft";
import SidebarRight from "components/SidebarRight";
import JobResults from "components/JobResults";
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import Store from "store";
import CustomJobResults from "../components/JobResults/customJobResults";

class PostsIndex extends Component {
  static async getInitialProps({ ctx, query, store, res }) {
    const state = store.getState();
    const cookies = nookies.get(ctx);

    const sortArray = [0, 1];
    const salaryArray = [
      "All salary estimates",
      "Unspecified",
      "Below $50,000",
      "Below $24",
      "$50,000+",
      "$70,000+",
      "$90,000+",
      "$110,000+",
      "$130,000+",
      "$24+",
      "$33+",
      "$43+",
      "$52+",
      "$62+",
    ];
    const closeArray = [
      "Closing anytime",
      "Today",
      "Tomorrow",
      "This week",
      "Next week",
      "In two weeks",
      "In a month",
      "In 30 days+",
    ];
    const jobArray = [
      "All job types",
      "Full time (Employee)",
      "Full time (Contract)",
      "Full time (Intern)",
      "Part time (Employee)",
      "Part time (Contract)",
      "Part time (Intern)",
    ];
    const workArray = [
      "All work types",
      "Schedule (M-F) - Onsite",
      "Schedule (M-F) - Remote",
    ];
    //set filters
    const {
      closeDate,
      jobType,
      workType,
      salaryEstimate,
      sortBy,
      keyword,
      isCompany,
    } = state.posts.facets;
    let cookeieFilters = cookies.filters
      ? JSON.parse(cookies.filters)
      : undefined;
    if (cookeieFilters === undefined) {
      cookeieFilters = { isCompany: false };
    }
    let userfilters = {
      sortBy: sortBy,
      salaryEstimate: salaryEstimate,
      jobType: jobType,
      worktype: workType,
      closeDate: closeDate,
      keyword: keyword,
      isCompany: cookeieFilters.isCompany,
    };
    if (
      query.closedate &&
      closeArray.indexOf(query.closedate) > -1 &&
      query.closedate != closeDate
    ) {
      await store.dispatch(changeClosingDate(query.closedate));
      userfilters = {
        ...userfilters,
        closeDate: query.closedate,
      };
    }

    if (
      query.jobtype &&
      jobArray.indexOf(query.jobtype) > -1 &&
      query.jobtype != jobType
    ) {
      await store.dispatch(changeJobType(query.jobtype));
      userfilters = {
        ...userfilters,
        jobType: query.jobtype,
      };
    }

    if (
      query.worktype &&
      workArray.indexOf(query.worktype) > -1 &&
      query.worktype != workType
    ) {
      await store.dispatch(changeWorkType(query.worktype));
      userfilters = {
        ...userfilters,
        workType: query.worktype,
      };
    }

    if (
      query.salary &&
      salaryArray.indexOf(query.salary) > -1 &&
      query.salary != salaryEstimate
    ) {
      await store.dispatch(changeSalaryEstimate(query.salary));
      userfilters = {
        ...userfilters,
        salaryEstimate: query.salary,
      };
    }

    if (
      query.sort &&
      sortArray.indexOf(parseInt(query.sort)) > -1 &&
      parseInt(query.sort) != sortBy
    ) {
      await store.dispatch(changeSortBy(parseInt(query.sort)));
      userfilters = {
        ...userfilters,
        sortBy: parseInt(query.sort),
      };
    }

    if (query.keyword && query.keyword != "" && query.keyword != keyword) {
      await store.dispatch(
        setFilterKeyword(query.keyword, cookeieFilters.isCompany)
      );
      userfilters = {
        ...userfilters,
        keyword: query.keyword,
        isCompany: cookeieFilters.isCompany,
      };
    }

    const queryLocation =
      query.location === undefined ? "Austin, TX, USA" : query.location;

    if (
      query.location &&
      query.location !== "" &&
      query.location !== state.app.location
    ) {
      await store.dispatch(fetchLocation(queryLocation));
    }

    const cookie = cookies.token;
    const formatToken = query.token;
    if (formatToken && formatToken.length === 16) {
      nookies.set(ctx, "token", formatToken, {
        maxAge: 1 * 24 * 60 * 60, // 1 Day
        path: "/",
      });
      await store.dispatch(storeToken(formatToken));
      await store.dispatch(fetchUserProfile(formatToken));
      await store.dispatch(fetchNotifications(formatToken));
      await store.dispatch(fetchJobsHeaderCount(formatToken));
      await store.dispatch(fetchJobExtractActivity(formatToken));
      await store.dispatch(fetchUnnanuJobs(formatToken));
      await store.dispatch(fetchAppliedJobs(formatToken));
      await store.dispatch(fetchSavedJobs(formatToken));
      await store.dispatch(fetchSavedJobsList(formatToken));
    }
    if (cookie && !query.jobId && !state.app.token) {
      await store.dispatch(storeToken(cookie));
    }

    if (!cookie && !query.jobId) {
      await store.dispatch(fetchPosts(queryLocation, userfilters));
      await store.dispatch(fetchPopularJobs(queryLocation));
    }

    const newState = store.getState();

    return {
      location: queryLocation,
      newToken: formatToken, // Changed from query.token to formatToken
      app: newState.app,
      activeJobName: newState.app.activeJobName, // Add activeJobName
      posts: newState.posts.list,
      unnanuJobs: newState.app.unnanuJobs,
      filters: newState.posts.facets,
    };
  }

  componentDidMount() {
    const {
      cookie,
      newToken,
      fetchProfile,
      fetchAppliedJobs,
      fetchSavedJobs,
      fetchSavedJobsList,
      fetchNotifications,
      fetchJobExtractActivity,
      fetchJobsHeaderCount,
      fetchUnnanuJobs,
    } = this.props;

    const token = newToken && newToken.length === 16 ? newToken : cookie;
    if (token) {
      fetchProfile(token);
      setCookie(null, "token", token, {
        maxAge: 1 * 24 * 60 * 60, // 1 Day
        path: "/",
      });
      storeToken(token);
      fetchNotifications(token);
      fetchJobExtractActivity(token);
      fetchJobsHeaderCount(token);
      fetchUnnanuJobs(token);
      fetchAppliedJobs(token);
      fetchSavedJobs(token);
      fetchSavedJobsList(token);
      // fetchPopularJobs(token);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      cookie,
      fetchProfile,
      fetchSavedJobs,
      fetchSavedJobsList,
      fetchAppliedJobs,
      fetchNotifications,
      fetchJobExtractActivity,
      fetchJobsHeaderCount,
    } = this.props;

    const prevCookie = prevProps.cookie;

    if (!prevCookie && cookie && cookie.length === 16) {
      fetchProfile(cookie);
      fetchNotifications(cookie);
      fetchJobExtractActivity(cookie);
      fetchJobsHeaderCount(cookie);
      fetchAppliedJobs(cookie);
      fetchSavedJobs(cookie);
      fetchSavedJobsList(cookie);
    }
  }

  render() {
    const {
      posts,
      unnanuJobs,
      googleJobs,
      xJobs,
      indeedJobs,
      linkedinJobs,
      glassdoorJobs,
      ziprecruiterJobs,
      url,
      appData,
      deviceInfo,
      cookie,
    } = this.props;
    let jobs;

    if (appData.isLogged && appData.user) {
      switch (appData.activeJobName) {
        case "google":
          jobs = (
            <CustomJobResults
              jobs={googleJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        case "x":
          jobs = (
            <CustomJobResults
              jobs={xJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        case "indeed":
          jobs = (
            <CustomJobResults
              jobs={indeedJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        case "linkedin":
          jobs = (
            <CustomJobResults
              jobs={linkedinJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        case "glassdoor":
          jobs = (
            <CustomJobResults
              jobs={glassdoorJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        case "ziprecruiter":
          jobs = (
            <CustomJobResults
              jobs={ziprecruiterJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
          break;
        default:
          jobs = (
            <CustomJobResults
              jobs={unnanuJobs}
              urlDetails={url}
              deviceInfo={deviceInfo}
            />
          );
      }
    } else {
      jobs = (
        <JobResults urlDetails={url} jobs={posts} deviceInfo={deviceInfo} />
      );
    }

    return (
      <Layout
        urlDetails={url}
        userData={appData}
        deviceInfo={deviceInfo}
        cookie={cookie}
      >
        <div
          className="jobs-container container"
          style={
            appData.isLogged && appData.user ? { marginTop: "60px" } : undefined
          }
        >
          <div className="row col-12 jobs-row-wrap mx-0">
            <SidebarLeft userData={appData} />
            {jobs}
            <SidebarRight />
          </div>
        </div>
      </Layout>
    );
  }
}

PostsIndex.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    appData: app,
    activeJobName: app.activeJobName,
    googleJobs: app.googleJobs,
    unnanuJobs: app.unnanuJobs,
    xJobs: app.xJobs,
    indeedJobs: app.indeedJobs,
    linkedinJobs: app.linkedinJobs,
    glassdoorJobs: app.glassdoorJobs,
    ziprecruiterJobs: app.ziprecruiterJobs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  storeToken: (token) => dispatch(storeToken(token)),
  fetchProfile: (token) => dispatch(fetchUserProfile(token)), // Make sure this returns a promise
  fetchSavedJobs: (token) => dispatch(fetchSavedJobs(token)),
  fetchAppliedJobs: (token) => dispatch(fetchAppliedJobs(token)),
  fetchSavedJobsList: (token) => dispatch(fetchSavedJobsList(token)),
  fetchNotifications: (token) => dispatch(fetchNotifications(token)),
  fetchJobExtractActivity: (token) => dispatch(fetchJobExtractActivity(token)),
  fetchJobsHeaderCount: (token) => dispatch(fetchJobsHeaderCount(token)),
  fetchUnnanuJobs: (token) => dispatch(fetchUnnanuJobs(token)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga({ async: true })(PostsIndex)
);
