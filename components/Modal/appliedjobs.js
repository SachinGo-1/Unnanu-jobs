import React, { Component } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Moment from "react-moment";
import moment from "moment";
import generateHash from "random-hash";

import SubmitButton from "components/Buttons";

import {
  withdrawUnnanuJob,
  withdrawGoogleJob,
  withdrawXJob,
  withdrawIndeedJob,
  withdrawLinkedinJob,
  withdrawGlassdoorJob,
  withdrawZiprecruiterJob,
  fetchAppliedJobs,
  fetchAppliedGoogleJobs,
  fetchAppliedXJobs,
  fetchAppliedIndeedJobs,
  fetchAppliedLinkedinJobs,
  fetchAppliedGlassdoorJobs,
  fetchAppliedZiprecruiterJobs,
} from "store/app/actions";

import { confirmAlert } from "react-confirm-alert";

import {imageURL, prepareURLName, isValidDate, debounce} from "services/utils";
import LoadingCard from "../JobResults/loadingCard";

class AppliedJobs extends Component {
  constructor(props) {
    super(props);
    const {activeJobName, appData } = this.props;
    this.state = {
      page: appData.currentPage[`${activeJobName}Applied`] || 0,
      pageLoading: false,
    };
    this.debouncedLoadMoreJobs = debounce(this.loadMoreJobs.bind(this), 1000);
    this.handleScroll= this.handleScroll.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef.current.addEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    const { activeJobName } = this.props;
    if (prevProps.activeJobName !== activeJobName) {
      this.setState({ page: 0 });
    }
  }

  componentWillUnmount() {
    if (this.debounceHandleScroll) {
      this.debounceHandleScroll = null;
      this.myRef.current.removeEventListener("scroll", this.handleScroll);
    }
  }

  getAppliedJobs () {
    const {
      activeJobName,
      appliedJobs,
      appliedGoogleJobs,
      appliedXJobs,
      appliedIndeedJobs,
      appliedLinkedinJobs,
      appliedGlassdoorJobs,
      appliedZiprecruiterJobs,
    } = this.props;
    switch (activeJobName) {
      case "google":
        return appliedGoogleJobs;
      case "x":
        return appliedXJobs;
      case "indeed":
        return appliedIndeedJobs;
      case "linkedin":
        return appliedLinkedinJobs;
      case "glassdoor":
        return appliedGlassdoorJobs;
      case "ziprecruiter":
        return appliedZiprecruiterJobs;
      default:
        return appliedJobs;
    }
  }

  handleScroll = () => {
    const{activeJobName, appData} = this.props;
    let jobsCount = 0;
    if(activeJobName === "ziprecruiter"){
      jobsCount = appData.jobsHeaderCount.find(job => job.jb===`zip_recruiterjobs`)  && appData.jobsHeaderCount.find(job => job.jb===`zip_recruiterjobs`).appliedcount;
    } else {
      jobsCount = appData.jobsHeaderCount.find(job => job.jb===`${activeJobName}jobs`)  && appData.jobsHeaderCount.find(job => job.jb===`${activeJobName}jobs`).appliedcount;
    }
    const {page} = this.state;
    if (this.state.pageLoading || !this.myRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = this.myRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 80 && jobsCount > (this.getAppliedJobs()).length &&
      !appData.isLoading[`${activeJobName}Applied`]){
      this.debouncedLoadMoreJobs(page + 1);
    }
  };

  loadMoreJobs = async(page) => {
    const { appData,activeJobName} = this.props;
    this.setState({ pageLoading: true });
    const jobCount = await (this.getAppliedJobs()).length;
    try{
      let fetchAction ='';
      if(activeJobName==="unnanu"){
        fetchAction = this.props.fetchAppliedJobs;
      } else{
        fetchAction = this.props[`fetchApplied${activeJobName.charAt(0).toUpperCase() + activeJobName.slice(1)}Jobs`];
      }

      if (fetchAction) {
        await fetchAction(appData.token, page, jobCount);
        this.setState({page, pageLoading: false });
      }
    }
    catch (error) {
      this.setState({
        pageLoading: false
      });
    }
  };

  withdrawJob = (e, id) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
    }

    const {
      activeJobName,
      withdrawUnnanuJob,
      withdrawGoogleJob,
      withdrawXJob,
      withdrawIndeedJob,
      withdrawLinkedinJob,
      withdrawGlassdoorJob,
      withdrawZiprecruiterJob,
      token,
    } = this.props;

    confirmAlert({
      customUI: ({ onClose }) => (
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
                  switch (activeJobName) {
                    case "google":
                      withdrawGoogleJob(token, id);
                      break;
                    case "x":
                      withdrawXJob(token, id);
                      break;
                    case "indeed":
                      withdrawIndeedJob(token, id);
                      break;
                    case "linkedin":
                      withdrawLinkedinJob(token, id);
                      break;
                    case "glassdoor":
                      withdrawGlassdoorJob(token, id);
                      break;
                    case "ziprecruiter":
                      withdrawZiprecruiterJob(token, id);
                      break;
                    default:
                      withdrawUnnanuJob(token, id);
                  }
                  if (this.getAppliedJobs.length === 1) {
                    this.props.close();
                  }
                  onClose();
                }}
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
  };

  checkIfExpired = (date) => moment().isAfter(date);

  render() {
    const { activeJobName, appData } = this.props; // Add default value
    const { pageLoading } = this.state;

    const items = [];
    const appliedJobs = this.getAppliedJobs();
    appliedJobs.map((item, key) => {
      const jobNameURL = prepareURLName({
        title: item.title,
        company: item.company,
      });
      const randomKey = generateHash();
      items.push(
        <div className="job-item" key={randomKey}>
          <div className="job-item-company-logo">
            <img src={imageURL(item.logo)} />
          </div>
          <div className="job-card-content">
            <div className="job-card-meta">
              { activeJobName === "unnanu" ? (
                <a href={`/job/${item.id}/${jobNameURL}`}
                  className="job-title"
                >
                  {item.title.length > 40
                    ? `${item.title.slice(0, 40)}...`
                    : item.title}
                </a>
              ) : (
                <a
                  href={`${item.apply_link}`}
                  target="_blank"
                  className="job-title"
                >
                  {item.title.length > 40
                    ? `${item.title.slice(0, 40)}...`
                    : item.title}
                </a>
              )}

              <div className="company-name">{item.company}</div>
              {isValidDate(item.timestamp) && (
                <div className="saved-time">
                  Applied on{" "}
                  <Moment format="MMM Do YYYY">{item.timestamp}</Moment>
                </div>
              )}
            </div>
            <div className="job-card-actions">
              <SubmitButton
                submitting={false}
                text="Withdraw"
                btnType="submit"
                btnState="withdraw"
                handleClick={
                  (e) => this.withdrawJob(e, item.id)
                }
                />
            </div>
          </div>
        </div>
      );
    });

    const header =
      activeJobName !== "unnanu"
        ? `${activeJobName[0].toUpperCase()}${activeJobName.substring(1)}`
        : "Unnanu";

    return (
      <div className="saved-jobs-popup-wrapper">
        <div className="popup-header">Applied {header} Jobs</div>
        <div
          id="saved-job-popup"
          className="popup-content"
          ref={this.myRef}
        >
          <div className="saved-jobs-list">
            {items}
            {pageLoading || appData.isLoading[`${activeJobName}Applied`] && (
              <div className="text-center load-more-preloader">
                <LoadingCard times={1} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
 
  
  const { app } = state;

  return {
    appData: app,
    token: app.token,
    activeJobName: app.activeJobName,
    appliedJobs: app.appliedJobs,
    appliedJobsCount: app.appliedJobs.length,
    appliedGoogleJobs: app.appliedGoogleJobs,
    appliedXJobs: app.appliedXJobs,
    appliedIndeedJobs: app.appliedIndeedJobs,
    appliedLinkedinJobs: app.appliedLinkedinJobs,
    appliedGlassdoorJobs: app.appliedGlassdoorJobs,
    appliedZiprecruiterJobs: app.appliedZiprecruiterJobs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  withdrawUnnanuJob: (token, jobId) =>
    dispatch(withdrawUnnanuJob(token, jobId)),
  withdrawGoogleJob: (token, jobId) =>
    dispatch(withdrawGoogleJob(token, jobId)),
  withdrawXJob: (token, jobId) => dispatch(withdrawXJob(token, jobId)),
  withdrawIndeedJob: (token, jobId) =>
    dispatch(withdrawIndeedJob(token, jobId)),
  withdrawLinkedinJob: (token, jobId) =>
    dispatch(withdrawLinkedinJob(token, jobId)),
  withdrawGlassdoorJob: (token, jobId) =>
    dispatch(withdrawGlassdoorJob(token, jobId)),
  withdrawZiprecruiterJob: (token, jobId) =>
    dispatch(withdrawZiprecruiterJob(token, jobId)),
  fetchAppliedGoogleJobs: (token, page, jobCount) => dispatch(fetchAppliedGoogleJobs(token, page, jobCount)),
  fetchAppliedXJobs: (token, page, jobCount) => dispatch(fetchAppliedXJobs(token, page, jobCount)),
  fetchAppliedIndeedJobs: (token, page, jobCount) => dispatch(fetchAppliedIndeedJobs(token, page, jobCount)),
  fetchAppliedLinkedinJobs: (token, page, jobCount) => dispatch(fetchAppliedLinkedinJobs(token, page, jobCount)),
  fetchAppliedGlassdoorJobs: (token, page, jobCount) =>
    dispatch(fetchAppliedGlassdoorJobs(token, page, jobCount)),
  fetchAppliedZiprecruiterJobs: (token, page, jobCount) =>
    dispatch(fetchAppliedZiprecruiterJobs(token, page, jobCount)),
  fetchAppliedJobs: (token, page, jobCount) =>
    dispatch(fetchAppliedJobs(token, page, jobCount)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(AppliedJobs)
);
