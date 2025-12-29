import React, { Component } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";
import {
  fetchMoreCompanyJobs,
  fetchPost,
  fetchSimilarJobs,
  setFilterKeyword,
} from "store/posts/actions";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  fetchAppliedJobs,
  fetchNotifications,
  fetchSavedJobs,
  fetchSavedJobsList,
  fetchUserProfile,
  removeJob,
  saveJob,
  showOrHidePopup,
  withdrawUnnanuJob,
} from "store/app/actions";

import renderHTML from "react-render-html";
import Moment from "react-moment";
import moment from "moment";
import classNames from "classnames";

import SubmitButton from "components/Buttons";
import ApplyButton from "components/Buttons/ApplyButton";

import { confirmAlert } from "react-confirm-alert";
import { notify } from "react-notify-toast";

import fetch from "isomorphic-fetch";

import urls from "services/api/urls";
import api from "services/api";
import { parseCookies } from "nookies";

import JobsList from "./../components/JobsList";
import Modal from "../components/Modal/modal";
import Layout from "./../components/Layout";

import {
  imageURL, isValidDate,
  prepareEmailData,
  prepareFBData,
  prepareLinkedinData,
  prepareTweetData,
  prepareURLName,
  prepareURLQuery,
} from "services/utils";

class Job extends Component {
  static async getInitialProps({ ctx, query, store, res, req, isServer }) {
    const { id, signup } = query;
    // eslint-disable-next-line no-undef
    if (id && !isNaN(id)) {
      const url = `${
        urls.SearchIndex.URL
      }/indexes/job-board-uat/docs/${id}?api-version=2017-11-11`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "api-key": urls.SearchIndex.Key,
        },
      });

      const json = await response.json();
      await store.dispatch(fetchSimilarJobs(id));
      await store.dispatch(
        fetchMoreCompanyJobs({
          company: json.company_name,
          location: json.location,
          id: json.j_id,
        })
      );

      return {
        id,
        post: json,
        isJobExpired: moment().isAfter(json.closing_date),
      };
    }
    if (res) {
      res.writeHead(302, {
        Location: "/",
      });
      res.end();
    } else {
      Router.push("/");
    }
    return {};
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      id,
      cookie,
      fetchAppliedJobs,
      fetchSavedJobs,
      fetchProfile,
      fetchSavedJobsList,
      fetchNotifications,
    } = this.props;

    if (id) {
      api.postUpdate(this.props.id);
    }

    if (cookie && cookie.length === 16) {
      fetchProfile(cookie);
      fetchNotifications(cookie);
      fetchSavedJobs(cookie);
      fetchAppliedJobs(cookie);
      fetchSavedJobsList(cookie);
    }

    // if (post && post.j_id === id) {
    //   checkCompanyJobs({company: post.company_name, location: post.location, id: post.j_id});
    // }
  }

  onCopy = () => {
    notify.show("Copied to clipboard!", "success");
  };

  getOtherSavedJobs = (id) => {
    const { savedJobs } = this.props;
    const otherJobs = savedJobs.filter((el) => el.id != id);
    const returnSaved =
      otherJobs.length > 5 ? otherJobs.slice(0, 5) : otherJobs;
    return returnSaved;
  };

  getOtherSimilarJobs = (id) => {
    const { similarJobs } = this.props;
    const otherJobs = similarJobs.filter((el) => el.j_id != id);
    const returnSimilar =
      otherJobs.length > 5 ? otherJobs.slice(0, 5) : otherJobs;
    return returnSimilar;
  };

  formatSimilarJobs = (jobs) => {
    const jobsList = [];
    jobs.map((job) => {
      jobsList.push({
        id: job.j_id,
        title: job.j_title,
        company: job.company_name,
        logo: job.logo,
      });
    });
    return jobsList;
  };

  composeSalaryRange = (type, item) => {
    const label = parseInt(type) === 1 ? "YEAR" : "HOUR";

    const startRange =
      parseInt(type) === 1
        ? Math.ceil(item.salary_annually)
        : Math.ceil(parseInt(item.salary_hr_start));
    const endRange =
      parseInt(type) === 1
        ? Math.ceil(item.salary_annually_end)
        : Math.ceil(parseInt(item.salary_hr_end));

    if (startRange === 0 && endRange === 0) {
      return null;
    } else if (endRange === 0) {
      return `$${startRange
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;
    }
    return `$${startRange
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} - $${endRange
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ${label}`;
  };

  composeSalaryMinValue = (type, item) =>
    parseInt(type) === 1
      ? Math.ceil(item.salary_annually)
      : Math.ceil(parseInt(item.salary_hr_start));

  composeSalaryMaxValue = (type, item) =>
    parseInt(type) === 1
      ? Math.ceil(item.salary_annually_end)
      : Math.ceil(parseInt(item.salary_hr_end));

  composeSalaryUnitText = (type, item) =>
    parseInt(type) === 1 ? "Annually" : "Hourly";

  applyJob(id, data) {
    const { appData, post, deviceInfo, cookie } = this.props;
    if (
      deviceInfo.isMobile ||
      (appData.isLogged && !appData.isModalOpen && cookie)
    ) {
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      // MB:01/25/2021
      window.location = `${
        urls.Recruit
      }/jobboard/apply/${formatJobId}?service=findjobs&source=UJSL`;
    } else {
      // document.body.classList.add('modal-open');
      // const jobNameURL = prepareURLName({ title: data.j_title, company: data.company_name });
      // Router.push(`/job?id=${post.j_id}&name=${jobNameURL}&signup=true&type=apply`, `/job/${post.j_id}/${jobNameURL}`);

      const { filters, appData } = this.props;
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      const isJobApplied = formatJobId ? `&applyjob=${formatJobId}` : "";
      const {
        sortBy,
        salaryEstimate,
        jobType,
        workType,
        closeDate,
        keyword,
      } = filters;

      const userfilters = {
        sort: sortBy,
        salary: salaryEstimate,
        jobtype: jobType,
        worktype: workType,
        closedate: closeDate,
        keyword,
        location: appData.location,
      };
      const queryParams = prepareURLQuery(userfilters);
      window.location = `${
        urls.Recruit
      }/signup?service=findjobs${isJobApplied}&${queryParams}`;
    }
  }

  saveJob(id, data) {
    const { appData, post, saveUserJob, cookie } = this.props;
    if (!appData.isLogged && !appData.isModalOpen) {
      document.body.classList.add("modal-open");
      const jobNameURL = prepareURLName({
        title: data.title || data.j_title,
        company: data.company || data.company_name,
      });
      Router.push(
        `/job?id=${post.j_id}&name=${jobNameURL}&signup=true&type=save`,
        `/job/${post.j_id}/${jobNameURL}`
      );
    } else {
      const prepSave = {
        logo: data.logo,
        company: data.company || data.company_name,
        title: data.title || data.j_title,
        id: parseInt(id, 10),
        close_date: data.close_date || data.closing_date,
        timestamp: moment().toISOString(),
        is_saved: data.is_saved,
        is_applied: data.is_applied,
        in_progress: data.inprogress || data.in_progress,
        apply_link: data.applylink || data.apply_link || data.applyLink,
      };
      saveUserJob(cookie, id, prepSave);
    }
  }

  removeJob(id) {
    const { appData, removeUserJob, cookie } = this.props;
    if (!appData.isLogged && appData.user) {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true });
      // Router.push(`/?signUp=${id}`, `/signUp?id=${id}`);
    } else {
      confirmAlert({
        customUI: ({ onClose }) => (
          <div className="confirm-popup-wrapper">
            <div className="popup-content">
              <div className="popup-header">
                <h1>Remove Saved Job</h1>
              </div>
              <div className="popup-body">
                <p>
                  Are you sure you want to remove this job from your saved jobs?
                </p>
              </div>
              <div className="popup-footer text-right">
                <button onClick={onClose} className="btn cancel-button large">
                  Cancel
                </button>
                <button
                  className="btn confirm-button large"
                  onClick={() => {
                    removeUserJob(cookie, id);
                    onClose();
                  }}
                >
                  Yes, Remove
                </button>
              </div>
            </div>
          </div>
        ),
        closeOnClickOutside: true,
        closeOnEscape: true,
      });
    }
  }

  withdrawJob = (e, id) => {
    const {
      appData,
      withdrawUnnanuJob,
      cookie,
    } = this.props;

    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
    }

    if (!appData.isLogged && appData.user) {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true });
    } else{
      confirmAlert({
        customUI: ({onClose}) => (
          <div className="confirm-popup-wrapper">
            <div className="popup-content">
              <div className="popup-header">
                <h1>Withdraw Application</h1>
              </div>
              <div className="popup-body">
                <p>
                  Are you sure you want to withdraw your application for this job?
                </p>
                <p
                  style={{
                    color: "#FF7F7F",
                    marginTop: "10px",
                    fontSize: "14px",
                  }}
                >
                  Note: This action cannot be undone. The employer will be
                  notified of your withdrawal.
                </p>
              </div>
              <div className="popup-footer text-right">
                <button onClick={onClose} className="btn cancel-button large">
                  Cancel
                </button>
                <button
                  className="btn confirm-button large"
                  onClick={() => {
                        withdrawUnnanuJob(cookie, id);
                        onClose();
                    }
                  }
                >
                  Yes, Withdraw
                </button>
              </div>
            </div>
          </div>
        ),
        closeOnClickOutside: true,
        closeOnEscape: true,
      });
    }
  };

  checkIfSave = (id) => {
    const {savedJobs} = this.props;
    if (savedJobs) {
      return savedJobs.find(job => job.id == id);
    }
    return false;
  };

  checkIfApplied = (id) => {
    const {appliedJobs} = this.props;
    if (appliedJobs) {
      return appliedJobs.find(job => job.id == id);
    }
    return false;
  };

  async viewMoreCompany(e, company) {
    e.preventDefault();
    const { appData, filters } = this.props;
    await this.props.storeKeyword(company, true);

    const {
      sortBy,
      salaryEstimate,
      jobType,
      workType,
      closeDate,
      keyword,
    } = filters;
    const userfilters = {
      sort: sortBy,
      salary: salaryEstimate,
      jobtype: jobType,
      worktype: workType,
      closedate: closeDate,
      keyword: company,
      location: appData.location,
    };
    const queryParams = prepareURLQuery(userfilters);
    Router.push(`/?${queryParams}`).then(() => window.scrollTo(0, 0));
  }

  async goBack(e) {
    e.preventDefault();
    const { filters } = this.props;
    // if ( === undefined) {
    //   Router.push(`/`).then(() => window.scrollTo(0, 0));
    // }
    const cookies = parseCookies();
    const cookeieFilters = JSON.parse(cookies.filters || "null");
    if (cookeieFilters === undefined) {
      Router.push(`/`).then(() => window.scrollTo(0, 0));
    } else {
      const {
        sortBy,
        salaryEstimate,
        jobType,
        workType,
        closeDate,
        keyword,
        location,
      } = cookeieFilters;
      const userfilters = {
        sort: sortBy,
        salary: salaryEstimate,
        jobtype: jobType,
        worktype: workType,
        closedate: closeDate,
        keyword,
        location,
      };
      const queryParams = prepareURLQuery(userfilters);
      Router.push(`/?${queryParams}`).then(() => window.scrollTo(0, 0));
    }
  }

  dismissModal() {
    const { url, popupShowHide } = this.props;
    Router.push(
      `/job?id=${url.query.id}&name=${url.query.name}&signup=false`,
      `/job/${url.query.id}/${url.query.name}`
    ).then(() => {
      popupShowHide(false);
      document.body.classList.remove("modal-open");
    });
  }

  render() {
    const {
      url,
      post,
      similarJobs = [],
      showMoreJobs,
      appData,
      isJobExpired,
      isJobApplied,
      deviceInfo,
    } = this.props;
    const { id } = url.query;

    const modalJob = post;

    // job type data
    let terms = [];
    let types = [];
    let jobWorkTypes = [];

    let addressLocality;
    let addressRegion;
    let locArray = [];

    if (modalJob.job_type_array_facet) {
      modalJob.job_type_array_facet.map((item) => {
        const type = item.split(" ");
        terms.push(type[0] === "Full" ? "Full time" : "Part time");
        types.push(type[2].replace(/[()]/g, ""));
      });
    }

    if (modalJob.job_schd_facet) {
      modalJob.job_schd_facet.map((item) => {
        const type = item.split(" - ");
        jobWorkTypes.push(type[1]);
      });
    }

    if (modalJob.location) {
      locArray = modalJob.location.split(",");
      addressLocality = locArray[0];
      addressRegion = locArray[1];
    }

    terms = [...new Set(terms)];
    types = [...new Set(types)];
    jobWorkTypes = [...new Set(jobWorkTypes)];

    const termsList = terms.map((item, key) => (
      <span key={key} className="tag">
        {item}
      </span>
    ));

    const typesList = types.map((item, key) => (
      <span key={key} className="tag">
        {item}
      </span>
    ));

    const workList = jobWorkTypes.map((item, key) => (
      <span key={key} className="tag">
        {item}
      </span>
    ));

    const fullyRemote =
      jobWorkTypes.length === 1 && jobWorkTypes[0] === "Remote";

    const employmentTypes = terms.concat(types);

    const employmentTypeList = employmentTypes.map((element) => {
      switch (element.toLowerCase()) {
        case "full time":
          return "FULL_TIME";
        case "part time":
          return "PART_TIME";
        case "contract":
          return "CONTRACTOR";
        case "intern":
          return "INTERN";
        case "volunteer":
          return "VOLUNTEER";
        case "employee":
        default:
          return "OTHER";
      }
    });

    const similarJobsList = this.formatSimilarJobs(
      this.getOtherSimilarJobs(modalJob.j_id)
    );
    const pageTitle = `${modalJob.j_title} job opening at ${
      modalJob.company_name
    }`;
    const jobNameURL = prepareURLName({
      title: modalJob.j_title,
      company: modalJob.company_name,
    });
    // const jobNameURL = "UJID";
    const shareObject = {
      title: modalJob.j_title,
      company: modalJob.company_name,
      url: `${urls.BaseURL}/job/${modalJob.j_id}/${jobNameURL}`,
    };

    const isSaved = this.checkIfSave(modalJob.j_id);
    const isApplied = this.checkIfApplied(modalJob.j_id);
    let applyBtnText = isJobApplied ? "Applied" : "Apply now";
    if (isJobExpired) {
      applyBtnText = "Expired";
    }

    let jobListSide;
    if (isSaved) {
      jobListSide = (
        <JobsList
          heading="Other saved jobs"
          jobs={this.getOtherSavedJobs(modalJob.j_id)}
          isPopup={false}
        />
      );
    } else {
      jobListSide = (
        <JobsList
          heading="Similar Jobs"
          jobs={similarJobsList}
          isPopup={false}
        />
      );
    }

    const subject = `Apply here for a ${shareObject.title} job opening at ${
      shareObject.company
    }`;
    const description = `You might want to take a look at this ${
      shareObject.title
    } job opening at ${shareObject.company}`;

    const shareWidgetCSS = classNames({
      widget: true,
      "widget-disabled": isJobExpired,
    });

    return (
      <Layout
        deviceInfo={deviceInfo}
        showSearch={false}
        title={pageTitle}
        userData={appData}
        fburl={shareObject.url}
        fbtitle={subject}
        fbdescription={description}
      >
        <div className="single-job-container container">
          <div className="popup-wrapper single-job-back">
            <a href="/" onClick={(e) => this.goBack(e)}>
              <button className="btn back-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                >
                  <path
                    fill="#317EFF"
                    fillRule="nonzero"
                    d="M17 9.562H4.037l5.95 5.95L8.5 17 0 8.5 8.5 0l1.487 1.488-5.95 5.95H17z"
                  />
                </svg>
                Browse more jobs
              </button>
            </a>
          </div>
          <div
            className="popup-wrapper"
            itemScope
            itemType="http://schema.org/JobPosting"
            role="main"
          >
            <meta itemProp="url" content={shareObject.url} />
            <div className="popup-content">
              <div className="popup-header">
                <div className="logo">
                  <img
                    alt={modalJob.company_name}
                    src={imageURL(modalJob.logo)}
                  />
                </div>
                <div className="header-content">
                  <h1 itemProp="title">{modalJob.j_title}</h1>
                  {/* {((appData.isLogged && appData.token && appData.user) && jobScore) && */}
                  {/*   <span style={{float:"right"}}> */}
                  {/*  <JobScore value={jobScore} /> */}
                  {/*   </span> */}
                  {/* } */}
                  <div className="job-company-location">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="10"
                      height="14"
                      viewBox="0 0 10 14"
                    >
                      <g fill="#000" fillRule="nonzero" opacity=".2">
                        <path d="M8.607 12.665H.464a.464.464 0 1 0 0 .93h8.143a.464.464 0 1 0 0-.93zM8.607.506a.464.464 0 0 0-.465-.464H.93a.464.464 0 0 0-.464.464v11.722h8.142V.506zm-4.973 8.58h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm2.705 5.41h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929z" />
                      </g>
                    </svg>
                    <span
                      itemProp="hiringOrganization"
                      itemScope
                      itemType="http://schema.org/Organization"
                    >
                      <span itemProp="name">{`${modalJob.company_name}`}</span>
                      <meta itemProp="logo" content={imageURL(modalJob.logo)} />
                    </span>
                    <span>
                      <span> · </span>
                      <span />
                      <span
                        itemProp="jobLocation"
                        itemScope
                        itemType="http://schema.org/Place"
                      >
                        <span
                          itemProp="address"
                          itemScope
                          itemType="http://schema.org/PostalAddress"
                        >
                          <span itemProp="addressLocality">
                            {addressLocality}
                          </span>
                          ,<span itemProp="addressRegion">{addressRegion}</span>
                          <meta itemProp="addressCountry" content="USA" />
                        </span>
                      </span>
                      {isValidDate(modalJob.closing_date) && (
                        <span style={{float: "right"}}>
                        Close:{" "}
                          <Moment format="MMM Do YYYY">
                            {modalJob.closing_date}
                          </Moment>
                        </span>
                      )}
                    </span>
                  </div>
                  {modalJob.salary_annually !== 0 && (
                    <div className="job-salary-range">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                      >
                        <path
                          fill="#000"
                          fillRule="nonzero"
                          d="M6.006 11.954A5.966 5.966 0 1 0 6.005.022a5.966 5.966 0 0 0 0 11.932zm-2.083-3.6c.052-.196.11-.392.167-.589.07-.225.133-.253.34-.144.353.185.728.289 1.126.335.254.029.502.006.738-.098.439-.19.508-.698.139-1.004a1.925 1.925 0 0 0-.421-.248c-.387-.168-.785-.3-1.149-.514-.588-.352-.963-.836-.917-1.552.052-.807.508-1.315 1.252-1.586.306-.11.306-.11.312-.427v-.323c.005-.242.046-.283.288-.289h.225c.514 0 .514 0 .514.514 0 .363 0 .363.363.421.277.04.542.127.796.237.139.063.196.161.15.311-.063.22-.127.444-.196.664-.07.207-.133.236-.335.138a2.45 2.45 0 0 0-1.263-.248.937.937 0 0 0-.335.07c-.38.166-.444.588-.12.847.16.133.351.225.547.306.34.138.681.277.998.45 1.021.565 1.298 1.852.577 2.723-.26.317-.6.53-.992.635-.173.046-.248.138-.242.317.005.173 0 .352 0 .53 0 .157-.081.243-.237.243-.19.006-.38.006-.571 0-.167-.006-.242-.098-.248-.26 0-.126 0-.26-.006-.386-.006-.283-.011-.294-.283-.34-.352-.058-.692-.133-1.01-.289-.253-.121-.276-.185-.207-.444z"
                          opacity=".2"
                        />
                      </svg>
                      <span>
                        {this.composeSalaryRange(
                          modalJob.salary_type,
                          modalJob
                        )}
                      </span>
                      <div
                        itemProp="baseSalary"
                        itemScope
                        itemType="http://schema.org/MonetaryAmount"
                        style={{ display: "none" }}
                      >
                        <meta itemProp="currency" content="USD" />
                        {this.composeSalaryMaxValue(
                          modalJob.salary_type,
                          modalJob
                        ) !== 0 ? (
                          <div
                            itemProp="value"
                            itemScope
                            itemType="http://schema.org/QuantitativeValue"
                          >
                            <meta
                              itemProp="minValue"
                              content={this.composeSalaryMinValue(
                                modalJob.salary_type,
                                modalJob
                              )}
                            />
                            <meta
                              itemProp="maxValue"
                              content={this.composeSalaryMaxValue(
                                modalJob.salary_type,
                                modalJob
                              )}
                            />
                            <meta
                              itemProp="unitText"
                              content={this.composeSalaryUnitText(
                                modalJob.salary_type,
                                modalJob
                              )}
                            />
                          </div>
                        ) : (
                          <div>
                            <meta
                              itemProp="value"
                              content={this.composeSalaryMinValue(
                                modalJob.salary_type,
                                modalJob
                              )}
                            />
                            <meta
                              itemProp="unitText"
                              content={this.composeSalaryUnitText(
                                modalJob.salary_type,
                                modalJob
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <meta itemProp="directApply" content="true" />
                  <div className="term-type-wrapper">
                    <div className="term-type d-flex">
                      <span className="label">Term:</span>
                      {termsList}
                      <span className="label" style={{ marginLeft: "15px" }}>
                        Work:
                      </span>
                      {workList}
                      {fullyRemote && (
                        <>
                          <span
                            itemProp="applicantLocationRequirements"
                            itemScope
                            itemType="http://schema.org/Country"
                            style={{ display: "none" }}
                          >
                            <meta itemProp="name" content="USA" />
                          </span>
                          <meta
                            itemProp="jobLocationType"
                            content="TELECOMMUTE"
                          />
                        </>
                      )}
                    </div>
                    <div className="term-type d-flex">
                      <span className="label">Type:</span>
                      {typesList}
                    </div>
                    <meta
                      itemProp="employmentType"
                      content={employmentTypeList}
                    />
                  </div>
                  {modalJob.is_video_required && (
                    <div className="profile-video-required">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="10"
                        viewBox="0 0 17 10"
                      >
                        <path
                          fill="#000"
                          fillRule="nonzero"
                          d="M15.365.114c.444-.325.809-.147.809.395v8.88c0 .543-.364.721-.809.396L12.94 8.008c-.444-.326-.809-1.036-.809-1.578V3.47c0-.543.365-1.253.809-1.579L15.365.114zM11.12 2.483v5.92a.998.998 0 0 1-1.011.987H1.01A.998.998 0 0 1 0 8.403V1.496A.998.998 0 0 1 1.01.51h9.098a.999.999 0 0 1 1.012.987v.987zM4.043 6.43a.998.998 0 0 0-1.01-.987.998.998 0 0 0-1.011.987c0 .545.452.986 1.01.986a.998.998 0 0 0 1.011-.986z"
                          opacity=".3"
                        />
                      </svg>
                      Profile video required
                    </div>
                  )}
                </div>
              </div>
              <div className="ui-actions-wrapper-mobile">
                <ApplyButton
                  submitting={false}
                  text={applyBtnText}
                  btnType="submit"
                  btnState={!isJobApplied ? "apply" : "applied"}
                  size="large"
                  handleClick={
                    !isJobApplied
                      ? () => this.applyJob(modalJob.j_id, modalJob)
                      : null
                  }
                  disabled={isJobExpired}
                />
                <div className="widget">
                  <div className="widget-share">
                    <div className="widget-share-mobile-header">
                      <div className="share-title-mobile">Share</div>
                      <div className="share-platforms">
                        <a
                          target={!isJobExpired ? "_blank" : "_self"}
                          href={
                            !isJobExpired ? prepareEmailData(shareObject) : "#"
                          }
                          className="platform-button"
                          rel="noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="13"
                            viewBox="0 0 17 13"
                          >
                            <g fill="#777" fillRule="nonzero">
                              <path d="M1.63 4.024c.215.147.863.584 1.944 1.312 1.08.727 1.908 1.288 2.483 1.68.064.044.198.137.403.282.206.144.376.26.512.35.136.089.3.188.493.299a2.9 2.9 0 0 0 .545.248c.171.056.329.083.474.083h.02c.145 0 .303-.027.473-.083.171-.055.353-.138.545-.248.193-.11.357-.21.493-.3.136-.088.307-.205.512-.35l.403-.28 4.437-2.994a4.44 4.44 0 0 0 1.156-1.132c.31-.442.465-.906.465-1.39 0-.406-.15-.753-.45-1.042A1.487 1.487 0 0 0 15.47.026H1.517c-.487 0-.861.16-1.124.48C.131.824 0 1.223 0 1.702c0 .386.174.806.521 1.257.348.451.718.806 1.11 1.064z" />
                              <path d="M16.04 5.009a197.266 197.266 0 0 0-4.721 3.177c-.36.258-.653.46-.877.604a5.472 5.472 0 0 1-.896.442c-.373.15-.72.225-1.043.225h-.019c-.322 0-.67-.075-1.042-.225a5.475 5.475 0 0 1-.896-.442 22.463 22.463 0 0 1-.877-.604C4.816 7.58 3.245 6.52.958 5.01c-.36-.233-.68-.5-.958-.801v7.312c0 .406.148.752.446 1.04.297.29.654.434 1.07.434h13.955c.417 0 .774-.144 1.071-.433.297-.289.446-.635.446-1.04V4.207a5.186 5.186 0 0 1-.948.8z" />
                            </g>
                          </svg>
                        </a>
                        <a
                          target={!isJobExpired ? "_blank" : "_self"}
                          href={
                            !isJobExpired
                              ? prepareLinkedinData(shareObject.url)
                              : "#"
                          }
                          className="platform-button"
                          rel="noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fill="#777"
                              fillRule="nonzero"
                              d="M14.788 0H1.18C.528 0 0 .512 0 1.144v13.679c0 .632.528 1.144 1.18 1.144h13.608c.652 0 1.18-.513 1.18-1.144V1.144C15.967.512 15.44 0 14.787 0zM4.841 13.366H2.428v-7.21h2.413v7.21zM3.635 5.172h-.016c-.81 0-1.334-.553-1.334-1.246 0-.707.54-1.245 1.365-1.245s1.333.538 1.349 1.245c0 .693-.524 1.246-1.364 1.246zm9.902 8.194h-2.412V9.509c0-.97-.349-1.63-1.221-1.63-.667 0-1.063.445-1.237.876-.065.154-.08.369-.08.584v4.027H6.174s.032-6.533 0-7.21h2.412V7.18c.32-.492.892-1.192 2.173-1.192 1.587 0 2.777 1.03 2.777 3.245v4.134zM8.571 7.24c.011-.018.027-.04.042-.061v.061h-.042z"
                            />
                          </svg>
                        </a>
                        <a
                          target={!isJobExpired ? "_blank" : "_self"}
                          href={
                            !isJobExpired ? prepareFBData(shareObject.url) : "#"
                          }
                          className="platform-button"
                          rel="noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="9"
                            height="16"
                            viewBox="0 0 9 16"
                          >
                            <path
                              fill="#777"
                              fillRule="nonzero"
                              d="M8.262.003L6.206 0c-2.31 0-3.803 1.532-3.803 3.902v1.8H.336a.323.323 0 0 0-.323.323V8.63c0 .179.145.324.323.324h2.067v6.577c0 .179.145.323.324.323h2.697a.323.323 0 0 0 .323-.323V8.955h2.417a.323.323 0 0 0 .324-.324V6.025a.324.324 0 0 0-.323-.324H5.747V4.176c0-.733.175-1.105 1.13-1.105h1.385a.323.323 0 0 0 .323-.324V.327a.323.323 0 0 0-.323-.324z"
                            />
                          </svg>
                        </a>
                        <a
                          target={!isJobExpired ? "_blank" : "_self"}
                          href={
                            !isJobExpired ? prepareTweetData(shareObject) : "#"
                          }
                          className="platform-button"
                          rel="noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="14"
                            viewBox="0 0 18 14"
                          >
                            <path
                              fill="#777"
                              fillRule="nonzero"
                              d="M18 1.656a7.63 7.63 0 0 1-2.12.557A3.582 3.582 0 0 0 17.503.258a7.647 7.647 0 0 1-2.347.859A3.76 3.76 0 0 0 12.461 0C10.422 0 8.77 1.583 8.77 3.535c0 .277.032.547.095.805-3.068-.147-5.789-1.555-7.61-3.694a3.396 3.396 0 0 0-.5 1.777c0 1.227.653 2.31 1.643 2.943a3.818 3.818 0 0 1-1.673-.444v.044c0 1.712 1.274 3.142 2.962 3.467-.31.08-.636.124-.973.124-.238 0-.47-.023-.695-.066.47 1.406 1.833 2.428 3.448 2.456a7.62 7.62 0 0 1-4.585 1.51c-.298 0-.592-.017-.881-.048A10.776 10.776 0 0 0 5.66 14c6.793 0 10.505-5.387 10.505-10.06l-.012-.457A7.21 7.21 0 0 0 18 1.656z"
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                    <div className="share-url input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={shareObject.url}
                        readOnly
                        disabled={isJobExpired}
                      />
                      <div className="input-group-append">
                        <CopyToClipboard
                          text={shareObject.url}
                          onCopy={this.onCopy}
                        >
                          <button className="btn" disabled={isJobExpired}>
                            <svg
                              width="12px"
                              height="14px"
                              viewBox="0 0 12 14"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g
                                id="JobB"
                                stroke="none"
                                strokeWidth="1"
                                fill="none"
                                fillRule="evenodd"
                                opacity="1"
                              >
                                <g
                                  id="un-jobpage-job-board---job-post---expired"
                                  transform="translate(-1134.000000, -396.000000)"
                                  fill="#317EFF"
                                  fillRule="nonzero"
                                >
                                  <g
                                    id="jobpost"
                                    transform="translate(246.000000, 152.000000)"
                                  >
                                    <g
                                      id="share"
                                      transform="translate(715.000000, 171.000000)"
                                    >
                                      <g
                                        id="Rectangle-7-+-https://talent.unnanu.com/A-Mask"
                                        transform="translate(0.000000, 63.000000)"
                                      >
                                        <g
                                          id="copy"
                                          transform="translate(173.000000, 10.000000)"
                                        >
                                          <path
                                            d="M8.1505102,2.44498978 L1.20153061,2.44498978 C0.549489796,2.44498978 0.0198979592,2.9402863 0.0198979592,3.55010225 L0.0198979592,12.8748466 C0.0198979592,13.4846626 0.549489796,13.9799591 1.20153061,13.9799591 L8.1505102,13.9799591 C8.80255102,13.9799591 9.33214286,13.4846626 9.33214286,12.8748466 L9.33214286,3.55010225 C9.32908163,2.9402863 8.7994898,2.44498978 8.1505102,2.44498978 Z M8.50255102,12.8719836 C8.50255102,13.0552147 8.34336735,13.20409 8.14744898,13.20409 L1.19846939,13.20409 C1.00255102,13.20409 0.843367347,13.0552147 0.843367347,12.8719836 L0.843367347,3.55010225 C0.843367347,3.36687117 1.00255102,3.21799591 1.19846939,3.21799591 L8.14744898,3.21799591 C8.34336735,3.21799591 8.50255102,3.36687117 8.50255102,3.55010225 L8.50255102,12.8719836 Z"
                                            id="Shape"
                                          />
                                          <path
                                            d="M10.8076531,0 L3.85867347,0 C3.20663265,0 2.67704082,0.495296524 2.67704082,1.10511247 C2.67704082,1.3198364 2.86071429,1.49161554 3.09030612,1.49161554 C3.31989796,1.49161554 3.50357143,1.3198364 3.50357143,1.10511247 C3.50357143,0.921881391 3.6627551,0.773006135 3.85867347,0.773006135 L10.8076531,0.773006135 C11.0035714,0.773006135 11.1627551,0.921881391 11.1627551,1.10511247 L11.1627551,10.4298569 C11.1627551,10.6130879 11.0035714,10.7619632 10.8076531,10.7619632 C10.5780612,10.7619632 10.3943878,10.9337423 10.3943878,11.1484663 C10.3943878,11.3631902 10.5780612,11.5349693 10.8076531,11.5349693 C11.4596939,11.5349693 11.9892857,11.0396728 11.9892857,10.4298569 L11.9892857,1.10511247 C11.9892857,0.495296524 11.4596939,0 10.8076531,0 Z"
                                            id="Shape"
                                          />
                                        </g>
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </button>
                        </CopyToClipboard>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="popup-body" itemProp="description">
                {renderHTML(modalJob.text)}
              </div>
              <hr />
              <div className="job-post-footer">
                <meta itemProp="datePosted" content={modalJob.updated_time} />
                <meta itemProp="validThrough" content={modalJob.closing_date} />
                <div className="job-post-timestamp">
                  Updated on{" "}
                  <Moment format="LL">{modalJob.updated_time}</Moment>
                </div>
                {showMoreJobs !== 0 && (
                  <a
                    href="#"
                    onClick={(e) =>
                      this.viewMoreCompany(e, modalJob.company_name)
                    }
                    className="more-job-posts"
                  >
                    View other open positions at {modalJob.company_name}
                  </a>
                )}
              </div>
            </div>
            <div className="popup-sidebar">
              {isApplied && !isJobExpired ? (
                <SubmitButton
                  submitting={false}
                  text='Withdraw'
                  btnType="submit"
                  btnState='withdraw'
                  size="large"
                  handleClick={(e) => this.withdrawJob(e, modalJob.j_id)}
                />
              ) : (
                <ApplyButton
                  submitting={false}
                  text={applyBtnText}
                  btnType="submit"
                  btnState={!isJobApplied ? "apply" : "applied"}
                  size="large"
                  handleClick={
                    !isJobApplied
                      ? () => this.applyJob(modalJob.j_id, modalJob)
                      : null
                  }
                  disabled={isJobExpired}
                />
              )}
              <SubmitButton
                submitting={false}
                text={isSaved ? "Saved" : "Save"}
                btnType="submit"
                size="large"
                btnState={isSaved ? "saved" : "save"}
                handleClick={
                  isSaved
                    ? () => this.removeJob(id)
                    : () => this.saveJob(id, modalJob)
                }
                disabled={isJobExpired && !isSaved}
              />

              <div className={shareWidgetCSS}>
                <label className="widget-title">Share</label>
                <div className="widget-share">
                  <div className="share-platforms">
                    <a
                      target={!isJobExpired ? "_blank" : "_self"}
                      href={!isJobExpired ? prepareEmailData(shareObject) : "#"}
                      className="platform-button"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="13"
                        viewBox="0 0 17 13"
                      >
                        <g fill="#777" fillRule="nonzero">
                          <path d="M1.63 4.024c.215.147.863.584 1.944 1.312 1.08.727 1.908 1.288 2.483 1.68.064.044.198.137.403.282.206.144.376.26.512.35.136.089.3.188.493.299a2.9 2.9 0 0 0 .545.248c.171.056.329.083.474.083h.02c.145 0 .303-.027.473-.083.171-.055.353-.138.545-.248.193-.11.357-.21.493-.3.136-.088.307-.205.512-.35l.403-.28 4.437-2.994a4.44 4.44 0 0 0 1.156-1.132c.31-.442.465-.906.465-1.39 0-.406-.15-.753-.45-1.042A1.487 1.487 0 0 0 15.47.026H1.517c-.487 0-.861.16-1.124.48C.131.824 0 1.223 0 1.702c0 .386.174.806.521 1.257.348.451.718.806 1.11 1.064z" />
                          <path d="M16.04 5.009a197.266 197.266 0 0 0-4.721 3.177c-.36.258-.653.46-.877.604a5.472 5.472 0 0 1-.896.442c-.373.15-.72.225-1.043.225h-.019c-.322 0-.67-.075-1.042-.225a5.475 5.475 0 0 1-.896-.442 22.463 22.463 0 0 1-.877-.604C4.816 7.58 3.245 6.52.958 5.01c-.36-.233-.68-.5-.958-.801v7.312c0 .406.148.752.446 1.04.297.29.654.434 1.07.434h13.955c.417 0 .774-.144 1.071-.433.297-.289.446-.635.446-1.04V4.207a5.186 5.186 0 0 1-.948.8z" />
                        </g>
                      </svg>
                    </a>
                    <a
                      target={!isJobExpired ? "_blank" : "_self"}
                      href={
                        !isJobExpired
                          ? prepareLinkedinData(shareObject.url)
                          : "#"
                      }
                      className="platform-button"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill="#777"
                          fillRule="nonzero"
                          d="M14.788 0H1.18C.528 0 0 .512 0 1.144v13.679c0 .632.528 1.144 1.18 1.144h13.608c.652 0 1.18-.513 1.18-1.144V1.144C15.967.512 15.44 0 14.787 0zM4.841 13.366H2.428v-7.21h2.413v7.21zM3.635 5.172h-.016c-.81 0-1.334-.553-1.334-1.246 0-.707.54-1.245 1.365-1.245s1.333.538 1.349 1.245c0 .693-.524 1.246-1.364 1.246zm9.902 8.194h-2.412V9.509c0-.97-.349-1.63-1.221-1.63-.667 0-1.063.445-1.237.876-.065.154-.08.369-.08.584v4.027H6.174s.032-6.533 0-7.21h2.412V7.18c.32-.492.892-1.192 2.173-1.192 1.587 0 2.777 1.03 2.777 3.245v4.134zM8.571 7.24c.011-.018.027-.04.042-.061v.061h-.042z"
                        />
                      </svg>
                    </a>
                    <a
                      target={!isJobExpired ? "_blank" : "_self"}
                      href={
                        !isJobExpired ? prepareFBData(shareObject.url) : "#"
                      }
                      className="platform-button"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="16"
                        viewBox="0 0 9 16"
                      >
                        <path
                          fill="#777"
                          fillRule="nonzero"
                          d="M8.262.003L6.206 0c-2.31 0-3.803 1.532-3.803 3.902v1.8H.336a.323.323 0 0 0-.323.323V8.63c0 .179.145.324.323.324h2.067v6.577c0 .179.145.323.324.323h2.697a.323.323 0 0 0 .323-.323V8.955h2.417a.323.323 0 0 0 .324-.324V6.025a.324.324 0 0 0-.323-.324H5.747V4.176c0-.733.175-1.105 1.13-1.105h1.385a.323.323 0 0 0 .323-.324V.327a.323.323 0 0 0-.323-.324z"
                        />
                      </svg>
                    </a>
                    <a
                      target={!isJobExpired ? "_blank" : "_self"}
                      href={!isJobExpired ? prepareTweetData(shareObject) : "#"}
                      className="platform-button"
                      rel="noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="14"
                        viewBox="0 0 18 14"
                      >
                        <path
                          fill="#777"
                          fillRule="nonzero"
                          d="M18 1.656a7.63 7.63 0 0 1-2.12.557A3.582 3.582 0 0 0 17.503.258a7.647 7.647 0 0 1-2.347.859A3.76 3.76 0 0 0 12.461 0C10.422 0 8.77 1.583 8.77 3.535c0 .277.032.547.095.805-3.068-.147-5.789-1.555-7.61-3.694a3.396 3.396 0 0 0-.5 1.777c0 1.227.653 2.31 1.643 2.943a3.818 3.818 0 0 1-1.673-.444v.044c0 1.712 1.274 3.142 2.962 3.467-.31.08-.636.124-.973.124-.238 0-.47-.023-.695-.066.47 1.406 1.833 2.428 3.448 2.456a7.62 7.62 0 0 1-4.585 1.51c-.298 0-.592-.017-.881-.048A10.776 10.776 0 0 0 5.66 14c6.793 0 10.505-5.387 10.505-10.06l-.012-.457A7.21 7.21 0 0 0 18 1.656z"
                        />
                      </svg>
                    </a>
                  </div>
                  <div className="share-url input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={shareObject.url}
                      readOnly
                      disabled={isJobExpired}
                    />
                    <div className="input-group-append">
                      <CopyToClipboard
                        text={shareObject.url}
                        onCopy={this.onCopy}
                      >
                        <button className="btn" disabled={isJobExpired}>
                          <svg
                            width="12px"
                            height="14px"
                            viewBox="0 0 12 14"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g
                              id="JobB"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
                              opacity="1"
                            >
                              <g
                                id="un-jobpage-job-board---job-post---expired"
                                transform="translate(-1134.000000, -396.000000)"
                                fill="#317EFF"
                                fillRule="nonzero"
                              >
                                <g
                                  id="jobpost"
                                  transform="translate(246.000000, 152.000000)"
                                >
                                  <g
                                    id="share"
                                    transform="translate(715.000000, 171.000000)"
                                  >
                                    <g
                                      id="Rectangle-7-+-https://talent.unnanu.com/A-Mask"
                                      transform="translate(0.000000, 63.000000)"
                                    >
                                      <g
                                        id="copy"
                                        transform="translate(173.000000, 10.000000)"
                                      >
                                        <path
                                          d="M8.1505102,2.44498978 L1.20153061,2.44498978 C0.549489796,2.44498978 0.0198979592,2.9402863 0.0198979592,3.55010225 L0.0198979592,12.8748466 C0.0198979592,13.4846626 0.549489796,13.9799591 1.20153061,13.9799591 L8.1505102,13.9799591 C8.80255102,13.9799591 9.33214286,13.4846626 9.33214286,12.8748466 L9.33214286,3.55010225 C9.32908163,2.9402863 8.7994898,2.44498978 8.1505102,2.44498978 Z M8.50255102,12.8719836 C8.50255102,13.0552147 8.34336735,13.20409 8.14744898,13.20409 L1.19846939,13.20409 C1.00255102,13.20409 0.843367347,13.0552147 0.843367347,12.8719836 L0.843367347,3.55010225 C0.843367347,3.36687117 1.00255102,3.21799591 1.19846939,3.21799591 L8.14744898,3.21799591 C8.34336735,3.21799591 8.50255102,3.36687117 8.50255102,3.55010225 L8.50255102,12.8719836 Z"
                                          id="Shape"
                                        />
                                        <path
                                          d="M10.8076531,0 L3.85867347,0 C3.20663265,0 2.67704082,0.495296524 2.67704082,1.10511247 C2.67704082,1.3198364 2.86071429,1.49161554 3.09030612,1.49161554 C3.31989796,1.49161554 3.50357143,1.3198364 3.50357143,1.10511247 C3.50357143,0.921881391 3.6627551,0.773006135 3.85867347,0.773006135 L10.8076531,0.773006135 C11.0035714,0.773006135 11.1627551,0.921881391 11.1627551,1.10511247 L11.1627551,10.4298569 C11.1627551,10.6130879 11.0035714,10.7619632 10.8076531,10.7619632 C10.5780612,10.7619632 10.3943878,10.9337423 10.3943878,11.1484663 C10.3943878,11.3631902 10.5780612,11.5349693 10.8076531,11.5349693 C11.4596939,11.5349693 11.9892857,11.0396728 11.9892857,10.4298569 L11.9892857,1.10511247 C11.9892857,0.495296524 11.4596939,0 10.8076531,0 Z"
                                          id="Shape"
                                        />
                                      </g>
                                    </g>
                                  </g>
                                </g>
                              </g>
                            </g>
                          </svg>
                        </button>
                      </CopyToClipboard>
                    </div>
                  </div>
                </div>
              </div>

              <hr className="seperator" />

              {jobListSide}
            </div>
          </div>
          {url.query.signup && url.query.type && (
            <Modal
              id={`signup-${url.query.id}`}
              onDismiss={() => this.dismissModal()}
              type="Signup"
              jobID={url.query.id}
              actionType={
                url.query.type === "apply" || url.query.type === "save"
                  ? url.query.type
                  : ""
              }
            />
          )}
        </div>

        <footer className="footer mt-auto">
          <div className="single-job-footer-container container">
            <div className="row d-flex justify-content-between">
              <div className="copyright">
                © {new Date().getFullYear()} Unnanu, Inc.
              </div>
              <div className="footer-links">
                <a
                  href={urls.Links.Terms}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Terms
                </a>{" "}
                · <a href={urls.Links.Privacy}>Privacy</a> ·{" "}
                <a
                  href={urls.Links.FAQ}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  FAQ
                </a>{" "}
                ·{" "}
                <a
                  href={urls.Links.About}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  About
                </a>
              </div>
            </div>
          </div>
        </footer>
      </Layout>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { app, posts } = state;

  return {
    appData: app,
    similarJobs: posts.similarJobs,
    token: app.token,
    showMoreJobs: posts.moreJobs,
    savedJobs: app.savedJobs,
    savedJobsList: app.savedJobsList,
    appliedJobs: app.appliedJobs,
    filters: posts.facets,
    isJobApplied: app.appliedJobs.includes(parseInt(ownProps.id, 10)),
  };
};

const mapDispatchToProps = (dispatch) => ({
  withdrawUnnanuJob: (token, jobId) =>
    dispatch(withdrawUnnanuJob(token, jobId)),
  fetchPostAction: (id) => dispatch(fetchPost(id)),
  fetchSimilarJobsAction: (id) => dispatch(fetchSimilarJobs(id)),
  popupShowHide: (data) => dispatch(showOrHidePopup(data)),
  checkCompanyJobs: (data) => dispatch(fetchMoreCompanyJobs(data)),
  storeKeyword: (keyword, isCompany) =>
    dispatch(setFilterKeyword(keyword, isCompany)),
  saveUserJob: (token, jobId, job) => dispatch(saveJob(token, jobId, job)),
  removeUserJob: (token, jobId) => dispatch(removeJob(token, jobId)),
  fetchProfile: (token) => dispatch(fetchUserProfile(token)),
  fetchSavedJobs: (token) => dispatch(fetchSavedJobs(token)),
  fetchAppliedJobs: (token) => dispatch(fetchAppliedJobs(token)),
  fetchSavedJobsList: (token) => dispatch(fetchSavedJobsList(token)),
  fetchNotifications: (token) => dispatch(fetchNotifications(token)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(Job)
);
