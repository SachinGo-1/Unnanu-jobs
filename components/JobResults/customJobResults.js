import React, { Component } from "react";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import generateHash from "random-hash";
import {
  removeJob,
  saveJob,
  showOrHidePopup,
  saveGoogleJob,
  saveXJob,
  saveIndeedJob,
  saveLinkedinJob,
  saveGlassdoorJob,
  saveZiprecruiterJob,
  applyGoogleJob,
  applyXJob,
  applyIndeedJob,
  applyLinkedinJob,
  applyGlassdoorJob,
  applyZiprecruiterJob,
  removeSaveGoogleJob,
  removeSaveXJob,
  removeSaveIndeedJob,
  removeSaveLinkedinJob,
  removeSaveGlassdoorJob,
  removeSaveZiprecruiterJob,
  deleteUnnanuJob,
  deleteGoogleJob,
  deleteXJob,
  deleteIndeedJob,
  deleteLinkedinJob,
  deleteGlassdoorJob,
  deleteZiprecruiterJob,
  fetchGoogleJobs,
  fetchXJobs,
  fetchIndeedJobs,
  fetchLinkedinJobs,
  fetchGlassdoorJobs,
  fetchZiprecruiterJobs,
  fetchUnnanuJobs
} from "store/app/actions";
import {debounce} from "../../services/utils";

import urls from "services/api/urls";
import Modal from "../Modal/modal";
import CustomJobsCard from "./customJobsCard";
import LoadingCard from "./loadingCard";
import ExternalJob from "../external-job";

class CustomJobResults extends Component<PropTypes> {
  constructor(props) {
    super(props);
    this.state = {
      jobList: props.jobs,
      pageLoading: false,
      page: 0,
      applyJobID: null,
      type: null,
      scrollY: null
    };

    // Bind all methods
    this.loadMore = this.loadMore.bind(this);
    this.dismissModal = this.dismissModal.bind(this);
    this.showJobPopup = this.showJobPopup.bind(this);
    this.applyJob = this.applyJob.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.removeJob = this.removeJob.bind(this);
    this.showSignupPopup = this.showSignupPopup.bind(this);
    this.loadNextOrPrevious = this.loadNextOrPrevious.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.debounceHandleScroll = debounce(
      this.handleScroll.bind(this),
      2000
    );
  }

  // handling escape close
  componentDidMount() {
    window.addEventListener("scroll", this.debounceHandleScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeJobName !== this.props.activeJobName) {
      this.setState({ page: 0 });
    }
  }

  componentWillUnmount() {
    if (this.debounceHandleScroll) {
      this.debounceHandleScroll = null;
      window.removeEventListener("scroll", this.debounceHandleScroll);
    }
  }

  loadMore = async page => {
    const { activeJobName, appData } = this.props;
    const jobCount = await (this.getJobList()).length;
    this.setState({ pageLoading: true });
    try {
      const fetchAction = this.props[
        `fetch${activeJobName.charAt(0).toUpperCase() +
          activeJobName.slice(1)}Jobs`
      ];
      if (fetchAction) {
        await fetchAction(appData.token, page, jobCount);
        this.setState({ page, pageLoading: false });
      }
    } catch (error) {
      this.setState({
        pageLoading: false
      });
    }
  };

  handleScroll = () => {
    const {activeJobName, jobsHeaderCount} = this.props;
    if (this.state.pageLoading) return;
    let jobsCount = 0;
    if(activeJobName === "ziprecruiter"){
      jobsCount = jobsHeaderCount.find(job => job.jb===`zip_recruiterjobs`)  && jobsHeaderCount.find(job => job.jb===`zip_recruiterjobs`).count;
    } else {
      jobsCount = jobsHeaderCount.find(job => job.jb===`${activeJobName}jobs`)  && jobsHeaderCount.find(job => job.jb===`${activeJobName}jobs`).count;
    }

    const { page } = this.state;
    const scrollTop = window.scrollY;
    const clientHeight = window.innerHeight;
    const { scrollHeight } = document.documentElement;

    // Check if user has scrolled near the bottom
    if (
      scrollTop + clientHeight >= scrollHeight - 150 &&
      this.props.appData.hasMore[this.props.activeJobName] &&
      !this.props.appData.isLoading[this.props.activeJobName] && jobsCount > (this.getJobList()).length
    ) {
      this.loadMore(page + 1);
    }
  };

  dismissModal() {
    const { popupShowHide } = this.props;
    popupShowHide(false);
    document.body.classList.remove("modal-open");
    this.setState({ showSignup: false, applyJobID: null, type: null });

    Router.push("/").then(() => window.scrollTo(0, this.state.scrollY));
  }

  showJobPopup(e, id, jobNameURL, job) {
    e.preventDefault();
    const {
      popupShowHide,
      // urlDetails,
      // filters,
      deviceInfo,
      // location,
      activeJobName
    } = this.props;
    if (activeJobName === "unnanu") {
      popupShowHide(true);
      document.body.classList.add("modal-open");

      if (deviceInfo.isMobile) {
        Router.push(`/job/${id}/${jobNameURL}`).then(() =>
          window.scrollTo(0, 0)
        );
      } else {
        this.setState({ scrollY: window.pageYOffset }, () => {
          Router.push(`/?jobId=${id}`, `/job/${id}/${jobNameURL}`).then(() =>
            window.scrollTo(0, 0)
          );
        });
      }
    } else {
      confirmAlert({
        customUI: ({ onClose }) => <ExternalJob onClose={onClose} jobId={id} activeJobName={activeJobName} job={job} />,
        closeOnClickOutside: true,
        closeOnEscape: true
      });
    }
  }

  applyJob(id) {
    const { appData } = this.props;
    if (appData.isLogged && appData.token && appData.user) {
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      // MB: 01/25/2021
      window.location = `${
        urls.Recruit
      }/jobboard/apply/${formatJobId}?service=findjobs&source=UJSL`;
    } else {
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      const isJobApplied = formatJobId ? `&applyjob=${formatJobId}` : "";
      window.location = `${
        urls.Recruit
      }/signup?service=findjobs${isJobApplied}`;
    }
  }

  saveJob(id, data) {
    const {
      appData,
      saveUserJob,
      saveGoogleJob,
      saveXJob,
      saveIndeedJob,
      saveLinkedinJob,
      saveGlassdoorJob,
      saveZiprecruiterJob,
    } = this.props;
    const { activeJobName } = appData;

    if (appData.isLogged && appData.token && appData.user) {
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
        apply_link: data.applylink || data.apply_link || data.applyLink
      };
      switch (activeJobName) {
        case "google":
          saveGoogleJob(appData.token, id, prepSave);
          break;
        case "x":
          saveXJob(appData.token, id, prepSave);
          break;
        case "indeed":
          saveIndeedJob(appData.token, id, prepSave);
          break;
        case "linkedin":
          saveLinkedinJob(appData.token, id, prepSave);
          break;
        case "glassdoor":
          saveGlassdoorJob(appData.token, id, prepSave);
          break;
        case "ziprecruiter":
          saveZiprecruiterJob(appData.token, id, prepSave);
          break;
        default:
          saveUserJob(appData.token, id, prepSave);
      }
    } else {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true, applyJobID: id, type: "save" });
    }
  }

  deleteJob = id => {
    const {
      appData,
      deleteUnnanuJob,
      deleteGoogleJob,
      deleteXJob,
      deleteIndeedJob,
      deleteLinkedinJob,
      deleteGlassdoorJob,
      deleteZiprecruiterJob,
    } = this.props;

    confirmAlert({
      customUI: ({ onClose }) => (
        <div className="confirm-popup-wrapper">
          <div className="popup-content">
            <div className="popup-header">
              <h1>Delete Job</h1>
            </div>
            <div className="popup-body">
              <p>
                Are you sure you want to delete this job? If you might need to
                retrieve it later, make sure to save it first. Clicking
                &quot;Yes&quot; will delete this job, while clicking
                &quot;No&quot; will cancel the action.
              </p>
              {/* <p
                  style={{
                    color: "#FF7F7F",
                    marginTop: "10px",
                    fontSize: "14px",
                  }}
                >
                  Note: This action cannot be undone. The employer will be
                  notified of your withdrawal.
                </p> */}
            </div>
            <div className="popup-footer text-right">
              <button onClick={onClose} className="btn cancel-button large">
                No
              </button>
              <button
                className="btn confirm-button large"
                onClick={() => {
                  switch (appData.activeJobName) {
                    case "google":
                      deleteGoogleJob(appData.token, id);
                      break;
                    case "x":
                      deleteXJob(appData.token, id);
                      break;
                    case "indeed":
                      deleteIndeedJob(appData.token, id);
                      break;
                    case "linkedin":
                      deleteLinkedinJob(appData.token, id);
                      break;
                    case "glassdoor":
                      deleteGlassdoorJob(appData.token, id);
                      break;
                    case "ziprecruiter":
                      deleteZiprecruiterJob(appData.token, id);
                      break;
                    default:
                      deleteUnnanuJob(appData.token, id);
                  }
                  const removeOldJob = this.state.jobList.filter(
                    obj => obj.id !== parseInt(id, 10)
                  );
                  this.setState({ jobList: removeOldJob }, () => {
                    onClose();
                    // if (this.getSavedJobs.length === 1) {
                    //   this.props.close();
                    // }
                  });
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ),
      closeOnClickOutside: true,
      closeOnEscape: true
    });
  };

  showSignupPopup(id, action) {
    document.body.classList.add("modal-open");
    this.setState({ showSignup: true, applyJobID: id, type: action });
  }

  removeJob = (id, data) => {
    const {
      appData,
      activeJobName,
      removeUserJob,
      removeSaveGoogleJob,
      removeSaveXJob,
      removeSaveIndeedJob,
      removeSaveLinkedinJob,
      removeSaveGlassdoorJob,
      removeSaveZiprecruiterJob,
    } = this.props;

    if (!(appData.isLogged && appData.user)) {
      document.body.classList.add("modal-open");
      this.setState({ showSignup: true });
      return;
    }

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
                  switch (activeJobName) {
                    case "google":
                      removeSaveGoogleJob(appData.token, id, data);
                      break;
                    case "x":
                      removeSaveXJob(appData.token, id, data);
                      break;
                    case "indeed":
                      removeSaveIndeedJob(appData.token, id, data);
                      break;
                    case "linkedin":
                      removeSaveLinkedinJob(appData.token, id, data);
                      break;
                    case "glassdoor":
                      removeSaveGlassdoorJob(appData.token, id, data);
                      break;
                    case "ziprecruiter":
                      removeSaveZiprecruiterJob(appData.token, id, data);
                      break;
                    default:
                      removeUserJob(appData.token, id);
                  }
                  onClose();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      ),
      closeOnClickOutside: true,
      closeOnEscape: true
    });
  };

  async loadNextOrPrevious(id, jobNameURL) {
    const { urlDetails } = this.props;
    const isSavedModal = urlDetails.query.saved;
    const isSimilarModal = urlDetails.query.similar;
    const isPopularModal = urlDetails.query.popular;
    const isAppliedModal = urlDetails.query.applied;

    // const {count} = this.state;

    // const getIndex = unnanuJobs.findIndex((j) => j.j_id === id);
    // const currentLast = unnanuJobs.length - 1;
    // const getCurrent = getIndex + 1;
    //
    // if (getCurrent === currentLast && unnanuJobs.length < count) {
    //   const page = Math.ceil(currentLast / 10) * 10;
    //   // await this.fetchMoreJobs(page);
    // }

    if (isSavedModal || isSimilarModal || isPopularModal || isAppliedModal) {
      let param = isAppliedModal ? "applied" : "saved";
      param = isSimilarModal ? "similar" : param;
      param = isPopularModal ? "popular" : param;
      Router.push(`/?jobId=${id}&${param}=true`, `/job/${id}/${jobNameURL}`);
    } else {
      Router.push(`/?jobId=${id}`, `/job/${id}/${jobNameURL}`);
    }
  }

  getJobList (){
    const {
      activeJobName,
      googleJobs,
      xJobs,
      indeedJobs,
      linkedinJobs,
      glassdoorJobs,
      ziprecruiterJobs,
      unnanuJobs,
    } = this.props;

    switch (activeJobName) {
      case "google":
        return googleJobs;
      case "x":
        return xJobs;
      case "indeed":
        return indeedJobs;
      case "linkedin":
        return linkedinJobs;
      case "glassdoor":
        return glassdoorJobs;
      case "ziprecruiter":
        return ziprecruiterJobs;
      default:
        return unnanuJobs;
    }
  }

  render() {
    const {
      appData,
      urlDetails,
      activeJobName,
      savedJobs,
      savedXJobs,
      savedIndeedJobs,
      savedGoogleJobs,
      savedLinkedinJobs,
      savedGlassdoorJobs,
      savedZiprecruiterJobs,
      appliedJobs,
      appliedXJobs,
      appliedIndeedJobs,
      appliedGoogleJobs,
      appliedLinkedinJobs,
      appliedGlassdoorJobs,
      appliedZiprecruiterJobs,
      popularJobs,
      similarJobs
    } = this.props;

    const jobList = this.getJobList();
    // Determine which job list to use based on activeJobName

    const { showSignup, applyJobID, type } = this.state;
    const searchResult =
      jobList.length > 100
        ? `Showing 100+ ${activeJobName[0].toUpperCase() +
            activeJobName.substring(1)} Results`
        : `Showing ${jobList.length} ${activeJobName[0].toUpperCase() +
            activeJobName.substring(1)} Results`;
    const noResults = jobList.length === 0;
    const isSavedModal = urlDetails.query.saved;
    const isSimilarModal = urlDetails.query.similar;
    const isPopularModal = urlDetails.query.popular;
    const isAppliedModal = urlDetails.query.applied;
    let modalJobs;
    if (isSavedModal) {
      switch (activeJobName) {
        case "google":
          modalJobs = savedGoogleJobs;
          break;
        case "x":
          modalJobs = savedXJobs;
          break;
        case "indeed":
          modalJobs = savedIndeedJobs;
          break;
        case "linkedin":
          modalJobs = savedLinkedinJobs;
          break;
        case "glassdoor":
          modalJobs = savedGlassdoorJobs;
          break;
        case "ziprecruiter":
          modalJobs = savedZiprecruiterJobs;
          break;
        default:
          modalJobs = savedJobs;
      }
    } else if (isAppliedModal) {
      switch (activeJobName) {
        case "google":
          modalJobs = appliedGoogleJobs;
          break;
        case "x":
          modalJobs = appliedXJobs;
          break;
        case "indeed":
          modalJobs = appliedIndeedJobs;
          break;
        case "linkedin":
          modalJobs = appliedLinkedinJobs;
          break;
        case "glassdoor":
          modalJobs = appliedGlassdoorJobs;
          break;
        case "ziprecruiter":
          modalJobs = appliedZiprecruiterJobs;
          break;
        default:
          modalJobs = appliedJobs;
      }
    } else if (isSimilarModal) {
      modalJobs = similarJobs;
    } else if (isPopularModal) {
      modalJobs = popularJobs;
    } else {
      modalJobs = jobList;
    }
    const searchResultsHeader = appData.isLoading[activeJobName] ? (
      <div className="loading animated-background" />
    ) : (
      searchResult
    );

    return (
      <div className="results-section">
        {!noResults && (
          <div className="results-header">{searchResultsHeader}</div>
        )}

        {Array.isArray(jobList) &&
          jobList.length > 0 &&
          jobList.map(item => {
            const randomKey = generateHash();
            return (
              <CustomJobsCard
                key={randomKey}
                id={item.j_id}
                title={item.j_title}
                company={item.company_name}
                jobWorkType={item.schd}
                closeDate={item.closing_date}
                salaryHrStart={
                  item.salary_hr_start // salary={this.composeSalaryRange(item.salary_type, item)}
                }
                salaryHrEnd={item.salary_hr_end}
                description={
                  item.text // time={item.updated_time}
                }
                showJobPopup={this.showJobPopup}
                applyThisJob={this.applyJob}
                saveThisJob={this.saveJob}
                removeThisJob={this.removeJob}
                deleteThisJob={this.deleteJob}
                logo={item.logo}
                data={item}
                score={item.matchscore}
                location={item.location}
                isSaved={item.is_saved}
                isApplied={item.is_applied}
                inProgress={item.in_progress}
                applyLink={item.apply_link}
                job={item}
              />
            );
          })}

        {(appData.hasMore[activeJobName] ||
          appData.isLoading[activeJobName] ||
          this.state.pageLoading) && (
          <div className="loading-indicator">
            <LoadingCard times={2} />
          </div>
        )}

        {/* {backgroundLoader} */}

        {urlDetails.query.jobId && !showSignup && (
          <Modal
            id={urlDetails.query.jobId}
            onDismiss={() => this.dismissModal()}
            jobs={modalJobs}
            type="Job"
            similarJobs={isSimilarModal}
            isPopular={urlDetails.query.popular}
            loadNextJob={(id, jobNameURL) =>
              this.loadNextOrPrevious(id, jobNameURL)
            }
            loadPreviousJob={(id, jobNameURL) =>
              this.loadNextOrPrevious(id, jobNameURL)
            }
            showSignupPopup={(id, action) => this.showSignupPopup(id, action)}
          />
        )}

        {showSignup && (
          <Modal
            id={`signup-${applyJobID}`}
            onDismiss={() => this.dismissModal()}
            type="Signup"
            jobID={applyJobID}
            actionType={type}
          />
        )}

        {noResults && !appData.isLoading[activeJobName] && (
          <div className="results-empty">
            <svg
              className="results-empty-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 64 64"
            >
              <path
                fill="#000"
                fillRule="nonzero"
                d="M63.856 38.874v-23.08a1.453 1.453 0 0 0-.02-.244 1.473 1.473 0 0 0-.043-.188l-.001-.004a1.473 1.473 0 0 0-.048-.134l-.018-.037a1.518 1.518 0 0 0-.103-.19l-.011-.019a1.44 1.44 0 0 0-.117-.15c-.007-.01-.015-.018-.023-.026a1.415 1.415 0 0 0-.122-.118l-.02-.018c-.048-.04-.1-.076-.152-.109l-.037-.022a1.455 1.455 0 0 0-.151-.077l-.018-.01L28.958.114l-.01-.004-.04-.015a1.428 1.428 0 0 0-.634-.088h-.012c-.095.01-.19.028-.28.056l-.016.006c-.04.013-.08.027-.118.042l-.006.003-9.977 4.205a1.448 1.448 0 0 0-.884 1.335c0 .583.348 1.11.884 1.335l9.094 3.833v12.765L1.028 34.515c-.018.007-.035.017-.053.025l-.05.025c-.042.02-.081.044-.12.069l-.018.01-.004.003a1.421 1.421 0 0 0-.136.104l-.012.012a1.461 1.461 0 0 0-.105.103l-.029.032a1.432 1.432 0 0 0-.076.096c-.01.012-.018.024-.027.037-.026.038-.05.077-.072.117l-.013.022a1.479 1.479 0 0 0-.067.146l-.014.041a1.501 1.501 0 0 0-.072.285l-.006.04c-.006.057-.01.115-.01.172v12.362c0 .583.348 1.11.884 1.335l34.006 14.333c.09.038.184.068.282.088l.027.004a1.38 1.38 0 0 0 .514 0l.027-.004c.098-.02.193-.05.282-.088l26.806-11.298c.535-.226.884-.752.884-1.335V38.889v-.015zm-16.111 4.623l-9.103-3.836a1.438 1.438 0 0 0-1.887.775 1.45 1.45 0 0 0 .771 1.895l6.493 2.737-8.419 3.548-15.619-6.583 8.419-3.548 5.12 2.158a1.439 1.439 0 0 0 1.887-.775 1.45 1.45 0 0 0-.771-1.896l-4.795-2.02v-9.225L58.69 38.885l-10.944 4.612zm-20.787-7.545l-10.703 4.51L5.311 35.85l21.647-9.123v9.225zM28.4 3.018l30.289 12.766-6.252 2.635-23.47-9.892-.013-.005-6.806-2.869L28.4 3.018zM51.869 21.32a1.435 1.435 0 0 0 1.125.005l7.979-3.363v18.745L29.841 23.586v-11.55L51.87 21.32zM3.027 38.028l31.132 13.12v9.226L3.027 47.253v-9.225zm57.946 12.26L37.042 60.374v-9.225l23.931-10.086v9.225z"
                opacity=".2"
              />
            </svg>
            <div className="results-empty-title">
              No matching jobs were found for you.
              <div className="results-empty-suggestions">
                <p>To improve your job matches, we recommend the following updates:</p>
                <p>Edit Your Profile – Add at least three different job titles in the &quot;Edit
                  Profile&quot; section.</p>
                <p>Update Your Skills – Include your top five skills in the &quot;Skills&quot; section.</p>
                <p>Upload Your Resume – Ensure you have an updated resume for better accuracy in job matches.</p>
                </div>
                After making these changes:
              <div className="results-empty-suggestions">
                <p>Sign out and sign back in.</p>
                <p>Wait 5 minutes to see the updated job matches.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {app, posts} = state;
  return {
    appData: app,
    jobsHeaderCount: app.jobsHeaderCount,
    activeJobName: app.activeJobName,
    unnanuJobs: app.unnanuJobs,
    googleJobs: app.googleJobs,
    xJobs: app.xJobs,
    indeedJobs: app.indeedJobs,
    linkedinJobs: app.linkedinJobs,
    glassdoorJobs: app.glassdoorJobs,
    ziprecruiterJobs: app.ziprecruiterJobs,
    similarJobs: posts.similarJobs,
    savedJobs: app.savedJobs,
    savedGoogleJobs: app.savedGoogleJobs,
    savedXJobs: app.savedXJobs,
    savedIndeedJobs: app.savedIndeedJobs,
    savedLinkedinJobs: app.savedLinkedinJobs,
    savedGlassdoorJobs: app.savedGlassdoorJobs,
    savedZiprecruiterJobs: app.savedZiprecruiterJobs,
    appliedJobs: app.appliedJobs,
    appliedXJobs: app.appliedXJobs,
    appliedIndeedJobs: app.appliedIndeedJobs,
    appliedGoogleJobs: app.appliedGoogleJobs,
    appliedLinkedinJobs: app.appliedLinkedinJobs,
    appliedGlassdoorJobs: app.appliedGlassdoorJobs,
    appliedZiprecruiterJobs: app.appliedZiprecruiterJobs
  };
};

const mapDispatchToProps = dispatch => ({
  popupShowHide: data => dispatch(showOrHidePopup(data)),
  saveUserJob: (token, jobId, job) => dispatch(saveJob(token, jobId, job)),
  removeUserJob: (token, jobId) => dispatch(removeJob(token, jobId)),
  saveGoogleJob: (token, jobId, job) =>
    dispatch(saveGoogleJob(token, jobId, job)),
  saveXJob: (token, jobId, job) => dispatch(saveXJob(token, jobId, job)),
  saveIndeedJob: (token, jobId, job) =>
    dispatch(saveIndeedJob(token, jobId, job)),
  saveLinkedinJob: (token, jobId, job) =>
    dispatch(saveLinkedinJob(token, jobId, job)),
  saveGlassdoorJob: (token, jobId, job) =>
    dispatch(saveGlassdoorJob(token, jobId, job)),
  saveZiprecruiterJob: (token, jobId, job) =>
    dispatch(saveZiprecruiterJob(token, jobId, job)),
  applyGoogleJob: (token, jobId, job) =>
    dispatch(applyGoogleJob(token, jobId, job)),
  applyXJob: (token, jobId, job) => dispatch(applyXJob(token, jobId, job)),
  applyIndeedJob: (token, jobId, job) =>
    dispatch(applyIndeedJob(token, jobId, job)),
  applyLinkedinJob: (token, jobId, job) =>
    dispatch(applyLinkedinJob(token, jobId, job)),
  applyGlassdoorJob: (token, jobId, job) =>
    dispatch(applyGlassdoorJob(token, jobId, job)),
  applyZiprecruiterJob: (token, jobId, job) =>
    dispatch(applyZiprecruiterJob(token, jobId, job)),
  removeSaveGoogleJob: (token, jobId, job) =>
    dispatch(removeSaveGoogleJob(token, jobId, job)),
  removeSaveXJob: (token, jobId, job) =>
    dispatch(removeSaveXJob(token, jobId, job)),
  removeSaveIndeedJob: (token, jobId, job) =>
    dispatch(removeSaveIndeedJob(token, jobId, job)),
  removeSaveLinkedinJob: (token, jobId, job) =>
    dispatch(removeSaveLinkedinJob(token, jobId, job)),
  removeSaveGlassdoorJob: (token, jobId, job) =>
    dispatch(removeSaveGlassdoorJob(token, jobId, job)),
  removeSaveZiprecruiterJob: (token, jobId, job) =>
    dispatch(removeSaveZiprecruiterJob(token, jobId, job)),
  deleteUnnanuJob: (token, jobId) => dispatch(deleteUnnanuJob(token, jobId)),
  deleteGoogleJob: (token, jobId) => dispatch(deleteGoogleJob(token, jobId)),
  deleteXJob: (token, jobId) => dispatch(deleteXJob(token, jobId)),
  deleteIndeedJob: (token, jobId) => dispatch(deleteIndeedJob(token, jobId)),
  deleteLinkedinJob: (token, jobId) =>
    dispatch(deleteLinkedinJob(token, jobId)),
  deleteGlassdoorJob: (token, jobId) =>
    dispatch(deleteGlassdoorJob(token, jobId)),
  deleteZiprecruiterJob: (token, jobId) =>
    dispatch(deleteZiprecruiterJob(token, jobId)),
  fetchGoogleJobs: (token, page, jobCount) => dispatch(fetchGoogleJobs(token, page, jobCount)),
  fetchXJobs: (token, page, jobCount) => dispatch(fetchXJobs(token, page, jobCount)),
  fetchIndeedJobs: (token, page, jobCount) => dispatch(fetchIndeedJobs(token, page, jobCount)),
  fetchLinkedinJobs: (token, page, jobCount) => dispatch(fetchLinkedinJobs(token, page, jobCount)),
  fetchGlassdoorJobs: (token, page, jobCount) =>
    dispatch(fetchGlassdoorJobs(token, page, jobCount)),
  fetchZiprecruiterJobs: (token, page, jobCount) =>
    dispatch(fetchZiprecruiterJobs(token, page, jobCount)),
  fetchUnnanuJobs: (token, page) => dispatch(fetchUnnanuJobs(token, page))
});

export default withRedux(
  Store,
  mapStateToProps,
  mapDispatchToProps
)(withReduxSaga(CustomJobResults));
