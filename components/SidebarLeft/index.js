import React, { Component } from "react";
import PropTypes from "prop-types";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import JobsList from "../JobsList";
import JobExtractActivity from "../JobExtractActivity";

class SidebarLeft extends Component {
  constructor(props) {
    super(props);
  }

  getAppliedJobs = () => {
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

  render () {
    const {
      isLogged,
      user,
      activeJobName,
      popularJobs,
      jobExtractActivity,
    } = this.props;
    const isUserLogged = isLogged && user;
    const appliedJobs = this.getAppliedJobs();
    const location =
      popularJobs.length > 0 ? popularJobs[0].location : "Austin, TX";

    return (
      <div className="left-sidebar">
        {isUserLogged ? (
          <>
            {appliedJobs && appliedJobs.length > 0 ? (
              <JobsList
                heading={`Applied ${activeJobName[0].toUpperCase() +
                activeJobName.substring(1)} Jobs`}
                jobs={appliedJobs}
                isAppliedJobs
              />
            ) : (
              <div className="widget">
                <div className="widget-title">
                  Applied{" "}
                  {activeJobName[0].toUpperCase() + activeJobName.substring(1)}{" "}
                  jobs
                </div>
                <div className="widget-list widget-jobs-list empty">
                  <div className="empty-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="46"
                      height="46"
                      viewBox="0 0 46 46"
                      fill="none"
                      stroke="#D3D3D3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path
                        d="M7.667 13.417h30.666a3.833 3.833 0 0 1 3.834 3.833v19.167a3.833 3.833 0 0 1-3.834 3.833H7.667a3.833 3.833 0 0 1-3.834-3.833V17.25a3.833 3.833 0 0 1 3.834-3.833"/>
                      <path
                        d="M30.667 40.25V9.583a3.833 3.833 0 0 0-3.833-3.833h-7.667a3.833 3.833 0 0 0-3.833 3.833V40.25"/>
                    </svg>
                  </div>
                  <div className="empty-text">
                    You haven&apos;t applied to any
                    <br/>
                    {activeJobName[0].toUpperCase() +
                      activeJobName.substring(1)}{" "}
                    jobs yet.
                  </div>
                </div>
              </div>
            )}
            {jobExtractActivity && jobExtractActivity.length > 0 && (
              <JobExtractActivity activity={jobExtractActivity}/>
            )}
          </>
        ) : (
          <JobsList
            heading={`Popular Jobs in ${location}`}
            jobs={popularJobs}
            isPopularJobs
          />
        )}
      </div>
    );
  }
}

SidebarLeft.propTypes = {
  // title: PropTypes.string.isRequired,
  // company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    isLogged: app.isLogged,
    user: app.user,
    popularJobs: app.popularJobs,
    activeJobName: app.activeJobName,
    appliedJobs: app.appliedJobs,
    appliedGoogleJobs: app.appliedGoogleJobs,
    appliedXJobs: app.appliedXJobs,
    appliedIndeedJobs: app.appliedIndeedJobs,
    appliedLinkedinJobs: app.appliedLinkedinJobs,
    appliedGlassdoorJobs: app.appliedGlassdoorJobs,
    appliedZiprecruiterJobs: app.appliedZiprecruiterJobs,
    jobExtractActivity: app.jobExtractActivity,
  };
};

export default withRedux(Store, mapStateToProps)(withReduxSaga(SidebarLeft));
