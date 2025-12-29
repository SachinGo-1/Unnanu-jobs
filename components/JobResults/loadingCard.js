import React from "react";

const LoadingCard = ({ times }) => {
  const numberOfTimes = [];

  for (let i = 0; i < times; i += 1) {
    numberOfTimes.push(
      <div key={i} className="result-card loading" style={{ width: "100%" }}>
        <div className="result-company-logo animated-background" />
        <div className="card-text-content">
          <div className="result-card-header">
            <div className="job-title animated-background" />
            <div className="job-company-location animated-background" />
            <div className="job-salary-range animated-background" />
          </div>
          <div className="result-card-ui-actions">
            <div className="timestamp animated-background" />
          </div>
          <div className="result-card-description">
            <div className="result-loading-line animated-background" />
            <div className="result-loading-line animated-background" />
            <div className="result-loading-line animated-background" />
          </div>
        </div>
      </div>
    );
  }
  return <div>{numberOfTimes}</div>;
};

export default LoadingCard;
