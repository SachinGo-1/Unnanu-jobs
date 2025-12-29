import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";

class JobExtractActivity extends Component {
  getJobBoardName = jb => {
    // Define order: unnanu, indeed, linkedin, google, glassdoor, ziprecruiter, x
    const names = {
      unnanujobs: "Unnanu",
      indeedjobs: "Indeed",
      linkedinjobs: "Linkedin",
      googlejobs: "Google",
      glassdoorjobs: "Glassdoor",
      zip_recruiterjobs: "Ziprecruiter",
      xjobs: "X"
    };
    return names[jb] || jb;
  };

  groupActivitiesByDate = () => {
    const { activity } = this.props;
    const sortOrder = {
      unnanujobs: 1,
      indeedjobs: 2,
      linkedinjobs: 3,
      googlejobs: 4,
      glassdoorjobs: 5,
      zip_recruiterjobs: 6,
      xjobs: 7
    };

    return activity.reduce((acc, item) => {
      const date = item.lastrun;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(item);
      // Sort items within each date group
      acc[date].sort((a, b) => sortOrder[a.jb] - sortOrder[b.jb]);
      return acc;
    }, {});
  };

  render() {
    const groupedActivities = this.groupActivitiesByDate();

    return (
      <div className="widget job-extract-widget">
        <div className="widget-title">Matched Jobs Activity</div>
        <div className="widget-list">
          {Object.entries(groupedActivities)
            .sort(([dateA], [dateB]) => moment(dateB).diff(moment(dateA)))
            .map(([date, items]) => (
              <div key={date} className="date-group">
                <div className="date-header">
                  {moment(date).format("MMMM D, YYYY")}
                </div>
                {items.map((item, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <div key={`${date}-${index}`} className="activity-item">
                    <span className="job-board-name">
                      {this.getJobBoardName(item.jb)}{" "}
                      {item.count > 1 ? "Jobs" : "Job"}
                    </span>
                    <span className="job-count">{item.count}</span>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    );
  }
}

JobExtractActivity.propTypes = {
  activity: PropTypes.arrayOf(
    PropTypes.shape({
      lastrun: PropTypes.string.isRequired,
      jb: PropTypes.string.isRequired,
      count: PropTypes.number.isRequired
    })
  ).isRequired
};

export default JobExtractActivity;
