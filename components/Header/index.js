import React, { Component } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Link from "next/link";
import urls from "services/api/urls";
import { resetSorting } from "store/posts/actions";
import { signOut } from "store/app/actions";
import { prepareURLQuery } from "services/utils";
import {
  isChrome,
  isEdge,
  isFirefox,
  isIE,
  isMobile,
  isMobileSafari,
  isOpera,
  isSafari, 
} from "react-device-detect";
import { parseCookies } from "nookies";

import LocationSearch from "components/LocationSearch";
import JobSearch from "components/JobSearch";
import MobileSearch from "components/MobileSearch";
import MobileSuggestions from "components/MobileSearch/suggestions";
import { clearToken } from "store/localStorage";

import JobFilters from "./filters";
// use static SVG banner instead of inline Logo component
import LoggedIn from "./loggedIn";
import MobileDownload from "./mobileDownload";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      direction: "",
      lastScrollPos: 0,
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillMount() {}

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const lastScrollY = window.scrollY;
    const { deviceInfo } = this.props;
    if (!deviceInfo.isMobile) {
      if (this.state.lastScrollPos > lastScrollY) {
        this.setState(
          {
            direction: "top",
            lastScrollPos: lastScrollY,
          },
          () => {
            if (this.refs.headerRef) {
              this.refs.headerRef.style.marginTop = `0px`;
            }
          }
        );
      } else if (this.state.lastScrollPos < lastScrollY) {
        this.setState(
          {
            direction: "bottom",
            lastScrollPos: lastScrollY,
          },
          () => {
            if (this.refs.headerRef) {
              this.refs.headerRef.style.marginTop = `-${
                lastScrollY > 70 ? "70" : lastScrollY
              }px`;
            }
          }
        );
      }
    }
  };

  signup = (e) => {
    e.preventDefault();
    window.location = `${urls.Recruit}/signup?service=findjobs`;
  };

  async signout(e) {
    e.preventDefault();
    const { appData, userSignOut } = this.props;
    const cookies = parseCookies();
    await userSignOut(cookies.token);
    clearToken();
  }

  resetFilters = () => {
    const { resetFilterSorting, urlDetails, location } = this.props;
    resetFilterSorting({
      sortBy: 0,
      jobType: "All job types",
      workType: "All work types",
      closeDate: "Closing anytime",
      salaryEstimate: "All salary estimates",
    });
  };

  render() {
    const {
      enableSearch,
      urlDetails,
      userData,
      location,
      deviceInfo,
      cookie,
      notifications,
      showMobileSearch,
      jobCount,
      keyword,
    } = this.props;
    const isUserLogged = userData.isLogged && userData.user;

    const queryDetails = {
      keyword: keyword,
      location: location,
    };

    const queryParams = prepareURLQuery(queryDetails);

    let header;
    if (
      isMobile &&
      !isChrome &&
      !isFirefox &&
      !isSafari &&
      !isOpera &&
      !isIE &&
      !isEdge &&
      !isMobileSafari
    ) {
      header = <div />;
    } else if (isUserLogged) {
      header = <LoggedIn userData={userData} urlDetails={urlDetails} />;
    } else {
      header = (
        <div className="guest-user-navigation container">
          <nav className="navbar navbar-expand-lg navbar-dark bg-transparent">
            <Link href={urls.Links.Landing}>
              <a className="navbar-brand" style={{ margin: "0" }}>
                <img src="/static/banners/unnanu-logo.svg" alt="Unnanu Jobs" style={{ height: 34 }} />
              </a>
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#mobileMenu"
              aria-controls="mobileMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse">
              <ul className="navbar-nav mx-auto">
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle site-nav-link" 
                    href="#" 
                    id="servicesDropdown" 
                    role="button" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false"
                    style={{ color: '#000' }}
                  >
                    Services
                  </a>
                  <div className="dropdown-menu" aria-labelledby="servicesDropdown">
                    {/* Add dropdown items here if needed */}
                  </div>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle site-nav-link" 
                    href="#" 
                    id="companiesDropdown" 
                    role="button" 
                    data-toggle="dropdown" 
                    aria-haspopup="true" 
                    aria-expanded="false"
                    style={{ color: '#000' }}
                  >
                    Companies
                  </a>
                  <div className="dropdown-menu" aria-labelledby="companiesDropdown">
                    {/* Add dropdown items here if needed */}
                  </div>
                </li>
                <li className="nav-item">
                  <a className="nav-link site-nav-link" href="#" style={{ color: '#000' }}>
                    Why Unnanu Jobs
                  </a>
                </li>
              </ul>
              <div className="user-menu-right d-flex my-2 my-lg-0">
                <a
                  href={`${urls.Recruit}/login?service=findjobs`}
                  className="nav-link login-link site-nav-link"
                  style={{ color: '#000' }}
                >
                  Login
                </a>
                <button
                  onClick={(e) => this.signup(e)}
                  className="btn my-0 signup-button"
                  type="submit"
                  style={{ color: '#fff', backgroundColor: '#317EFF' }}
                >
                  Sign Up Free
                </button>
              </div>
            </div>
          </nav>
        </div>
      );
    }

    return (
      <header className="app-header">
        {header}
        {!isUserLogged && enableSearch && (
          <div className="container">
            {isMobile ? (
              <MobileSearch urlDetails={urlDetails} />
            ) : (
              <div className="search-wrapper row mx-auto">
                <JobSearch urlDetails={urlDetails} />
                <LocationSearch urlDetails={urlDetails} />
              </div>
            )}
            <div className="collapse mobile-menu" id="mobileMenu">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a href="#" className="nav-link site-nav-link">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link site-nav-link">
                    Companies
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link site-nav-link">
                    Why Unnanu Jobs
                  </a>
                </li>
              </ul>
              <div className="mobile-download-app-ui">
                <div className="float-left">
                  <img
                    src="/static/banners/mobile-download-app-1.png"
                    srcSet="/static/banners/mobile-download-app-1@2x.png 2x, /static/banners/mobile-download-app-1@3x.png 3x"
                  />
                </div>
                <div className="float-right">
                  <img
                    src="/static/banners/mobile-download-app-2.png"
                    srcSet="/static/banners/mobile-download-app-2@2x.png 2x, /static/banners/mobile-download-app-2@3x.png 3x"
                  />
                </div>
                <div className="download-text">
                  Download Unnanu
                  <br />
                  to your mobile
                </div>
                <MobileDownload deviceInfo={deviceInfo} />
              </div>
            </div>
          </div>
        )}

        {!enableSearch && (
          <div className="container">
            <div className="collapse mobile-menu" id="mobileMenu">
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    Services
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    Companies
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    Why Unnanu Jobs
                  </a>
                </li>
              </ul>
              <div className="mobile-download-app-ui">
                <div className="float-left">
                  <img
                    src="/static/banners/mobile-download-app-1.png"
                    srcSet="/static/banners/mobile-download-app-1@2x.png 2x, /static/banners/mobile-download-app-1@3x.png 3x"
                  />
                </div>
                <div className="float-right">
                  <img
                    src="/static/banners/mobile-download-app-2.png"
                    srcSet="/static/banners/mobile-download-app-2@2x.png 2x, /static/banners/mobile-download-app-2@3x.png 3x"
                  />
                </div>
                <div className="download-text">
                  Download Unnanu
                  <br />
                  to your mobile
                </div>
                <MobileDownload deviceInfo={deviceInfo} />
              </div>
            </div>
          </div>
        )}

        {enableSearch && !isMobile && (
          <JobFilters urlDetails={urlDetails} userData={userData} />
        )}

        {jobCount > 0 && !showMobileSearch && isMobile && (
          <JobFilters urlDetails={urlDetails} userData={userData} />
        )}

        {isMobile && showMobileSearch && (
          <MobileSuggestions urlDetails={urlDetails} />
        )}
      </header>
    );
  }
}

const mapStateToProps = (state) => {
  const { app, posts } = state;

  return {
    appData: app,
    location: app.location,
    jobCount: posts.count,
    notifications: app.notifications,
    showMobileSearch: app.showMobileSearch,
    keyword: posts.facets.keyword,
  };
};

const mapDispatchToProps = (dispatch) => ({
  userSignOut: (data) => dispatch(signOut(data)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(Header)
);
