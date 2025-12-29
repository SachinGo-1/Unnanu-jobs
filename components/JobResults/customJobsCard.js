import React, { Component } from "react";
import PropTypes from "prop-types";
import Moment from "react-moment";
import moment from "moment";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import { confirmAlert } from "react-confirm-alert";

import {
  withdrawUnnanuJob,
  withdrawGoogleJob,
  withdrawXJob,
  withdrawIndeedJob,
  withdrawLinkedinJob,
  withdrawGlassdoorJob,
  withdrawZiprecruiterJob,
  applyGoogleJob,
  applyXJob,
  applyIndeedJob,
  applyLinkedinJob,
  applyGlassdoorJob,
  applyZiprecruiterJob,
  inProcessXJob,
  inProcessLinkedinJob,
  inProcessIndeedJob,
  inProcessGoogleJob,
  inProcessGlassdoorJob,
  inProcessZiprecruiterJob,
} from "store/app/actions";

import SubmitButton from "components/Buttons";
import JobScore from "components/JobScore";

import {imageURL, prepareURLName, formatSalary, isValidDate} from "services/utils";
import urls from "../../services/api/urls";

class CustomJobsCard extends Component {
  constructor(props) {
    super(props);
  }

  // checkIfApplied = (id) => {
  //   const { appliedJobs } = this.props;
  //   if (appliedJobs) {
  //     return appliedJobs.includes(parseInt(id, 10));
  //   }
  //   return false;
  // };

  // checkIfSave = (id) => {
  //   const { savedJobs } = this.props;
  //   if (savedJobs) {
  //     return savedJobs.includes(parseInt(id, 10));
  //   }
  //   return false;
  // };

  // convertToPlain = html => {
  //   // Create a new div element
  //   const tempDivElement = document.createElement("div");
  //   // Set the HTML content with the given value
  //   tempDivElement.innerHTML = html;
  //   // Retrieve the text property of the element
  //   return tempDivElement.textContent || tempDivElement.innerText || "";
  // }

  getFallbackDescription = (title, location, company) =>
    `Sorry, we are unable to retrieve the job description for ${title} in ${location} at ${company}. To view the full job description, we highly recommend clicking on the 'Job title' or the 'Apply now' button. This will redirect you to the original job posting where you can access the complete details.`;

  htmlToPlainText = (html) =>
    html
      .replace(/<!--[\s\S]*?-->/g, "") // Remove HTML comments
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/\s+/g, " ") // Replace multiple spaces with a single space
      .trim();

  checkIfExpired = (date) => moment().isAfter(date);

  handleExternalJobInProcessClick = () => {
    const {
      id,
      applyLink,
      activeJobName,
      inProcessLinkedinJob,
      inProcessXJob,
      inProcessIndeedJob,
      inProcessGoogleJob,
      inProcessGlassdoorJob,
      inProcessZiprecruiterJob,
      token,
    } = this.props;
    confirmAlert({
      customUI: ({ onClose }) => (
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
                  window.open(applyLink, "_blank");
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

  handleApplyClick = () => {
    const {
      id,
      applyLink,
      applyThisJob,
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
      data,
    } = this.props;
    if (applyLink) {
      confirmAlert({
        customUI: ({ onClose }) => (
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
                    Click{" "}
                    <a
                      onClick={onClose}
                      href={applyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      here
                    </a>{" "}
                    to continue with the application process.
                  </li>
                  <li>
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
    } else {
      applyThisJob(id);
    }
  };

  withdrawJob = () => {
    const {
      id,
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

  render() {
    const {
      id,
      title,
      company,
      location,
      jobWorkType,
      closeDate,
      salaryHrStart,
      salaryHrEnd,
      description,
      showJobPopup,
      applyThisJob,
      deleteThisJob,
      saveThisJob,
      removeThisJob,
      logo,
      data,
      score,
      isSaved,
      isApplied,
      inProgress,
      applyLink,
      activeJobName,
      job
    } = this.props;

    // const { activeJobName } = this.props;
    // const isUnnanuJob = activeJobName.includes("unnanu");

    // // Use is_saved from job data for Google/X jobs, otherwise use the saved jobs list check
    // const isJobSaved = !isUnnanuJob ? isSaved : this.checkIfSave(id);
    // const isJobApplied = !isUnnanuJob ? isApplied : this.checkIfApplied(id);

    // const saveBtnText = isJobSaved ? "Saved" : "Save";

    const jobNameURL = prepareURLName({ title, company });
    // const jobNameURL = "UJID";
    let applyBtnText = isApplied
      ? "Applied"
      : inProgress
      ? "In Process"
      : "Apply Now";
    if (this.checkIfExpired(closeDate)) {
      applyBtnText = isApplied ? "Applied" : "Expired";
    }
    let jobLocationType = "";
    if (jobWorkType) {
      if (typeof jobWorkType === "string") {
        jobLocationType = jobWorkType;
      } else if (typeof jobWorkType === "object" && jobWorkType.length === 2) {
        jobLocationType = "Hybrid";
      } else if (typeof jobWorkType === "object" && jobWorkType.length === 1) {
        jobLocationType = jobWorkType[0].split(" - ")[1];
      }
    }
    const loctag = {
      marginLeft: "13px",
      padding: "0 13px",
      height: "25px",
      lineHeight: "24px",
      display: "inline-block",
      fontSize: "12px",
      borderRadius: "12.5px",
      border: "solid 1px rgba(0, 0, 0, 0.12)",
      backgroundColor: "#ffffff",
    };

    const deleteButton = (
      <SubmitButton
        submitting={false}
        btnType="submit"
        btnState="delete"
        handleClick={() => deleteThisJob(id)}
      />
    );

    const saveButton = isSaved ? (
      <SubmitButton
        submitting={false}
        text="Saved"
        btnType="submit"
        btnState="saved"
        handleClick={() => removeThisJob(id, data)}
      />
    ) : (
      <SubmitButton
        submitting={false}
        text="Save"
        btnType="submit"
        btnState="save"
        handleClick={() => saveThisJob(id, data)}
      />
    );

    const applyButton = isApplied ? (
      <SubmitButton
        submitting={false}
        text="Applied"
        btnType="submit"
        btnState="applied"
        handleClick={this.withdrawJob}
      />
    ) : inProgress ? (
      <SubmitButton
        submitting={false}
        text="In Process"
        btnType="submit"
        btnState="in-progress"
        handleClick={this.handleApplyClick}
      />
    ) : (
      <SubmitButton
        submitting={false}
        text={applyBtnText}
        btnType="submit"
        btnState="apply"
        handleClick={
          activeJobName === "unnanu"
            ? this.handleApplyClick
            : this.handleExternalJobInProcessClick
        }
        disabled={this.checkIfExpired(closeDate)}
      />
    );

    const displayDescription =
      description === "" || description === "<div><p></p></div>"
        ? this.getFallbackDescription(title, location, company)
        : this.htmlToPlainText(description);

    return (
      <div
        className="result-card"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <span className="job-score-wrapper">
          <JobScore value={score} />
        </span>
        <a className="result-company-logo" href="#">
          <img src={imageURL(logo)} alt={`${company} Logo`} />
        </a>
        <div className="card-text-content">
          <div className="result-card-header">
            <div className="job-title">
              <a
                onClick={
                  (e) => showJobPopup(e, id, jobNameURL, job) // href={`/job/${id}/${jobNameURL}`}
                }
              >
                {title}
              </a>
              {jobLocationType !== "N/A" && (
                <span style={loctag}>{jobLocationType}</span>
              )}
            </div>
            <div className="job-company-location">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="14"
                viewBox="0 0 10 14"
              >
                <g fill="#000" fillRule="nonzero" opacity=".2">
                  <path
                    d="M8.607 12.665H.464a.464.464 0 1 0 0 .93h8.143a.464.464 0 1 0 0-.93zM8.607.506a.464.464 0 0 0-.465-.464H.93a.464.464 0 0 0-.464.464v11.722h8.142V.506zm-4.973 8.58h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm2.705 5.41h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929zm0-1.803h-.902a.464.464 0 1 1 0-.93h.902a.464.464 0 1 1 0 .93zm0-1.804h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .93zm0-1.803h-.902a.464.464 0 1 1 0-.929h.902a.464.464 0 1 1 0 .929z"
                  />
                </g>
              </svg>
              <div>{`${company} · ${location}`}</div>
            </div>
            {formatSalary(salaryHrStart, salaryHrEnd) !== "Salary Not Specified" && (<div className="job-salary-range">
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
              <div>{formatSalary(salaryHrStart, salaryHrEnd)}</div>
            </div>)}

          </div>
          <div className="result-card-ui-actions">
            {deleteButton}
            {saveButton}
            {applyButton}
            {isValidDate(data.closing_date) &&
            <div className="timestamp" style={{color: "#222"}}>
              Close: <Moment format="MMM Do YYYY">{data.closing_date}</Moment>
            </div>
            }
          </div>
          {/* <div className="result-card-description" dangerouslySetInnerHTML={{__html: description}} /> */}
          <div className="result-card-description"> {displayDescription} </div>
          {/*  {this.convertToPlain(description)} */}
          <SubmitButton
            submitting={false}
            text={applyBtnText}
            btnType="submit"
            btnState={isApplied ? "mobile-applied" : "mobile-apply"}
            handleClick={!isApplied ? this.handleApplyClick : null}
            disabled={this.checkIfExpired(closeDate)}
          />
          {/* <div className="timestamp-mobile"><Moment fromNow ago>{time}</Moment> ago</div> */}
          <div className="timestamp-mobile" style={{color: "#222"}}>
            Closes on <Moment format="MMM Do YYYY">{data.closing_date}</Moment>
          </div>
        </div>
      </div>
    );
  }
}

CustomJobsCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
  jobWorkType: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  closeDate: PropTypes.string.isRequired,
  salaryHrStart: PropTypes.string,
  salaryHrEnd: PropTypes.string,
  // time: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showJobPopup: PropTypes.func.isRequired,
  applyThisJob: PropTypes.func.isRequired,
  saveThisJob: PropTypes.func.isRequired,
  removeThisJob: PropTypes.func.isRequired,
  logo: PropTypes.string,
  data: PropTypes.object.isRequired,
  score: PropTypes.number.isRequired,
  location: PropTypes.string.isRequired,
  // isSaved: PropTypes.bool.isRequired,
  // isApplied: PropTypes.bool.isRequired,
  // salary_type_text: string;
  applyLink: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    token: app.token,
    activeJobName: app.activeJobName,
    savedJobs: app.savedJobs,
    savedJobsList: app.savedJobsList,
    savedGoogleJobsList: app.savedGoogleJobsList,
    savedXJobsList: app.savedXJobsList,
    appliedJobs: app.appliedJobs,
    appliedJobsList: app.appliedJobsList,
    appliedGoogleJobsList: app.appliedGoogleJobsList,
    appliedXJobsList: app.appliedXJobsList,
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
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(CustomJobsCard)
);
