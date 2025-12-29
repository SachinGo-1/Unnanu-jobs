import React, {Component} from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Moment from "react-moment";
import moment from "moment";
import generateHash from "random-hash";
import SubmitButton from "components/Buttons";

import {
  fetchSavedJobs,
  saveJob,
  removeJob,
  withdrawUnnanuJob,
  withdrawGoogleJob,
  withdrawXJob,
  withdrawIndeedJob,
  withdrawLinkedinJob,
  withdrawGlassdoorJob,
  withdrawZiprecruiterJob,
  inProcessGoogleJob,
  inProcessXJob,
  inProcessIndeedJob,
  inProcessLinkedinJob,
  inProcessGlassdoorJob,
  inProcessZiprecruiterJob,
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
  fetchSavedGoogleJobs,
  fetchSavedXJobs,
  fetchSavedIndeedJobs,
  fetchSavedLinkedinJobs,
  fetchSavedGlassdoorJobs,
  fetchSavedZiprecruiterJobs,
} from "store/app/actions";

import {confirmAlert} from "react-confirm-alert"; // Import

import urls from "services/api/urls";

import {imageURL, isValidDate, prepareURLName, debounce} from "services/utils";
import LoadingCard from "../JobResults/loadingCard";

class SavedJobs extends Component {
  constructor(props) {

    super(props);
    const {activeJobName, appData} = this.props;
    this.state = {
      jobs: this.getSavedJobs(),
      page: appData.currentPage[`${activeJobName}Saved`] || 0,
      pageLoading: false,
    };
    this.debouncedLoadMoreJobs = debounce(this.loadMoreJobs.bind(this), 1000);
    // this.debouncedHandleScroll = debounce(this.handleScroll.bind(this), 1000)
    this.handleScroll = this.handleScroll.bind(this);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef.current.addEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate(prevProps) {
    const {activeJobName} = this.props;
    if (prevProps.activeJobName !== activeJobName) {
      this.setState({page: 0});
    }
  }

  componentWillUnmount() {
    if (this.debounceHandleScroll) {
      this.debounceHandleScroll = null;
      this.myRef.current.removeEventListener("scroll", this.handleScroll);
    }
  }


  getSavedJobs = () => {
    const {
      activeJobName,
      savedJobs,
      savedXJobs,
      savedIndeedJobs,
      savedLinkedinJobs,
      savedGoogleJobs,
      savedGlassdoorJobs,
      savedZiprecruiterJobs,
    } = this.props;

    switch (activeJobName) {
      case "google":
        return savedGoogleJobs;
      case "x":
        return savedXJobs;
      case "indeed":
        return savedIndeedJobs;
      case "linkedin":
        return savedLinkedinJobs;
      case "glassdoor":
        return savedGlassdoorJobs;
      case "ziprecruiter":
        return savedZiprecruiterJobs;
      default:
        return savedJobs;
    }
  };

  handleScroll = () => {
    const {activeJobName, appData} = this.props;
    let jobsCount = 0
    if (activeJobName === "ziprecruiter") {
      jobsCount = appData.jobsHeaderCount.find(job => job.jb === `zip_recruiterjobs`) && appData.jobsHeaderCount.find(job => job.jb === `zip_recruiterjobs`).savedcount;
    } else {
      jobsCount = appData.jobsHeaderCount.find(job => job.jb === `${activeJobName}jobs`) && appData.jobsHeaderCount.find(job => job.jb === `${activeJobName}jobs`).savedcount;
    }
    const {page} = this.state;
    if (this.state.pageLoading || !this.myRef.current) return;

    const {scrollTop, scrollHeight, clientHeight} = this.myRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 80 && jobsCount > (this.getSavedJobs()).length &&
      !appData.isLoading[`${activeJobName}Saved`]) {
      this.setState(prevState => {
        if (prevState.pageLoading) return null;
        return {pageLoading: true};
      }, () => this.debouncedLoadMoreJobs(page));
    }
  };

  loadMoreJobs = async (page) => {
    const {appData, activeJobName} = this.props;
    // this.setState({ pageLoading: true });
    const jobCount = await (this.getSavedJobs()).length;

    try {
      const fetchAction = this.props[
        `fetchSaved${activeJobName.charAt(0).toUpperCase() +
        activeJobName.slice(1)}Jobs`
        ];
      if (fetchAction) {
        await fetchAction(appData.token, page + 1, jobCount);
        this.setState({page: page + 1, pageLoading: false});
      }
    } catch (error) {
      this.setState({
        pageLoading: false
      });
    }
  };

  handleApplyClick = (e, id, data) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
    }

    const {
      activeJobName,
      token,
      inProcessXJob,
      inProcessGoogleJob,
      inProcessIndeedJob,
      inProcessLinkedinJob,
      inProcessGlassdoorJob,
      inProcessZiprecruiterJob,
      applyXJob,
      applyIndeedJob,
      applyLinkedinJob,
      applyGoogleJob,
      applyGlassdoorJob,
      applyZiprecruiterJob,
    } = this.props;

    // Handle Unnanu jobs
    if (activeJobName === "unnanu") {
      const format = "JID000000000";
      const formatJobId =
        format.substring(0, format.length - id.toString().length) + id;
      window.location = `${
        urls.Recruit
      }/jobboard/apply/${formatJobId}?service=findjobs&source=UJSL`;
      return;
    }

    // Handle external jobs
    if (data.apply_link) {
      confirmAlert({
        customUI: ({onClose}) => (
          <div className="confirm-popup-wrapper">
            <div className="popup-content">
              <div className="popup-header">
                <h1>External Job Application In Progress</h1>
              </div>
              <div className="popup-body">
                <p>
                  Have you completed the external job application you started
                  earlier?
                </p>
                <ul>
                  <li>Yes: Your status will be updated to "Applied".</li>
                  <li>
                    {/* Continue: You will be redirected to resume the application
                    process. Click{" "}
                    <a
                      onClick={onClose}
                      href={applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Here
                    </a>
                    . */}
                    Click{" "}
                    <a
                      onClick={onClose}
                      href={data.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>{" "}
                    to continue with the application process.
                  </li>
                  <li>
                    {/* No: The job status will be removed from "In Progress." */}
                    Selecting 'No' changes your status to 'Apply Now,' allowing
                    you to apply anytime.
                  </li>
                </ul>
              </div>
              <div className="popup-footer text-right">
                <button
                  onClick={() => {
                    switch (activeJobName) {
                      case "google":
                        inProcessGoogleJob(token, id, false);
                        break;
                      case "x":
                        inProcessXJob(token, id, false);
                        break;
                      case "indeed":
                        inProcessIndeedJob(token, id, false);
                        break;
                      case "linkedin":
                        inProcessLinkedinJob(token, id, false);
                        break;
                      case "glassdoor":
                        inProcessGlassdoorJob(token, id, false);
                        break;
                      case "ziprecruiter":
                        inProcessZiprecruiterJob(token, id, false);
                        break;
                      default:
                    }
                    onClose();
                  }}
                  className="btn cancel-button large"
                >
                  No
                </button>
                <button
                  className="btn confirm-button large"
                  onClick={() => {
                    const prepApply = {
                      logo: data.logo,
                      company: data.company || data.company_name,
                      title: data.title || data.j_title,
                      id: parseInt(id, 10),
                      close_date: data.close_date || data.closing_date,
                      timestamp: moment().toISOString(),
                      is_saved: data.is_saved,
                      is_applied: data.is_applied,
                      in_progress: data.inprogress || data.in_progress,
                      apply_link:
                        data.applylink || data.apply_link || data.applyLink,
                    };
                    switch (activeJobName) {
                      case "google":
                        applyGoogleJob(token, id, prepApply);
                        break;
                      case "x":
                        applyXJob(token, id, prepApply);
                        break;
                      case "indeed":
                        applyIndeedJob(token, id, prepApply);
                        break;
                      case "linkedin":
                        applyLinkedinJob(token, id, prepApply);
                        break;
                      case "glassdoor":
                        applyGlassdoorJob(token, id, prepApply);
                        break;
                      case "ziprecruiter":
                        applyZiprecruiterJob(token, id, prepApply);
                        break;
                      default:
                      // applyThisJob(token, id);
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
        closeOnEscape: true,
      });
    }
  };

  handleExternalJobInProcessClick = (e, id, data) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
    }

    const {
      activeJobName,
      token,
      inProcessXJob,
      inProcessGoogleJob,
      inProcessIndeedJob,
      inProcessLinkedinJob,
      inProcessGlassdoorJob,
      inProcessZiprecruiterJob,
    } = this.props;

    confirmAlert({
      customUI: ({onClose}) => (
        <div className="confirm-popup-wrapper">
          <div className="popup-content">
            <div className="popup-header">
              <h1>External Job Application Notice</h1>
            </div>
            <div className="popup-body">
              <p>
                By clicking ‘Continue’ you acknowledge that you will be
                redirected to a third-party website to complete your job
                application. Unnanu is not responsible for the content,
                accuracy, or actions related to the job posting on the external
                site. We are solely providing publicly available information.
                Please review Unnanu&apos;s platform&apos;s{" "}
                <a
                  href={urls.Links.Privacy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and{" "}
                <a
                  href={urls.Links.Terms}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms of Use
                </a>{" "}
                before proceeding.
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
                      inProcessGoogleJob(token, id, true);
                      break;
                    case "x":
                      inProcessXJob(token, id, true);
                      break;
                    case "indeed":
                      inProcessIndeedJob(token, id, true);
                      break;
                    case "linkedin":
                      inProcessLinkedinJob(token, id, true);
                      break;
                    case "glassdoor":
                      inProcessGlassdoorJob(token, id, true);
                      break;
                    case "ziprecruiter":
                      inProcessZiprecruiterJob(token, id, true);
                      break;
                    default:
                  }
                  window.open(data.apply_link, "_blank");
                  onClose();
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      ),
      closeOnClickOutside: true,
      closeOnEscape: true,
    });
  };

  // handleExternalJobInProcessClick = () => {
  //   const {
  //     id,
  //     applyLink,
  //     activeJobName,
  //     inProcessLinkedinJob,
  //     inProcessXJob,
  //     inProcessIndeedJob,
  //     inProcessGoogleJob,
  //     inProcessGlassdoorJob,
  //     inProcessZiprecruiterJob,
  //     token,
  //   } = this.props;
  //   confirmAlert({
  //     customUI: ({ onClose }) => (
  //       <div className="confirm-popup-wrapper">
  //         <div className="popup-content">
  //           <div className="popup-header">
  //             <h1>External Job Application Notice</h1>
  //           </div>
  //           <div className="popup-body">
  //             <p>
  //               By clicking ‘Continue’ you acknowledge that you will be
  //               redirected to a third-party website to complete your job
  //               application. Unnanu is not responsible for the content,
  //               accuracy, or actions related to the job posting on the external
  //               site. We are solely providing publicly available information.
  //               Please review Unnanu&apos;s platform&apos;s{" "}
  //               <a
  //                 href={urls.Links.Privacy}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 Privacy Policy
  //               </a>{" "}
  //               and{" "}
  //               <a
  //                 href={urls.Links.Terms}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //               >
  //                 Terms of Use
  //               </a>{" "}
  //               before proceeding.
  //             </p>
  //           </div>
  //           <div className="popup-footer text-right">
  //             <button onClick={onClose} className="btn cancel-button large">
  //               Cancel
  //             </button>
  //             <button
  //               className="btn confirm-button large"
  //               onClick={() => {
  //                 switch (activeJobName) {
  //                   case "google":
  //                     inProcessGoogleJob(token, id, true);
  //                     break;
  //                   case "x":
  //                     inProcessXJob(token, id, true);
  //                     break;
  //                   case "indeed":
  //                     inProcessIndeedJob(token, id, true);
  //                     break;
  //                   case "linkedin":
  //                     inProcessLinkedinJob(token, id, true);
  //                     break;
  //                   case "glassdoor":
  //                     inProcessGlassdoorJob(token, id, true);
  //                     break;
  //                   case "ziprecruiter":
  //                     inProcessZiprecruiterJob(token, id, true);
  //                     break;
  //                   default:
  //                 }
  //                 window.open(applyLink, "_blank");
  //                 onClose();
  //               }}
  //             >
  //               Continue
  //             </button>
  //           </div>
  //         </div>
  //       </div>
  //     ),
  //     closeOnClickOutside: true,
  //     closeOnEscape: true,
  //   });
  // };

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
                  const removeOldJob = this.state.jobs.filter((obj) => {
                    return obj.j_id !== parseInt(id, 10);
                  });
                  this.setState({jobs: removeOldJob}, () => {
                    onClose();
                    if (this.getAppliedJobs().length === 1) {
                      this.props.close();
                    }
                  });
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

  removeJob = (e, item) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      e.preventDefault();
    }
    const {
      appData,
      removeUserJob,
      removeSaveGoogleJob,
      removeSaveXJob,
      removeSaveIndeedJob,
      removeSaveLinkedinJob,
      removeSaveGlassdoorJob,
      removeSaveZiprecruiterJob,
    } = this.props;
    confirmAlert({
      customUI: ({onClose}) => (
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
                  switch (appData.activeJobName) {
                    case "google":
                      removeSaveGoogleJob(appData.token, item.id, item);
                      break;
                    case "x":
                      removeSaveXJob(appData.token, item.id, item);
                      break;
                    case "indeed":
                      removeSaveIndeedJob(appData.token, item.id, item);
                      break;
                    case "linkedin":
                      removeSaveLinkedinJob(appData.token, item.id, item);
                      break;
                    case "glassdoor":
                      removeSaveGlassdoorJob(appData.token, item.id, item);
                      break;
                    case "ziprecruiter":
                      removeSaveZiprecruiterJob(appData.token, item.id, item);
                      break;
                    default:
                      removeUserJob(appData.token, item.id);
                  }
                  if (this.getSavedJobs.length === 1) {
                    this.props.close();
                  }
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
  };

  checkIfExpired = (date) => {
    return moment().isAfter(date);
  };

  render() {
    const {activeJobName, appData} = this.props;
    const {pageLoading} = this.state;

    var items = [];

    const savedJobs = this.getSavedJobs();
    savedJobs.map((item, key) => {
      const isApplied = item.is_applied;
      let applyBtnText = isApplied
        ? "Applied"
        : item.in_progress
          ? "In Process"
          : "Apply now";

      if (this.checkIfExpired(item.close_date)) {
        applyBtnText = isApplied ? "Applied" : "Expired";
      }
      const jobNameURL = prepareURLName({
        title: item.title,
        company: item.company,
      });

      const randomKey = generateHash();
      items.push(
        <div className="job-item" key={randomKey}>
          <div className="job-item-company-logo">
            <img src={imageURL(item.logo)}/>
          </div>
          <div className="job-card-content">
            <div className="job-card-meta">
              <a
                href={
                  activeJobName === "unnanu"
                    ? `/job/${item.id}/${jobNameURL}`
                    : undefined
                }
                className="job-title"
              >
                {item.title.length > 40
                  ? `${item.title.slice(0, 40)}...`
                  : item.title}
              </a>
              <div className="company-name">{item.company}</div>
              {isValidDate(item.timestamp) && (
                <div className="saved-time">
                  Saved{" "}
                  <Moment fromNow ago>
                    {moment.utc(item.timestamp).local()}
                  </Moment>
                  ago
                </div>
              )}

            </div>
            <div className="job-card-actions">
              {isApplied ? (
                <SubmitButton
                  submitting={false}
                  text="Withdraw"
                  btnType="submit"
                  btnState="withdraw"
                  handleClick={(e) => this.withdrawJob(e, item.id)}
                />
              ) : item.in_progress ? (
                <SubmitButton
                  submitting={false}
                  text="In Process"
                  btnType="submit"
                  btnState="in-progress"
                  handleClick={(e) => this.handleApplyClick(e, item.id, item)}
                />
              ) : (
                <SubmitButton
                  submitting={false}
                  text={applyBtnText}
                  btnType="submit"
                  btnState="apply"
                  handleClick={
                    activeJobName === "unnanu"
                      ? (e) => this.handleApplyClick(e, item.id, item)
                      : (e) =>
                        this.handleExternalJobInProcessClick(e, item.id, item)
                  }
                  disabled={this.checkIfExpired(item.close_date)}
                />
              )}

              <button
                onClick={(e) => this.removeJob(e, item)}
                className="btn remove-button"
              >
                <svg
                  width="14px"
                  height="14px"
                  viewBox="0 0 14 14"
                  version="1.1"
                >
                  <g
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="savedjob-popup"
                      transform="translate(-383.000000, -51.000000)"
                      fill="#D2D2D2"
                      fillRule="nonzero"
                    >
                      <g id="Shape">
                        <g>
                          <path
                            d="M394.952156,53.0479158 C392.221697,50.3174961 387.778674,50.3172267 385.047945,53.0479158 C382.317217,55.7786048 382.317486,60.2212942 385.047945,62.9519832 C387.778404,65.6826723 392.221427,65.6826723 394.952156,62.9519832 C397.682615,60.2212942 397.682615,55.7783355 394.952156,53.0479158 Z M392.761755,60.761614 C392.551388,60.9719778 392.210384,60.9719778 392.000017,60.761614 L390.000051,58.7616765 L387.905002,60.8566952 C387.694635,61.067059 387.35363,61.067059 387.143264,60.8566952 C386.932897,60.6463314 386.932897,60.305332 387.143264,60.0949682 L389.238312,57.9999495 L387.238346,56.000012 C387.027979,55.7896482 387.027979,55.4483794 387.238346,55.238285 C387.448713,55.0279212 387.789717,55.0279212 388.000084,55.238285 L390.000051,57.2382225 L391.904665,55.3336356 C392.115032,55.1232718 392.456036,55.1232718 392.666403,55.3336356 C392.87677,55.5439993 392.87677,55.8849988 392.666403,56.0953626 L390.761789,57.9999495 L392.761755,59.999887 C392.972122,60.2102508 392.972122,60.5512502 392.761755,60.761614 Z"/>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
                Remove
              </button>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="saved-jobs-popup-wrapper">
        <div className="popup-header">{`Saved ${activeJobName[0].toUpperCase() +
        activeJobName.substring(1)} Jobs`}
        </div>
        <div
          id="saved-job-popup"
          className="popup-content"
          ref={this.myRef}
        >
          <div className="saved-jobs-list">
            {items}

            {pageLoading || appData.isLoading[`${activeJobName}Saved`] && (
              <div className="text-center load-more-preloader">
                <LoadingCard times={1}/>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const {app} = state;

  return {
    appData: app,
    token: app.token,
    activeJobName: app.activeJobName,
    jobHeaderCount: app.jobHeaderCount,
    savedJobs: app.savedJobs,
    savedXJobs: app.savedXJobs,
    savedIndeedJobs: app.savedIndeedJobs,
    savedLinkedinJobs: app.savedLinkedinJobs,
    savedGoogleJobs: app.savedGoogleJobs,
    savedGlassdoorJobs: app.savedGlassdoorJobs,
    savedZiprecruiterJobs: app.savedZiprecruiterJobs,
    appliedJobs: app.appliedJobs,
    appliedXJobs: app.appliedXJobs,
    appliedIndeedJobs: app.appliedIndeedJobs,
    appliedLinkedinJobs: app.appliedLinkedinJobs,
    appliedGoogleJobs: app.appliedGoogleJobs,
    appliedGlassdoorJobs: app.appliedGlassdoorJobs,
    appliedZiprecruiterJobs: app.appliedZiprecruiterJobs,
    savedJobsCount: app.savedJobsList.length,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchSavedGoogleJobs: (token, page, jobCount) => dispatch(fetchSavedGoogleJobs(token, page, jobCount)),
  fetchSavedXJobs: (token, page, jobCount) => dispatch(fetchSavedXJobs(token, page, jobCount)),
  fetchSavedIndeedJobs: (token, page, jobCount) => dispatch(fetchSavedIndeedJobs(token, page, jobCount)),
  fetchSavedLinkedinJobs: (token, page, jobCount) => dispatch(fetchSavedLinkedinJobs(token, page, jobCount)),
  fetchSavedGlassdoorJobs: (token, page, jobCount) =>
    dispatch(fetchSavedGlassdoorJobs(token, page, jobCount)),
  fetchSavedZiprecruiterJobs: (token, page, jobCount) =>
    dispatch(fetchSavedZiprecruiterJobs(token, page, jobCount)),
  removeUserJob: (token, jobid) => dispatch(removeJob(token, jobid)),
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
  fetchSavedJobs: (token, page) => dispatch(fetchSavedJobs(token, page)),
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
  inProcessGoogleJob: (token, jobId, inProgress) =>
    dispatch(inProcessGoogleJob(token, jobId, inProgress)),
  inProcessXJob: (token, jobId, inProgress) =>
    dispatch(inProcessXJob(token, jobId, inProgress)),
  inProcessIndeedJob: (token, jobId, inProgress) =>
    dispatch(inProcessIndeedJob(token, jobId, inProgress)),
  inProcessLinkedinJob: (token, jobId, inProgress) =>
    dispatch(inProcessLinkedinJob(token, jobId, inProgress)),
  inProcessGlassdoorJob: (token, jobId, inProgress) =>
    dispatch(inProcessGlassdoorJob(token, jobId, inProgress)),
  inProcessZiprecruiterJob: (token, jobId, inProgress) =>
    dispatch(inProcessZiprecruiterJob(token, jobId, inProgress)),

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
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(SavedJobs)
);
