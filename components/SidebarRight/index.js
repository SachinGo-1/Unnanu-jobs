import React, { Component } from "react";
import PropTypes from "prop-types";
import urls from "services/api/urls";
import withReduxSaga from "next-redux-saga";
import withRedux from "next-redux-wrapper";
import Store from "store";
import JobsList from "../JobsList";

class SidebarRight extends Component {
  constructor(props) {
    super(props);
  }

  getSavedJobs() {
    const {
      activeJobName,
      savedJobs,
      savedGoogleJobs,
      savedXJobs,
      savedIndeedJobs,
      savedLinkedinJobs,
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
  }

  render() {
    const { isLogged, user, activeJobName } = this.props;
    const isUserLogged = isLogged && user;
    const savedJobs = this.getSavedJobs();

    return (
      <div className="right-sidebar">
        {isUserLogged ? (
          savedJobs && savedJobs.length > 0 ? (
            <JobsList
              heading={`Saved ${activeJobName[0].toUpperCase() +
                activeJobName.substring(1)} Jobs`}
              jobs={savedJobs}
              isSavedJobs
            />
          ) : (
            <div className="widget">
              <div className="widget-title">
                Saved{" "}
                {activeJobName[0].toUpperCase() + activeJobName.substring(1)}{" "}
                jobs
              </div>
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
                  {activeJobName[0].toUpperCase() +
                    activeJobName.substring(1)}{" "}
                  jobs yet.
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="unnanu-sidebar-cta unnanu-hire-cta">
            <div className="unnanu-hire-cta-logo">
              <img
                src="/static/banners/unnanu-hire-logo.png"
                alt="Unnanu Hire"
                style={{ display: "block", margin: "0 auto" }}
              />
            </div>
            <div className="unnanu-hire-cta-title">You want to hire?</div>
            <div className="unnanu-hire-cta-desc">
              Post unlimited jobs at Unnanu Hire and find the right talent
              you’re looking for.
            </div>
            <a href={urls.Links.Hire} className="btn unnanu-hire-cta-button">
              Try Unnanu Hire
            </a>
            <div className="unnanu-hire-cta-image">
              <img
                src="/static/banners/unnanu-hire-cta-image.png"
                srcSet="/static/banners/unnanu-hire-cta-image@2x.png 2x, /static/banners/unnanu-hire-cta-image@3x.png 3x"
              />
            </div>
          </div>
        )}
        <div className="unnanu-links">
          <a href={urls.Links.Terms}>Terms</a> ·{" "}
          <a href={urls.Links.Privacy}>Privacy</a> ·{" "}
          <a href={urls.Links.FAQ}>FAQ</a> ·{" "}
          <a href={urls.Links.About}>About</a>
        </div>
        <div className="copyright-text">
          © {new Date().getFullYear()} Unnanu, Inc.
        </div>
      </div>
    );
  }
}

SidebarRight.propTypes = {
  // title: PropTypes.string.isRequired,
  // company: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const { app } = state;
  return {
    isLogged: app.isLogged,
    user: app.user,
    activeJobName: app.activeJobName,
    savedJobs: app.savedJobs,
    savedGoogleJobs: app.savedGoogleJobs,
    savedXJobs: app.savedXJobs,
    savedIndeedJobs: app.savedIndeedJobs,
    savedLinkedinJobs: app.savedLinkedinJobs,
    savedGlassdoorJobs: app.savedGlassdoorJobs,
    savedZiprecruiterJobs: app.savedZiprecruiterJobs,
  };
};

export default withRedux(Store, mapStateToProps)(withReduxSaga(SidebarRight));
