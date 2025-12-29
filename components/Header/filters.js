import React, { Component } from "react";
import withRedux from "next-redux-wrapper";
import withReduxSaga from "next-redux-saga";
import Store from "store";
import Router from "next/router";
import {
  changeClosingDate,
  changeJobType,
  changeSalaryEstimate,
  changeSortBy,
  changeWorkType,
  resetSorting,
} from "store/posts/actions";

import {
  prepareURLQuery,
} from "services/utils";

import urls from "services/api/urls";

import {
  setActiveJobName,
  fetchUnnanuJobs,
  fetchGoogleJobs,
  fetchXJobs,
  fetchIndeedJobs,
  fetchLinkedinJobs,
  fetchGlassdoorJobs,
  fetchZiprecruiterJobs,
  fetchSavedXJobs,
  fetchSavedGoogleJobs,
  fetchSavedIndeedJobs,
  fetchSavedLinkedinJobs,
  fetchSavedGlassdoorJobs,
  fetchSavedZiprecruiterJobs,
  fetchAppliedXJobs,
  fetchAppliedGoogleJobs,
  fetchAppliedIndeedJobs,
  fetchAppliedLinkedinJobs,
  fetchAppliedGlassdoorJobs,
  fetchAppliedZiprecruiterJobs,
} from "store/app/actions";

import moment from "moment";
import { setCookie } from "nookies"; // Replace Cookies import

class JobFilters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      salaryFilterType: 0,
      showMobileFilters: false,
      typesList: [
        { name: "Full time (Employee)", count: 0 },
        { name: "Full time (Contract)", count: 0 },
        { name: "Full time (Intern)", count: 0 },
        { name: "Full time (Volunteer)", count: 0 },
        { name: "Part time (Employee)", count: 0 },
        { name: "Part time (Contract)", count: 0 },
        { name: "Part time (Intern)", count: 0 },
        { name: "Part time (Volunteer)", count: 0 },
      ],
      workTypesList: [
        { name: "Schedule (M-F) - Onsite", count: 0 },
        { name: "Schedule (M-F) - Remote", count: 0 },
      ],
      dateTypes: [
        { type: "Today", count: 0 },
        { type: "Tomorrow", count: 0 },
        { type: "This week", count: 0 },
        { type: "Next week", count: 0 },
        { type: "In two weeks", count: 0 },
        { type: "In a month", count: 0 },
        { type: "In 30 days+", count: 0 },
      ],
      annualSalaryTypes: [],
    };
    this.getTypeCount = this.getTypeCount.bind(this);
    this.getDatesCount = this.getDatesCount.bind(this);
    this.getWorkTypeCount = this.getWorkTypeCount.bind(this);
    this.getSalaryRangesCount = this.getSalaryRangesCount.bind(this);
    this.sortByChange = this.sortByChange.bind(this);
    this.jobTypeChange = this.jobTypeChange.bind(this);
    this.workTypeChange = this.workTypeChange.bind(this);
    this.closeDateChange = this.closeDateChange.bind(this);
    this.salaryEstimateChange = this.salaryEstimateChange.bind(this);
    this.compileFilters = this.compileFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
  }

  componentDidMount() {
    this.compileFilters();
  }

  componentDidUpdate(prevProps, prevState) {
    const { filters } = this.props;
    const { salaryFilterType } = this.state;
    const oldsalaryFilterType = prevState.salaryFilterType;
    const {
      sortBy,
      salaryEstimate,
      jobType,
      workType,
      workTypes,
      closeDate,
      close,
      jobTypes,
      salary_annually,
    } = filters;
    const oldSortBy = prevProps.filters.sortBy;
    const oldsalaryEstimate = prevProps.filters.salaryEstimate;
    const oldjobType = prevProps.filters.jobType;
    const oldcloseDate = prevProps.filters.closeDate;
    const oldworkType = prevProps.filters.workType;

    const oldClose = prevProps.filters.close;
    const oldjobTypes = prevProps.filters.jobTypes;
    const oldworkTypes = prevProps.filters.workTypes;
    const oldSalaryAnnually = prevProps.filters.salary_annually;

    if (
      oldSortBy !== sortBy ||
      oldsalaryEstimate !== salaryEstimate ||
      oldjobType !== jobType ||
      oldworkType !== workType ||
      oldcloseDate !== closeDate
    ) {
      this.compileFilters();
    }

    if (
      JSON.stringify(oldClose) !== JSON.stringify(close) ||
      JSON.stringify(oldjobTypes) !== JSON.stringify(jobTypes) ||
      JSON.stringify(oldworkTypes) !== JSON.stringify(workTypes) ||
      JSON.stringify(oldSalaryAnnually) !== JSON.stringify(salary_annually)
    ) {
      this.compileFilters();
    }

    if (oldsalaryFilterType !== salaryFilterType) {
      this.compileFilters();
    }
  }

  getTypeCount = (type) => {
    const { filters = {} } = this.props;
    const { jobTypes, jobType } = filters;

    const selected = jobTypes.filter(function (obj) {
      return obj.value === type;
    })[0];

    try {
      if (jobType === "All job types" || jobType === type) {
        return selected.count;
      } else {
        return 0;
      }
    } catch (e) {
      return 0;
    }
  };

  getWorkTypeCount = (type) => {
    const { filters = {} } = this.props;
    const { workTypes, workType } = filters;

    const selected = workTypes.filter(function (obj) {
      return obj.value === type;
    })[0];

    try {
      if (workType === "All work types" || workType === type) {
        return selected.count;
      } else {
        return 0;
      }
    } catch (e) {
      return 0;
    }
  };

  getDatesCount = (type) => {
    let count = 0;
    const { filters = {} } = this.props;
    const { close, closeDate } = filters;

    const today = moment().endOf("day");
    const tomorrow = moment()
      .add(1, "days")
      .endOf("day");
    const thisWeek = moment().endOf("week");
    const nextWeekStart = moment()
      .utc()
      .add(1, "weeks")
      .startOf("week");
    const nextWeekEnd = moment()
      .utc()
      .add(1, "weeks")
      .endOf("week");
    const nextTwoWeeksStart = moment()
      .add(2, "weeks")
      .startOf("week");
    const nextTwoWeeksEnd = moment()
      .add(2, "weeks")
      .endOf("week");
    const inOneMonth = moment()
      .add(1, "months")
      .endOf("week");

    close.forEach(function (arrayItem) {
      let filter;
      const dateCheck = moment(arrayItem.value.replace("Z", "")).endOf("day");
      switch (type) {
        case 1:
          filter = dateCheck.isSame(today);
          break;
        case 2:
          filter =
            (dateCheck.isAfter(today) && dateCheck.isBefore(tomorrow)) ||
            dateCheck.isSame(tomorrow);
          break;
        case 3:
          filter = dateCheck.isBefore(thisWeek) || dateCheck.isSame(thisWeek);
          break;
        case 4:
          filter =
            (dateCheck.isAfter(nextWeekStart) &&
              dateCheck.isBefore(nextWeekEnd)) ||
            dateCheck.isSame(nextWeekStart) ||
            dateCheck.isSame(nextWeekEnd);
          break;
        case 5:
          filter =
            (dateCheck.isAfter(nextTwoWeeksStart) &&
              dateCheck.isBefore(nextTwoWeeksEnd)) ||
            dateCheck.isSame(nextTwoWeeksStart) ||
            dateCheck.isSame(nextTwoWeeksEnd);
          break;
        case 6:
          filter =
            dateCheck.isBefore(inOneMonth) || dateCheck.isSame(inOneMonth);
          break;
        case 7:
          filter = dateCheck.isAfter(inOneMonth);
          break;
        default:
          return dateCheck.isAfter(inOneMonth);
      }
      if (filter) {
        count = count + arrayItem.count;
      }
    });
    if (
      closeDate === "Closing anytime" ||
      closeDate === this.getDateTypeFromIndex(type)
    ) {
      return count;
    } else {
      return 0;
    }
  };

  getDateTypeFromIndex = (index) => {
    switch (index) {
      case 1:
        return "Today";
        break;
      case 2:
        return "Tomorrow";
        break;
      case 3:
        return "This week";
        break;
      case 4:
        return "Next week";
        break;
      case 5:
        return "In two weeks";
        break;
      case 6:
        return "In a month";
        break;
      case 7:
        return "In 30 days+";
        break;
      default:
        return "Closing anytime";
    }
  };

  getSalaryRangesCount = (index) => {
    let totalCount = 0;
    let salaryType = "Unspecified";

    const { filters = {} } = this.props;
    const { salaryFilterType } = this.state;
    const { salary_annually } = filters;
    let filterAnnual, filterAnnualEnd;
    let arr = [];

    if (index === 0) {
      filterAnnual = salary_annually.filter(function (el) {
        const baseValue = 50000;
        arr = el.value.split("-");
        return (
          parseInt(arr[0]) < baseValue &&
          parseInt(arr[0]) > 0 &&
          (parseInt(arr[1]) < baseValue && parseInt(arr[1]) > 0)
        );
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      salaryType = salaryFilterType === 0 ? "Below $50,000" : "Below $24";
    } else if (index === 6) {
      filterAnnual = salary_annually.filter(function (el) {
        arr = el.value.split("-");
        return parseInt(arr[0]) === 0 && parseInt(arr[1]) === 0;
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      salaryType = "Unspecified";
    } else {
      let lowerBound = index * 10000;
      // const upperBound = lowerBound + 20000;

      filterAnnual = salary_annually.filter(function (el) {
        arr = el.value.split("-");
        return parseInt(arr[0]) >= lowerBound || parseInt(arr[1]) >= lowerBound;
        // return el.value > lowerBound && el.value <= upperBound;
      });
      filterAnnual.forEach(function (arrayItem) {
        totalCount = totalCount + arrayItem.count;
      });

      lowerBound =
        salaryFilterType === 0 ? lowerBound : Math.floor(lowerBound / 2080);
      const lowerBoundFormat = lowerBound
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      salaryType = `$${lowerBoundFormat}+`;
    }

    return { type: salaryType, count: totalCount };
  };

  compileFilters() {
    const composeTypesList = [
      {
        name: "Full time (Employee)",
        count: this.getTypeCount("Full time (Employee)"),
      },
      {
        name: "Full time (Contract)",
        count: this.getTypeCount("Full time (Contract)"),
      },
      {
        name: "Full time (Intern)",
        count: this.getTypeCount("Full time (Intern)"),
      },
      {
        name: "Full time (Volunteer)",
        count: this.getTypeCount("Full time (Volunteer)"),
      },
      {
        name: "Part time (Employee)",
        count: this.getTypeCount("Part time (Employee)"),
      },
      {
        name: "Part time (Contract)",
        count: this.getTypeCount("Part time (Contract)"),
      },
      {
        name: "Part time (Intern)",
        count: this.getTypeCount("Part time (Intern)"),
      },
      {
        name: "Part time (Volunteer)",
        count: this.getTypeCount("Part time (Volunteer)"),
      },
    ];

    const composeWorkTypesList = [
      {
        name: "Schedule (M-F) - Onsite",
        count: this.getWorkTypeCount("Schedule (M-F) - Onsite"),
      },
      {
        name: "Schedule (M-F) - Remote",
        count: this.getWorkTypeCount("Schedule (M-F) - Remote"),
      },
    ];

    const composeDateTypes = [
      { type: "Today", count: this.getDatesCount(1) },
      { type: "Tomorrow", count: this.getDatesCount(2) },
      { type: "This week", count: this.getDatesCount(3) },
      { type: "Next week", count: this.getDatesCount(4) },
      { type: "In two weeks", count: this.getDatesCount(5) },
      { type: "In a month", count: this.getDatesCount(6) },
      { type: "In 30 days+", count: this.getDatesCount(7) },
    ];

    let composeAnnualSalaryTypes = [];
    let salaryFilterCount = this.getSalaryRangesCount(0);
    if (salaryFilterCount.count > 0) {
      composeAnnualSalaryTypes.push(salaryFilterCount);
    }
    let start = 5;
    while (start <= 13) {
      salaryFilterCount = this.getSalaryRangesCount(start);
      if (salaryFilterCount.count > 0) {
        composeAnnualSalaryTypes.push(salaryFilterCount);
      }
      start = start + 2;
    }
    salaryFilterCount = this.getSalaryRangesCount(6);
    if (salaryFilterCount.count > 0) {
      composeAnnualSalaryTypes.push(salaryFilterCount);
    }

    // filter date types empty objects
    const filterDateTypes = composeDateTypes.filter(function (el) {
      return el.count > 0;
    });

    // filter date types empty objects
    const filterTypesList = composeTypesList.filter(function (el) {
      return el.count > 0;
    });

    const filterWorkTypesList = composeWorkTypesList.filter(function (el) {
      return el.count > 0;
    });

    this.setState(
      {
        typesList: filterTypesList,
        dateTypes: filterDateTypes,
        workTypesList: filterWorkTypesList,
        annualSalaryTypes: composeAnnualSalaryTypes,
      },
      () => {
        //Set Cookies
        const { location, filters } = this.props;
        const filterCookie = {
          ...filters,
          location: location,
        };
        // Replace Cookies.set with setCookie
        setCookie(null, "filters", JSON.stringify(filterCookie), {
          maxAge: 1 * 24 * 60 * 60, // 1 Day
          path: "/",
        });
      }
    );
  }

  sortByChange(e, sort) {
    const { updateSortBy, urlDetails } = this.props;
    e.preventDefault();
    updateSortBy(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: "/",
      query: { ...urlDetails.query, sort: sort },
    });
  }

  jobTypeChange(e, sort) {
    const { updateJobType, urlDetails } = this.props;
    e.preventDefault();
    updateJobType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: "/",
      query: { ...urlDetails.query, jobtype: sort },
    });
  }

  workTypeChange(e, sort) {
    const { updateWorkType, urlDetails } = this.props;
    e.preventDefault();
    updateWorkType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: "/",
      query: { ...urlDetails.query, worktype: sort },
    });
  }

  closeDateChange(e, sort) {
    const { updateCloseDate, urlDetails } = this.props;
    e.preventDefault();
    updateCloseDate(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: "/",
      query: { ...urlDetails.query, closedate: sort },
    });
  }

  salaryEstimateChange(e, sort) {
    const { updateEstimateType, urlDetails } = this.props;
    e.preventDefault();
    updateEstimateType(sort);
    this.compileFilters();
    this.toggleMobileFilter(e);
    Router.push({
      pathname: "/",
      query: { ...urlDetails.query, salary: sort },
    });
  }

  toggleSalaryFilterType(e, value) {
    e.preventDefault();
    this.setState({
      salaryFilterType: value,
    });
    document.getElementById("salaryFilterDiv").classList.add("show");
    document.getElementById("salaryFilterContent").classList.add("show");
    this.compileFilters();
  }

  toggleMobileFilter(e) {
    e.preventDefault();
    this.setState({
      showMobileFilters: !this.state.showMobileFilters,
    });
  }

  toggleNone(e) { }

  resetFilters = () => {
    const { resetFilterSorting } = this.props;
    resetFilterSorting({
      sortBy: 0,
      jobType: "All job types",
      workType: "All work types",
      closeDate: "Closing anytime",
      salaryEstimate: "All salary estimates",
    });
  };

  handleJobSourceClick = (jobName) => {
    const {
      setActiveJobName,
      appData,
      fetchGoogleJobs,
      fetchGlassdoorJobs,
      fetchIndeedJobs,
      fetchLinkedinJobs,
      fetchZiprecruiterJobs,
      fetchXJobs,
      fetchUnnanuJobs,
      fetchSavedXJobs,
      fetchSavedGoogleJobs,
      fetchSavedIndeedJobs,
      fetchSavedLinkedinJobs,
      fetchSavedGlassdoorJobs,
      fetchSavedZiprecruiterJobs,
      fetchAppliedXJobs,
      fetchAppliedGoogleJobs,
      fetchAppliedIndeedJobs,
      fetchAppliedLinkedinJobs,
      fetchAppliedGlassdoorJobs,
      fetchAppliedZiprecruiterJobs,
    } = this.props;

    // First set the active job name
    setActiveJobName(jobName);

    // Then fetch the appropriate job data if user is logged in and data isn't already present
    if (appData.isLogged && appData.token) {
      switch (jobName) {
        case "google":
          if (!appData.isChecked.google) {
            fetchGoogleJobs(appData.token);
            fetchAppliedGoogleJobs(appData.token);
            fetchSavedGoogleJobs(appData.token);
          }
          break;
        case "x":
          if (!appData.isChecked.x) {
            fetchXJobs(appData.token);
            fetchAppliedXJobs(appData.token);
            fetchSavedXJobs(appData.token);
          }
          break;
        case "indeed":
          if (!appData.isChecked.indeed) {
            fetchIndeedJobs(appData.token);
            fetchAppliedIndeedJobs(appData.token);
            fetchSavedIndeedJobs(appData.token);
          }
          break;
        case "linkedin":
          if (!appData.isChecked.linkedin) {
            fetchLinkedinJobs(appData.token);
            fetchAppliedLinkedinJobs(appData.token);
            fetchSavedLinkedinJobs(appData.token);
          }
          break;
        case "glassdoor":
          if (!appData.isChecked.glassdoor) {
            fetchGlassdoorJobs(appData.token);
            fetchAppliedGlassdoorJobs(appData.token);
            fetchSavedGlassdoorJobs(appData.token);
          }
          break;
        case "ziprecruiter":
          if (!appData.isChecked.ziprecruiter) {
            fetchZiprecruiterJobs(appData.token);
            fetchAppliedZiprecruiterJobs(appData.token);
            fetchSavedZiprecruiterJobs(appData.token);
          }
          break;
        default:
      }
    }
  };

  getJobCount = (jobType) => {
    const { jobsHeaderCount } = this.props;
    const jobTypeMap = {
      unnanu: "unnanujobs",
      google: "googlejobs",
      ziprecruiter: "zip_recruiterjobs",
      x: "xjobs",
      glassdoor: "glassdoorjobs",
      linkedin: "linkedinjobs",
      indeed: "indeedjobs",
    };

    const jobData = jobsHeaderCount.find(
      (item) => item.jb === jobTypeMap[jobType]
    );
    return jobData ? jobData.count : 0;
  };

  signup = (e) => {
    e.preventDefault();
    const { filters, location } = this.props;
    const {
      sortBy,
      salaryEstimate,
      jobType,
      workType,
      closeDate,
      keyword,
    } = filters;

    const userfilters = {
      sort: sortBy,
      salary: salaryEstimate,
      jobtype: jobType,
      worktype: workType,
      closedate: closeDate,
      keyword,
      location,
    };
    const queryParams = prepareURLQuery(userfilters);
    window.location = `${urls.Recruit}/signup?service=findjobs&${queryParams}`;
  };

  render() {
    const {
      salaryFilterType,
      typesList,
      workTypesList,
      dateTypes,
      annualSalaryTypes,
      showMobileFilters,
    } = this.state;
    const { setActiveJobName } = this.props;

    const jobTypesList = typesList.map(
      function (type, index) {
        return (
          <a
            key={index}
            onClick={(e) =>
              type.count != "-" ? this.jobTypeChange(e, type.name) : false
            }
            className={
              type.count > 0 ? "dropdown-item" : "dropdown-item no-data"
            }
          >
            {type.name}{" "}
            <span className="filter-property-count float-right text-center">
              {type.count > 0 ? type.count : "-"}
            </span>
          </a>
        );
      }.bind(this)
    );

    const allWorkTypesList = workTypesList.map(
      function (type, index) {
        return (
          <a
            key={index}
            onClick={(e) =>
              type.count != "-" ? this.workTypeChange(e, type.name) : false
            }
            className={
              type.count > 0 ? "dropdown-item" : "dropdown-item no-data"
            }
          >
            {type.name.split(" - ")[1]}{" "}
            <span className="filter-property-count float-right text-center">
              {type.count > 0 ? type.count : "-"}
            </span>
          </a>
        );
      }.bind(this)
    );

    const dateTypesList = dateTypes.map(
      function (date, index) {
        return (
          <a
            key={index}
            onClick={(e) =>
              date.count > 0 ? this.closeDateChange(e, date.type) : false
            }
            className={
              date.count > 0 ? "dropdown-item" : "dropdown-item no-data"
            }
          >
            {date.type}{" "}
            <span className="filter-property-count float-right text-center">
              {date.count > 0 ? date.count : "-"}
            </span>
          </a>
        );
      }.bind(this)
    );

    const annualSalaryList = annualSalaryTypes.map(
      function (salary, index) {
        return (
          <a
            key={index}
            onClick={(e) =>
              salary.count > 0
                ? this.salaryEstimateChange(e, salary.type)
                : false
            }
            className={
              salary.count > 0 ? "dropdown-item" : "dropdown-item no-data"
            }
          >
            {salary.type}{" "}
            <span className="filter-property-count float-right text-center">
              {salary.count > 0 ? salary.count : "-"}
            </span>
          </a>
        );
      }.bind(this)
    );

    const { filters, jobCount, userData, urlDetails, appData } = this.props;
    const sortBy = filters.sortBy === 0 ? "Relevance" : "Date";

    const searchResult =
      jobCount > 100
        ? `Showing ${jobCount}+ Results`
        : `Showing ${jobCount} Results`;

    // mobile filters
    const jobTypesMobileList = typesList.map(
      function (type, index) {
        return (
          <li
            key={index}
            onClick={(e) =>
              type.count != "-" ? this.jobTypeChange(e, type.name) : false
            }
          >
            {type.name}
            <span className="filter-property-count float-right text-center">
              {type.count > 0 ? type.count : "-"}
            </span>
          </li>
        );
      }.bind(this)
    );

    const workTypesMobileList = workTypesList.map(
      function (type, index) {
        return (
          <li
            key={index}
            onClick={(e) =>
              type.count != "-" ? this.workTypeChange(e, type.name) : false
            }
          >
            {type.name.split(" - ")[1]}
            <span className="filter-property-count float-right text-center">
              {type.count > 0 ? type.count : "-"}
            </span>
          </li>
        );
      }.bind(this)
    );

    const dateTypesMobileList = dateTypes.map(
      function (date, index) {
        return (
          <li
            key={index}
            onClick={(e) =>
              date.count > 0 ? this.closeDateChange(e, date.type) : false
            }
          >
            {date.type}
            <span className="filter-property-count float-right text-center">
              {date.count > 0 ? date.count : "-"}
            </span>
          </li>
        );
      }.bind(this)
    );

    const annualSalaryMobileList = annualSalaryTypes.map(
      function (salary, index) {
        return (
          <li
            key={index}
            onClick={(e) =>
              salary.count > 0
                ? this.salaryEstimateChange(e, salary.type)
                : false
            }
          >
            {salary.type}
            <span className="filter-property-count float-right text-center">
              {salary.count > 0 ? salary.count : "-"}
            </span>
          </li>
        );
      }.bind(this)
    );

    return (
      <div className="find-jobs-filters">
        <div
          className="filters-container row mx-auto"
          style={
            userData.isLogged && userData.user
              ? { justifyContent: "space-evenly" }
              : undefined
          }
        >
          <div className="filters-control-mobile-tab">
            <div className="result-header-mobile-tab float-left">
              {searchResult}
            </div>
            <button
              className="filters-button-mobile-tab float-right"
              onClick={(e) => this.toggleMobileFilter(e)}
            >
              Filters
            </button>
          </div>

          {userData.isLogged && userData.user ? (
            <>
              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("unnanu")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "unnanu"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Unnanu Jobs"
                  type="button"
                >
                  <svg width="20" height="16.571" viewBox="0 0 20 16.571">
                    <g fill="#266ADC">
                      <path d="M4.854 6.151c-.019-2.852 2.313-5.173 5.191-5.15 2.792.023 5.129 2.317 5.109 5.194-.019 2.818-2.35 5.151-5.191 5.134-2.83-.017-5.141-2.362-5.109-5.178" />
                      <path d="M10.704 16.033v-.198c0-.349.006-.698.001-1.047-.007-.543-.026-1.086.097-1.621.051-.222.131-.426.319-.573.118-.093.251-.154.393-.198a74 74 0 0 1 .993-.294c.527-.153 1.038-.343 1.496-.657a4.6 4.6 0 0 0 1.635-1.963c.285-.64.47-1.306.564-1.998.034-.254.046-.511.059-.767q.017-.353.015-.706c-.002-.459-.014-.918-.012-1.377.003-.897 0-1.794.027-2.69a2.03 2.03 0 0 1 .637-1.456c.253-.241.558-.364.901-.419.213-.034.419-.018.627.015.494.08.835.374 1.084.791.18.303.269.635.289.984q.025.429.032.858c.009.489.018.977.016 1.465-.002.564-.015 1.128-.026 1.692-.005.278-.009.556-.026.833a50 50 0 0 1-.094 1.271 11.4 11.4 0 0 1-.331 1.886c-.293 1.119-.785 2.139-1.519 3.037a7 7 0 0 1-1.44 1.336 9 9 0 0 1-2.257 1.171q-.725.25-1.482.359c-.612.088-1.225.169-1.837.252-.049.007-.099.007-.159.011m-1.471.008c-.21-.026-.402-.048-.593-.073l-1.075-.143c-1.109-.142-2.163-.456-3.143-1.004a9 9 0 0 1-1.47-1.001 7.3 7.3 0 0 1-1.438-1.667C.949 11.251.593 10.271.394 9.233A17 17 0 0 1 .105 6.26C.099 5.906.085 5.553.081 5.2.073 4.403.057 3.607.067 2.811c.006-.398-.001-.8.069-1.196C.223 1.116.435.688.835.366c.216-.173.467-.257.741-.297a1.9 1.9 0 0 1 .761.048c.453.119.78.402 1.011.802.218.377.309.788.309 1.222q-.001 2.097.002 4.194c.002.895.126 1.77.426 2.616.216.607.498 1.179.923 1.67.512.59 1.124 1.042 1.865 1.298.417.145.845.258 1.267.387.201.061.405.117.586.229a.78.78 0 0 1 .343.423c.079.237.129.48.141.729q.023.473.023.946c0 .274-.017.547-.019.821-.001.147.013.294.02.441.002.041 0 .082 0 .145" />
                    </g>
                  </svg>
                  {this.getJobCount("unnanu") > 0 &&
                    (this.getJobCount("unnanu") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("unnanu")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("indeed")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "indeed"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Indeed Jobs"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.638 17.969v-7.302a7 7 0 0 0 .632.029 5.5 5.5 0 0 0 2.792-.744v8.015c0 .685-.163 1.191-.479 1.528s-.733.504-1.243.504c-.5 0-.897-.168-1.223-.515-.315-.336-.478-.842-.478-1.516M9.658.472c2.121-.744 4.535-.704 6.349.823.338.307.723.694.876 1.15.183.577-.642-.061-.755-.139-.592-.378-1.182-.694-1.843-.912-3.568-1.071-6.942.864-9.039 3.869-.877 1.328-1.448 2.727-1.917 4.264-.05.168-.091.388-.183.535-.093.169-.04-.455-.04-.475.07-.636.203-1.25.367-1.864.969-3.276 3.108-6.001 6.185-7.251m4.107 5.883a2.517 2.517 0 1 1-5.033 0 2.517 2.517 0 1 1 5.033 0"
                      fill="#003a9b"
                    />
                  </svg>
                  {this.getJobCount("indeed") > 0 &&
                    (this.getJobCount("indeed") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("indeed")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("linkedin")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "linkedin"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Linkedin Jobs"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    data-supported-dps="24x24"
                    width="20"
                    height="20"
                  >
                    <path
                      d="M17.083 1.667H2.916a1.25 1.25 0 0 0-1.249 1.25v14.167a1.25 1.25 0 0 0 1.25 1.249h14.167a1.25 1.25 0 0 0 1.25-1.25V2.916a1.25 1.25 0 0 0-1.251-1.249M6.667 15.833h-2.5v-7.5h2.5zm-1.25-8.958a1.458 1.458 0 1 1 1.5-1.458 1.483 1.483 0 0 1-1.5 1.458m10.416 8.958h-2.5v-3.95c0-1.183-.5-1.608-1.15-1.608a1.45 1.45 0 0 0-1.35 1.55.6.6 0 0 0 0 .117v3.891h-2.5v-7.5h2.417v1.083A2.59 2.59 0 0 1 13 8.249c1.292 0 2.8.717 2.8 3.05z"
                      fill={
                        appData.activeJobName === "linkedin"
                          ? "#0077b5"
                          : "#0a66c2"
                      }
                    />
                  </svg>
                  {this.getJobCount("linkedin") > 0 &&
                    (this.getJobCount("linkedin") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("linkedin")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("google")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "google"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Google Jobs"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    xmlSpace="preserve"
                    width={20}
                    height={20}
                  >
                    <path
                      d="M5.563 10c0 .375.063.75.125 1.125L6.875 10 5.75 8.875q-.188.563-.188 1.125"
                      style={{ fill: "none" }}
                    />
                    <path
                      d="M10 14.438a4.37 4.37 0 0 1-4.25-3.25l-4.188 4.188A10.02 10.02 0 0 0 10 20c1.938 0 3.75-.563 5.313-1.563l-4.188-4.188q-.563.188-1.125.188"
                      style={{ fill: "#34a853" }}
                    />
                    <path
                      d="M20 8.625c-.063-.313-.313-.5-.625-.5H10c-.375 0-.625.25-.625.625v3.125c0 .375.25.625.625.625h3.313a4.5 4.5 0 0 1-2.188 1.75l4.188 4.188A9.93 9.93 0 0 0 20 10v-.438q.094-.375 0-.938"
                      style={{ fill: "#4285f4" }}
                    />
                    <path
                      d="M5.563 10c0-.375.063-.75.125-1.125L1.563 4.688C.563 6.25 0 8.063 0 10s.563 3.75 1.563 5.313l4.188-4.188q-.188-.563-.188-1.125"
                      style={{ fill: "#fbbc05" }}
                    />
                    <path
                      d="M17.813 3.75c-.688-.875-1.563-1.625-2.5-2.25C13.75.563 11.938 0 10 0a9.92 9.92 0 0 0-8.437 4.688l4.188 4.188C6.25 7 8 5.625 10 5.625q.563 0 1.125.188c.563.188 1.063.5 1.625.938.188.188.438.188.688.063l4.188-2.063a.47.47 0 0 0 .313-.438c.063-.188 0-.375-.125-.563"
                      style={{ fill: "#ea4335" }}
                    />
                  </svg>
                  {this.getJobCount("google") > 0 &&
                    (this.getJobCount("google") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("google")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("glassdoor")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "glassdoor"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Glassdoor Jobs"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#00a264"
                      d="M14.287 17.143H2.858A2.856 2.856 0 0 0 5.713 20h8.572a2.86 2.86 0 0 0 2.857-2.857V5.41a.103.103 0 0 0-.103-.104h-2.65a.104.104 0 0 0-.103.105v11.733zm0-17.143a2.86 2.86 0 0 1 2.856 2.858H5.715V14.59a.105.105 0 0 1-.104.104H2.962a.104.104 0 0 1-.104-.104V2.857A2.86 2.86 0 0 1 5.713 0z"
                    />
                  </svg>
                  {this.getJobCount("glassdoor") > 0 &&
                    (this.getJobCount("glassdoor") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("glassdoor")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("ziprecruiter")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "ziprecruiter"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="Ziprecruiter Jobs"
                  type="button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 0.35 0.35"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M.172.325A.02.02 0 0 1 .161.316a.02.02 0 0 1 0-.013C.162.301.167.295.169.295L.17.284V.273H.166a.1.1 0 0 0-.041.009L.121.284l.002.002a.02.02 0 0 1 .003.019.016.016 0 0 1-.028 0Q.092.291.108.279A.1.1 0 0 1 .156.263h.003V.232h.034V.26h.003q.045.007.058.027.003.003.002.008L.255.302.247.31H.235A.02.02 0 0 1 .226.3.02.02 0 0 1 .229.284L.231.282.228.28A.1.1 0 0 0 .187.271H.184v.022l.003.002a.02.02 0 0 1 .007.014.016.016 0 0 1-.019.014zM.093.222A.02.02 0 0 1 .079.211L.078.187V.166h.018l.001.005A.03.03 0 0 0 .105.19q.004.005.01.003L.151.188h.05l.043.005Q.254.188.255.171V.167h.019v.021c0 .02 0 .021-.002.024a.02.02 0 0 1-.014.011H.093zm.018-.04L.1.06Q.1.047.111.036.118.029.127.027C.132.025.134.025.175.025l.047.001A.04.04 0 0 1 .248.05C.25.056.25.06.244.122L.238.183.232.182a.3.3 0 0 0-.114 0L.112.183zM.065.158.06.152Q.059.147.063.143a.021.021 0 0 1 .035.01l.001.004H.065zM.252.157q0-.006.004-.011a.02.02 0 0 1 .02-.008q.018.005.013.017C.287.159.285.159.268.159H.252z"
                      fill="#45db61"
                    />
                  </svg>
                  {this.getJobCount("ziprecruiter") > 0 &&
                    (this.getJobCount("ziprecruiter") > 99 ? (
                      <span className="jobs-count">99+</span>
                    ) : (
                      <span className="jobs-count">
                        {this.getJobCount("ziprecruiter")}
                      </span>
                    ))}
                </button>
              </div>

              <div className="filter-item-desktop">
                <button
                  onClick={() => this.handleJobSourceClick("x")}
                  className="filter-item-button btn"
                  style={
                    appData.activeJobName === "x"
                      ? {
                        borderColor: "#266ADC",
                        borderWidth: "2px",
                        borderStyle: "solid",
                        padding: "5px",
                      }
                      : undefined
                  }
                  title="X Jobs"
                  type="button"
                >
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    width="20"
                    height="20"
                  >
                    <path d="M15.203 1.875h2.756l-6.023 6.882 7.085 9.367h-5.547l-4.345-5.681-4.971 5.683H1.4l6.441-7.363-6.796-8.888h5.688l3.928 5.192zm-.968 14.6h1.528L5.904 3.439h-1.64z" />
                  </svg>
                  {this.getJobCount("x") > 0 && (
                    <span className="jobs-count">{this.getJobCount("x")}</span>
                  )}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="filter-item-desktop">
                <button
                  className="filter-item-button btn dropdown-toggle"
                  type="button"
                  id="allJobTerms"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {filters.closeDate}
                </button>
                <div
                  className="dropdown-menu dropdown-closing-time"
                  aria-labelledby="allJobTerms"
                >
                  <a
                    className="dropdown-item"
                    onClick={(e) => this.closeDateChange(e, "Closing anytime")}
                  >
                    Closing Anytime
                  </a>
                  {dateTypesList}
                </div>
              </div>
              <div className="filter-item-desktop">
                <button
                  className="filter-item-button btn dropdown-toggle"
                  type="button"
                  id="allJobTitles"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {filters.jobType}
                </button>
                <div
                  className="dropdown-menu dropdown-job-types"
                  aria-labelledby="allJobTitles"
                >
                  <a
                    className="dropdown-item"
                    onClick={(e) => this.jobTypeChange(e, "All job types")}
                  >
                    All job types
                  </a>
                  {jobTypesList}
                </div>
              </div>
              <div className="filter-item-desktop">
                <button
                  className="filter-item-button btn dropdown-toggle"
                  type="button"
                  id="allWorkTitles"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {filters.workType !== "All work types"
                    ? filters.workType.split(" - ")[1]
                    : filters.workType}
                </button>
                <div
                  className="dropdown-menu dropdown-job-types"
                  aria-labelledby="allWorkTitles"
                >
                  <a
                    className="dropdown-item"
                    onClick={(e) => this.workTypeChange(e, "All work types")}
                  >
                    All work types
                  </a>
                  {allWorkTypesList}
                </div>
              </div>
              <div id="salaryFilterDiv" className="filter-item-desktop">
                <button
                  className="filter-item-button btn dropdown-toggle"
                  type="button"
                  id="allSalaryEstimates"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {filters.salaryEstimate}
                </button>
                <div
                  id="salaryFilterContent"
                  className="dropdown-menu dropdown-salary-estimates"
                  aria-labelledby="allSalaryEstimates"
                >
                  <div className="range-toggle">
                    <button
                      onClick={(e) => this.toggleSalaryFilterType(e, 0)}
                      className={
                        salaryFilterType === 0
                          ? "range-toggle-option active"
                          : "range-toggle-option"
                      }
                    >
                      Annually
                    </button>
                    <button
                      onClick={(e) => this.toggleSalaryFilterType(e, 1)}
                      className={
                        salaryFilterType === 1
                          ? "range-toggle-option active"
                          : "range-toggle-option"
                      }
                    >
                      Hourly
                    </button>
                  </div>
                  <a
                    className="dropdown-item"
                    onClick={(e) =>
                      this.salaryEstimateChange(e, "All salary estimates")
                    }
                  >
                    All salary estimates
                  </a>
                  {annualSalaryList}
                </div>
              </div>
              {/*<div className="filter-item-desktop ml-auto">*/}
              {/*  <span className="filter-label">Sort by</span>*/}
              {/*  <button className="filter-item-button has-border btn dropdown-toggle" type="button" id="allSalaryEstimates" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">*/}
              {/*    { sortBy }*/}
              {/*  </button>*/}
              {/*  <div className="dropdown-menu" aria-labelledby="allSalaryEstimates">*/}
              {/*    <a className="dropdown-item" onClick={(e) => this.sortByChange(e, 0)}>Relevance</a>*/}
              {/*    <a className="dropdown-item" onClick={(e) => this.sortByChange(e, 1)}>Date</a>*/}
              {/*  </div>*/}
              {/*</div>*/}
              <div
                className="filter-item-desktop"
                style={{
                  boxShadow: "0 1px 3px 0 rgba(168, 168, 168, 0.12)",
                  border: "solid 1px #317eff",
                  borderRadius: "16px",
                }}
              >
                <button
                  onClick={this.resetFilters}
                  className="filter-item-button btn"
                  type="button"
                >
                  Reset filters
                </button>
              </div>
              <div className="filter-item-desktop ml-auto"
              >
                <button
                  onClick={(e) => this.signup(e)}
                  className="btn signup-button jobs-for-you-btn shine-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="15"
                    viewBox="0 0 24 24"
                    stroke="#000"
                  >
                    <path
                      fill="#000"
                      fillRule="nonzero"
                      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    />
                    <path fill="#000" fillRule="nonzero" d="M20 3v4" />
                    <path fill="#000" fillRule="nonzero" d="M22 5h-4" />
                    <path fill="#000" fillRule="nonzero" d="M4 17v2" />
                    <path fill="#000" fillRule="nonzero" d="M5 18H3" />
                  </svg>{" "}
                  Jobs For You
                </button>
              </div>
            </>
          )}
        </div>

        {showMobileFilters && (
          <div className="mobile-filters-ui">
            <div className="filters-header">
              <div className="title float-left">Filters</div>
              <div
                className="close float-right"
                onClick={(e) => this.toggleMobileFilter(e)}
              >
                x
              </div>
            </div>
            <div className="filters-list-wrapper">
              <div className="filter-item">
                <div
                  className="filter-name collapsed"
                  onClick={this.toggleNone}
                  data-toggle="collapse"
                  href="#closingTimeSelect"
                  role="button"
                  aria-expanded="false"
                  aria-controls="closingTimeSelect"
                >
                  {filters.closeDate}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                  >
                    <path
                      fill="#777"
                      fillRule="nonzero"
                      d="M0 0l5.475 5.457L10.951 0z"
                    />
                  </svg>
                </div>
                <div
                  className="collapse filter-select-items-wrapper"
                  id="closingTimeSelect"
                >
                  <ul className="filter-select-list">
                    <li
                      onClick={(e) =>
                        this.closeDateChange(e, "Closing anytime")
                      }
                    >
                      Closing Anytime
                    </li>
                    {dateTypesMobileList}
                  </ul>
                </div>
              </div>
              <div className="filter-item">
                <div
                  className="filter-name collapsed"
                  onClick={this.toggleNone}
                  data-toggle="collapse"
                  href="#jobTermSelect"
                  role="button"
                  aria-expanded="false"
                  aria-controls="jobTermSelect"
                >
                  {filters.jobType}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                  >
                    <path
                      fill="#777"
                      fillRule="nonzero"
                      d="M0 0l5.475 5.457L10.951 0z"
                    />
                  </svg>
                </div>
                <div
                  className="collapse filter-select-items-wrapper"
                  id="jobTermSelect"
                >
                  <ul className="filter-select-list">
                    <li onClick={(e) => this.jobTypeChange(e, "All job types")}>
                      All job types
                    </li>
                    {jobTypesMobileList}
                  </ul>
                </div>
              </div>
              <div className="filter-item">
                <div
                  className="filter-name collapsed"
                  onClick={this.toggleNone}
                  data-toggle="collapse"
                  href="#workSelect"
                  role="button"
                  aria-expanded="false"
                  aria-controls="workSelect"
                >
                  {filters.workType !== "All work types"
                    ? filters.workType.split(" - ")[1]
                    : filters.workType}

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                  >
                    <path
                      fill="#777"
                      fillRule="nonzero"
                      d="M0 0l5.475 5.457L10.951 0z"
                    />
                  </svg>
                </div>
                <div
                  className="collapse filter-select-items-wrapper"
                  id="workSelect"
                >
                  <ul className="filter-select-list">
                    <li
                      onClick={(e) => this.workTypeChange(e, "All work types")}
                    >
                      All work types
                    </li>
                    {workTypesMobileList}
                  </ul>
                </div>
              </div>
              <div className="filter-item">
                <div
                  className="filter-name collapsed"
                  onClick={this.toggleNone}
                  data-toggle="collapse"
                  href="#salarySelect"
                  role="button"
                  aria-expanded="false"
                  aria-controls="salarySelect"
                >
                  {filters.salaryEstimate}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="11"
                    height="6"
                    viewBox="0 0 11 6"
                  >
                    <path
                      fill="#777"
                      fillRule="nonzero"
                      d="M0 0l5.475 5.457L10.951 0z"
                    />
                  </svg>
                </div>
                <div
                  className="collapse filter-select-items-wrapper"
                  id="salarySelect"
                >
                  <div className="range-toggle">
                    <button
                      onClick={(e) => this.toggleSalaryFilterType(e, 0)}
                      className={
                        salaryFilterType === 0
                          ? "range-toggle-option active"
                          : "range-toggle-option"
                      }
                    >
                      Annually
                    </button>
                    <button
                      onClick={(e) => this.toggleSalaryFilterType(e, 1)}
                      className={
                        salaryFilterType === 1
                          ? "range-toggle-option active"
                          : "range-toggle-option"
                      }
                    >
                      Hourly
                    </button>
                  </div>
                  <ul className="filter-select-list">
                    <li
                      onClick={(e) =>
                        this.salaryEstimateChange(e, "All salary estimates")
                      }
                    >
                      All salary estimates
                    </li>
                    {annualSalaryMobileList}
                  </ul>
                </div>
              </div>
              <hr />
              {/*<div className="filter-item">*/}
              {/*    <label>Sort by</label>*/}
              {/*    <div className="filter-name collapsed" onClick={this.toggleNone} data-toggle="collapse" href="#sortbySelect" role="button" aria-expanded="false" aria-controls="sortbySelect">{ sortBy }*/}
              {/*        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="6" viewBox="0 0 11 6">*/}
              {/*            <path fill="#777" fillRule="nonzero" d="M0 0l5.475 5.457L10.951 0z"/>*/}
              {/*        </svg>*/}
              {/*    </div>*/}
              {/*    <div className="collapse filter-select-items-wrapper" id="sortbySelect">*/}
              {/*        <ul className="filter-select-list">*/}
              {/*            <li onClick={(e) => this.sortByChange(e, 0)}>Relevance</li>*/}
              {/*            <li onClick={(e) => this.sortByChange(e, 1)}>Date</li>*/}
              {/*        </ul>*/}
              {/*    </div>*/}
              {/*</div>*/}
              <div className="filter-item">
                <button
                  onClick={this.resetFilters}
                  className="filter-name"
                  type="button"
                >
                  Reset filters
                </button>
              </div>
              <div className="filter-name">
                <button
                  onClick={(e) => this.signup(e)}
                  className="btn signup-button shine-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="15"
                    viewBox="0 0 24 24"
                    stroke="#000"
                  >
                    <path
                      fill="#000"
                      fillRule="nonzero"
                      d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
                    />
                    <path fill="#000" fillRule="nonzero" d="M20 3v4" />
                    <path fill="#000" fillRule="nonzero" d="M22 5h-4" />
                    <path fill="#000" fillRule="nonzero" d="M4 17v2" />
                    <path fill="#000" fillRule="nonzero" d="M5 18H3" />
                  </svg>{" "}
                  Jobs For You
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { posts, app } = state;
  return {
    filters: posts.facets,
    jobCount: posts.count,
    location: app.location,
    appData: app,
    jobsHeaderCount: app.jobsHeaderCount,
  };
};

const mapDispatchToProps = (dispatch) => ({
  updateSortBy: (sort) => dispatch(changeSortBy(sort)),
  updateCloseDate: (type) => dispatch(changeClosingDate(type)),
  updateJobType: (type) => dispatch(changeJobType(type)),
  updateWorkType: (type) => dispatch(changeWorkType(type)),
  updateEstimateType: (type) => dispatch(changeSalaryEstimate(type)),
  resetFilterSorting: (data) => dispatch(resetSorting(data)),
  setActiveJobName: (jobName) => dispatch(setActiveJobName(jobName)),
  fetchUnnanuJobs: (token) => dispatch(fetchUnnanuJobs(token)),
  fetchGoogleJobs: (token) => dispatch(fetchGoogleJobs(token)),
  fetchXJobs: (token) => dispatch(fetchXJobs(token)),
  fetchIndeedJobs: (token) => dispatch(fetchIndeedJobs(token)),
  fetchLinkedinJobs: (token) => dispatch(fetchLinkedinJobs(token)),
  fetchGlassdoorJobs: (token) => dispatch(fetchGlassdoorJobs(token)),
  fetchZiprecruiterJobs: (token) => dispatch(fetchZiprecruiterJobs(token)),
  fetchSavedXJobs: (token) => dispatch(fetchSavedXJobs(token)),
  fetchSavedGoogleJobs: (token) => dispatch(fetchSavedGoogleJobs(token)),
  fetchSavedIndeedJobs: (token) => dispatch(fetchSavedIndeedJobs(token)),
  fetchSavedLinkedinJobs: (token) => dispatch(fetchSavedLinkedinJobs(token)),
  fetchSavedGlassdoorJobs: (token) => dispatch(fetchSavedGlassdoorJobs(token)),
  fetchSavedZiprecruiterJobs: (token) =>
    dispatch(fetchSavedZiprecruiterJobs(token)),
  fetchAppliedXJobs: (token) => dispatch(fetchAppliedXJobs(token)),
  fetchAppliedGoogleJobs: (token) => dispatch(fetchAppliedGoogleJobs(token)),
  fetchAppliedIndeedJobs: (token) => dispatch(fetchAppliedIndeedJobs(token)),
  fetchAppliedLinkedinJobs: (token) =>
    dispatch(fetchAppliedLinkedinJobs(token)),
  fetchAppliedGlassdoorJobs: (token) =>
    dispatch(fetchAppliedGlassdoorJobs(token)),
  fetchAppliedZiprecruiterJobs: (token) =>
    dispatch(fetchAppliedZiprecruiterJobs(token)),
});

export default withRedux(Store, mapStateToProps, mapDispatchToProps)(
  withReduxSaga(JobFilters)
);
