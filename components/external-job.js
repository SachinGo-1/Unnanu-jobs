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
import {
  fetchAppliedJobs,
  fetchSavedJobs,
  fetchSavedJobsList,
  fetchUserProfile,
  removeJob,
  saveJob,
  showOrHidePopup,
} from "store/app/actions";

import renderHTML from "react-render-html";
import Moment from "react-moment";
import api from "services/api";
import { parseCookies } from "nookies";

import {
  formatSalary,
  imageURL, isValidDate,
  prepareURLQuery,
} from "services/utils";
import LoadingCard from "./JobResults/loadingCard";

class Job extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jobData : {
        j_id:"",
        closing_date:"",
        j_title:"",
        company_name:"",
        logo:"",
        location:"",
        salary_hr_start:"",
        salary_hr_end:"",
        salary_type_text:"",
        text:"",
        apply_link:"",
        schd:"",
        is_saved:"",
        is_applied:false,
        in_progress:false,
        scoreper:0,
        matchscore:0,
      },
      pageLoading: true,
    }
  }

  componentDidMount() {
    this.getJobThroughApi();
  }

  getJobThroughApi = async() =>{
    const {appData, jobId, activeJobName, job} = this.props;
    try{
      const data = await api.fetchExternalJob(appData.token, jobId, activeJobName);
      if(data.data.Data === "No Match Data Found." || data.data.Data === null ){
        this.setState((prevState) => ({pageLoading:false, jobData:{...job}}))
      }
      this.setState((prevState) => ({
        pageLoading: false,
        jobData: {
          ...prevState.jobData, ...data.data.Data[0]
        }
      }))
    }
    catch(error){
      this.setState((prevState) => ({pageLoading:false, jobData:{...job}}))
    }
  };

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

  render() {
    const { onClose } = this.props;
    const modalJob = this.state.jobData

   const getFallbackDescription = (title, company) => (
     <div>
       <p>Sorry, we are unable to retrieve the job description for {title} at {company}. To view the full job description, we highly recommend clicking on the 'Job title' or the 'Apply now' button. This will redirect you to the original job posting where you can access the complete details.</p>
     </div>
     );


    // job type data
    let terms = [];
    let types = [];
    let jobWorkTypes = [];

    let addressLocality = "";
    let addressRegion = "";
    let locArray = [];

    if (
      modalJob.job_type_array_facet &&
      Array.isArray(modalJob.job_type_array_facet)
    ) {
      modalJob.job_type_array_facet.map((item) => {
        const type = item.split(" ");
        terms.push(type[0] === "Full" ? "Full time" : "Part time");
        types.push(type[2].replace(/[()]/g, ""));
      });
    }

    if (modalJob.job_schd_facet && Array.isArray(modalJob.job_schd_facet)) {
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

    return (
      // <Layout
      //   // deviceInfo={deviceInfo}
      //   showSearch={false}
      //   title={pageTitle}
      //   userData={appData}
      //   // fburl={shareObject.url}
      //   // fbtitle={subject}
      //   // fbdescription={description}
      // >
      // <main
      // style={{
      //   // height: "100vh", // Subtract header height
      //   // overflowY: "auto",
      //   // marginBottom: "15px", // Add margin for footer
      //   // paddingBottom: "15px", // Add padding for footer
      // }}
      // >
      <div className="single-job-container container">
        {this.state.pageLoading ? (<LoadingCard numberOfTimes={2} />) : (
          <div
            className="popup-wrapper"
            style={{
              // maxHeight: "850px",
              width: "100%",
              overflow: "scroll",
              height: "540px",
            }}
          >
            <div className="popup-close-button" onClick={onClose}>
              <svg width="40" height="40" viewBox="0 0 40 40">
                <g fill="none" fillRule="evenodd">
                  <circle cx="20" cy="20" r="20" fill="#FFF"/>
                  <circle cx="20" cy="20.8" r="12.8" fill="#777"/>
                  <path
                    fill="#FFF"
                    fillRule="nonzero"
                    d="M29.504 10.496c-5.46-5.461-14.347-5.462-19.808 0-5.462 5.461-5.461 14.347 0 19.808 5.46 5.461 14.347 5.461 19.808 0s5.461-14.347 0-19.808zm-4.38 15.427c-.421.421-1.103.421-1.524 0l-4-4-4.19 4.19a1.077 1.077 0 1 1-1.523-1.523l4.19-4.19-4-4a1.077 1.077 0 1 1 1.523-1.523l4 4 3.81-3.81a1.077 1.077 0 1 1 1.523 1.524l-3.81 3.809 4 4c.421.42.421 1.103 0 1.523z"
                  />
                </g>
              </svg>
            </div>
            <div className="popup-content">
              <div className="popup-header">
                <div className="logo">
                  <img
                    alt={modalJob.company_name}
                    src={imageURL(modalJob.logo)}
                  />
                </div>
                <div className="header-content">
                  <h1>{modalJob.j_title || modalJob.title}</h1>
                  {(modalJob.company_name ||
                    addressLocality ||
                    addressRegion) && (
                    <div className="job-company-location">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                      >
                        <g fill="#0</g>00" fillRule="nonzero" opacity=".2">
                          <path
                            d="M8.607 12.665H.464a.464.464 0 1 0 0 .93h8.143a.464.464 0 1 0 0-.93zM8.607.506a.464.464 0 0 0-.465-.464H.93a.464.464 0 0 0-.464.464v11.722h8.142V.506zm-4.973 8.58h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm2.705 5.41h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929z"/>
                        </g>
                      </svg>
                      <span>
                      <span>{`${modalJob.company_name}`}</span>
                    </span>
                      <span>
                      <span> · </span>
                      <span/>
                      <span>
                        <span>
                          <span>{addressLocality}</span>,
                          <span>{addressRegion}</span>
                        </span>
                      </span>
                        {isValidDate(modalJob.closing_date) &&
                          <span style={{float: "right"}}>
                        Close:{" "}
                            <Moment format="MMM Do YYYY">
                          {modalJob.closing_date}
                        </Moment>
                      </span>
                        }
                    </span>
                    </div>
                  )}
                  {formatSalary(modalJob.salary_hr_start, modalJob.salary_hr_end, modalJob.salary_text_type) !== "Salary Not Specified" && (
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
                      {formatSalary(modalJob.salary_hr_start, modalJob.salary_hr_end, modalJob.salary_text_type)}
                    </span>
                    </div>
                  )}
                  {(termsList.length > 0 || workList.length > 0) && (
                    <div className="term-type d-flex">
                      {termsList.length > 0 && (
                        <>
                          <span className="label">Term:</span> {termsList}
                        </>
                      )}
                      {workList.length > 0 && (
                        <>
                          <span className="label" style={{marginLeft: "15px"}}>
                          Work:
                          </span>{" "}
                          {workList}
                        </>
                      )}
                    </div>
                  )}

                  {typesList.length > 0 && (
                    <div className="term-type d-flex">
                      <span className="label">Type:</span>
                      {typesList}
                    </div>
                  )}
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
              <div className="popup-body">
                {modalJob.text ? renderHTML(modalJob.text) : getFallbackDescription(modalJob.title, modalJob.company)}
              </div>
              <hr />
            </div>
          </div>
        )
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const {app, posts} = state;

  return {
    appData: app,
    cookie: app.token,
    activeJobName: app.activeJobName,
    similarJobs: posts.similarJobs,
    showMoreJobs: posts.moreJobs,
    savedJobs: app.savedJobs,
    savedJobsList: app.savedJobsList,
    appliedJobs: app.appliedJobs,
    filters: posts.facets,
    isJobApplied: app.appliedJobs.includes(parseInt(ownProps.id, 10)),
    unnanuJobs: app.unnanuJobs,
    xJobs: app.xJobs,
    googleJobs: app.googleJobs,
    linkedinJobs: app.linkedinJobs,
    glassdoorJobs: app.glassdoorJobs,
    indeedJobs: app.indeedJobs,
    ziprecruiterJobs: app.ziprecruiterJobs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchExternalJob: (token, jobId, jobType) => dispatch(fetchExternalJob(token, jobId, jobType)),
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
  // fetchNotifications: (token) => dispatch(fetchNotifications(token)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(Job)
);
