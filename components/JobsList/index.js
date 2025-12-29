import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";

import JobItem from "./jobItem";
import Modal from "../Modal/modal";

import { showOrHidePopup } from "store/app/actions";

class JobsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      jobId: null,
      modalType: "AppliedJobs",
    };
    this.dismissModal = this.dismissModal.bind(this);
    this.openModal = this.openModal.bind(this);
    this.showJobPopup = this.showJobPopup.bind(this);
    this.getJobs = this.getJobs.bind(this);
  }

  componentDidMount() {
    this.setState({
      modalType: this.props.isAppliedJobs ? "AppliedJobs" : "SavedJobs",
    });
  }

  getJobs(activeJobName, isSavedJobs, isAppliedJobs) {
    const {
      savedJobs,
      savedGoogleJobs,
      savedXJobs,
      savedIndeedJobs,
      savedLinkedinJobs,
      savedGlassdoorJobs,
      savedZiprecruiterJobs,
      appliedJobs,
      appliedGoogleJobs,
      appliedXJobs,
      appliedIndeedJobs,
      appliedLinkedinJobs,
      appliedGlassdoorJobs,
      appliedZiprecruiterJobs,
    } = this.props;

    // If it's specifically for applied jobs, return applied jobs regardless of isSavedJobs flag
    if (isAppliedJobs) {
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

    // For saved jobs or other cases
    if (isSavedJobs) {
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
    }
  }

  dismissModal() {
    // const { popupShowHide } = this.props;
    // popupShowHide(false);
    document.body.classList.remove("modal-open");
    this.setState({ isModalOpen: false, jobId: null });
  }

  openModal() {
    document.body.classList.add("modal-open");
    this.setState({
      isModalOpen: true,
    });
  }

  showJobPopup(e, id, jobNameURL) {
    e.preventDefault();
    const { popupShowHide } = this.props;
    popupShowHide(true);
    document.body.classList.add("modal-open");
    let param = "saved";
    if (this.props.isAppliedJobs) {
      param = "applied";
    } else if (this.props.isSimilarJobs) {
      param = "similar";
    } else if (this.props.isPopularJobs) {
      param = "popular";
    }
    Router.push(`/?jobId=${id}&${param}=true`, `/job/${id}/${jobNameURL}`);
  }

  loadNextOrPrevious(id) {
    // Router.push(`/?jobId=${id}`, `/job?id=${id}`);
    this.setState({ jobId: id });
  }

  render() {
    const {
      heading,
      jobs,
      isSavedJobs,
      isAppliedJobs,
      isPopup = false,
      isSimilarJobs = false,
      isPopularJobs = false,
      activeJobName,
    } = this.props;
    const { isModalOpen, modalType, jobId } = this.state;

    const getJobs = this.getJobs(activeJobName, isSavedJobs, isAppliedJobs);
    // const getJobs = isAppliedJobs ? appliedJobs : isSavedJobs ? savedJobs : jobs;
    const showBtn =
      (isAppliedJobs || isSavedJobs) &&
      (activeJobName === "unnanu"
        ? getJobs && getJobs.length > 5
        : getJobs && getJobs.length > 0);
    // const showBtn = (isAppliedJobs || isSavedJobs) && (jobs && jobs.length > 5);
    const showJobs = showBtn
      ? getJobs
          .sort(function(a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
          })
          .slice(0, 5)
      : jobs;
    const noSavedJobs = isSavedJobs && getJobs.length === 0;
    const noAppliedJobs = isAppliedJobs && getJobs.length === 0;

    return (
      <div className="widget">
        {((jobs && jobs.length > 0) || isSavedJobs || isAppliedJobs) && (
          <label className="widget-title">{heading}</label>
        )}
        {noSavedJobs && (
          <div className="widget-list widget-jobs-list empty">
            <div className="empty-icon">
              <svg width="27" height="46" viewBox="0 0 27 46">
                <path
                  fill="#000"
                  fillOpacity=".12"
                  fillRule="nonzero"
                  d="M3.039 45.464L13.5 34.612l10.461 10.852c.348.357.782.536 1.26.536.216 0 .433-.045.694-.134.65-.268 1.085-.938 1.085-1.697V1.83C27 .804 26.219 0 25.22 0H1.78C.78 0 0 .804 0 1.831V44.17c0 .76.434 1.384 1.085 1.697.695.268 1.476.134 1.954-.402zM24.81 2.156v40.25l-9.879-10.062a1.97 1.97 0 0 0-1.432-.598c-.543 0-1.037.2-1.432.598L2.189 42.406V2.156h22.622z"
                />
              </svg>
            </div>
            <div className="empty-text">
              You haven&apos;t saved any
              <br />
              {activeJobName[0].toUpperCase() + activeJobName.substring(1)} jobs
              yet.
            </div>
          </div>
        )}
        {noAppliedJobs && (
          <div className="widget-list widget-jobs-list empty">
            <div className="empty-icon">
              <svg width="27" height="46" viewBox="0 0 27 46">
                <path
                  fill="#000"
                  fillOpacity=".12"
                  fillRule="nonzero"
                  d="M3.039 45.464L13.5 34.612l10.461 10.852c.348.357.782.536 1.26.536.216 0 .433-.045.694-.134.65-.268 1.085-.938 1.085-1.697V1.83C27 .804 26.219 0 25.22 0H1.78C.78 0 0 .804 0 1.831V44.17c0 .76.434 1.384 1.085 1.697.695.268 1.476.134 1.954-.402zM24.81 2.156v40.25l-9.879-10.062a1.97 1.97 0 0 0-1.432-.598c-.543 0-1.037.2-1.432.598L2.189 42.406V2.156h22.622z"
                />
              </svg>
            </div>
            <div className="empty-text">
              You haven&apos;t applied to any
              <br />
              {activeJobName[0].toUpperCase() + activeJobName.substring(1)} jobs
              yet.
            </div>
          </div>
        )}

        <div className="widget-list widget-jobs-list">
          {showJobs &&
            showJobs.map((item, key) => (
              <JobItem
                key={key}
                title={item.title}
                company={item.company}
                logo={item.logo}
                jobId={item.id}
                job={item}
                showJobPopup={this.showJobPopup}
                isPopup={
                  isPopup || isSavedJobs || isAppliedJobs || isPopularJobs
                }
              />
            ))}
          {showBtn && (
            <button
              onClick={() => this.openModal()}
              className="btn view-all-btn"
            >
              {getJobs.length === 1 ? "View" : "View All"}
            </button>
          )}

          {isModalOpen && (
            <Modal // id={isAppliedJobs ? "applied" : "saved"}
              onDismiss={this.dismissModal}
              type={isAppliedJobs ? "AppliedJobs" : "SavedJobs"}
              data={getJobs}
            />
          )}
        </div>
      </div>
    );
  }
}

JobsList.propTypes = {
  heading: PropTypes.string.isRequired,
  jobs: PropTypes.instanceOf(Array),
};

const mapStateToProps = (state) => {
  const { app } = state;

  return {
    activeJobName: app.activeJobName,
    savedJobs: app.savedJobs,
    savedGoogleJobs: app.savedGoogleJobs,
    savedXJobs: app.savedXJobs,
    savedIndeedJobs: app.savedIndeedJobs,
    savedLinkedinJobs: app.savedLinkedinJobs,
    savedGlassdoorJobs: app.savedGlassdoorJobs,
    savedZiprecruiterJobs: app.savedZiprecruiterJobs,
    appliedJobs: app.appliedJobs,
    appliedGoogleJobs: app.appliedGoogleJobs,
    appliedXJobs: app.appliedXJobs,
    appliedIndeedJobs: app.appliedIndeedJobs,
    appliedLinkedinJobs: app.appliedLinkedinJobs,
    appliedGlassdoorJobs: app.appliedGlassdoorJobs,
    appliedZiprecruiterJobs: app.appliedZiprecruiterJobs,
  };
};

const mapDispatchToProps = (dispatch) => ({
  popupShowHide: (data) => dispatch(showOrHidePopup(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(JobsList)
);
