import React, { Component } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Router from "next/router";

import { isIOS, isAndroid, isMobile } from "react-device-detect";

import LocationSearch from "components/LocationSearch";
import JobSearch from "components/JobSearch";
import MobileSearch from "components/MobileSearch";

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleFindJobs = this.handleFindJobs.bind(this);
  }

  handleFindJobs = () => {
    // Get the input values from the JobSearch and LocationSearch components
    const keywordInput = document.getElementById("autosuggest-search-unnanu");
    const locationInput = document.querySelector(".location-input");
    
    const keyword = keywordInput ? keywordInput.value : "";
    const location = locationInput ? locationInput.value : "";

    // Get current URL query parameters
    const { urlDetails } = this.props;
    const currentQuery = urlDetails?.query || {};

    // Navigate with the new search parameters
    Router.push({
      pathname: "/",
      query: {
        ...currentQuery,
        keyword: keyword || "",
        location: location || "",
        sort: 0,
        salary: "All salary estimates",
        jobtype: "All job types",
        worktype: "All work types",
        closedate: "Closing anytime",
      },
    });
  };

  render() {
    const { urlDetails } = this.props;
    return (
      <div className="search-wrapper row mx-auto">
        {isMobile ? (
          <MobileSearch urlDetails={urlDetails} />
        ) : (
          <div style={{ display: "flex", width: "100%", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            <JobSearch urlDetails={urlDetails} />
            <LocationSearch urlDetails={urlDetails} />
            <button 
              className="find-jobs-btn"
              onClick={this.handleFindJobs}
            >
              Find Jobs
            </button>
          </div>
        )}
      </div>
    );
  }
}

Search.propTypes = {
  // heading: PropTypes.string.isRequired,
  // jobs: PropTypes.instanceOf(Array),
};

export default Search;
