import React, { Component } from "react";
import PropTypes from "prop-types";
import Router from "next/router";
import Link from "next/link";
import { confirmAlert } from "react-confirm-alert";
import { imageURL, prepareURLName } from "services/utils";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import ExternalJob from "../external-job";

class JobItem extends Component {
  constructor(props) {
    super(props);
    this.showSimilarJob = this.showSimilarJob.bind(this);
  }

  showSimilarJob = (e, id, urlname) => {
    e.preventDefault();
    const { jobId } = this.props;
    Router.push(`/job/${jobId}/${urlname}`);
    // Router.push(`/?jobId=${id}`, `/job?id=${id}`);
  };

  openExternalJobPopup = (jobId, job, activeJobName="") => {
    confirmAlert({
      customUI: ({ onClose }) => (
        <ExternalJob activeJobName={activeJobName} jobId={jobId} job={job} onClose={onClose} />
      ),
      closeOnClickOutside: true,
      closeOnEscape: true,
    });
  };

  render() {
    const {
      company,
      logo,
      jobId,
      title,
      isPopup,
      showJobPopup,
      activeJobName,
      job,
    } = this.props; // Added onClick
    const jobNameURL = prepareURLName({ title, company });

    return (
      <div className="widget-job">
        {activeJobName === "unnanu" ? (
          <Link href={`/job/${jobId}/${jobNameURL}`}>
            <a
              href={`/job/${jobId}/${jobNameURL}`}
              onClick={
                isPopup ? (e) => showJobPopup(e, jobId, jobNameURL) : null
              }
            >
              <span className="company-logo">
                <img src={imageURL(logo)} />
              </span>
              <div className="job-texts">
                <div className="job-title">{title}</div>
                <div className="company-name">{company}</div>
              </div>
            </a>
          </Link>
        ) : (
          <div
            style={{ cursor: "pointer" }}
            onClick={() => this.openExternalJobPopup(jobId, job, activeJobName)}
          >
            <span className="company-logo">
              <img src={imageURL(logo)} />
            </span>
            <div className="job-texts">
              <div className="job-title">{title}</div>
              <div className="company-name">{company}</div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

JobItem.propTypes = {
  title: PropTypes.string.isRequired,
  company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  activeJobName: state.app.activeJobName,
});

export default withRedux(Store, mapStateToProps)(withReduxSaga(JobItem));
