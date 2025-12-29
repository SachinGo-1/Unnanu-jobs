import React, { Component } from "react";
import PropTypes from "prop-types";

class Index extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { value } = this.props;
    if (value > 99) {
      value = 99;
    }
    const SIZE = 80;
    const radius = SIZE / 2 - 10;
    const circumference = Math.round(3.14 * radius * 2);
    const progress = `${Math.round(circumference * ((100 - value) / 100))}px`;
    return (
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`-${SIZE * 0.125} -${SIZE * 0.125} ${SIZE * 1.25} ${SIZE *
          1.25}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          r={SIZE / 2 - 10}
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="transparent"
          stroke="#ededed"
          strokeWidth="10px"
          strokeDasharray={circumference}
          strokeDashoffset="0"
        />
        <circle
          r={SIZE / 2 - 10}
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="transparent"
          stroke="#0fbb85"
          strokeWidth="10px"
          strokeDasharray={circumference}
          strokeDashoffset={progress}
          strokeLinecap="round"
        />
        <text
          x="23px"
          y="40px"
          // fill="#6bdba7"
          fontSize="18px"
          fontWeight="bold"
          style={{ transform: `rotate(90deg) translate(8px, -${SIZE}px)` }}
        >
          {value === 100 ? "99" : value < 10 ? `0${value}` : value}
        </text>
        <text
          x="13px"
          y="50px"
          // fill="#000000"
          fontSize="7px"
          fontWeight="bold"
          style={{ transform: `rotate(90deg) translate(8px, -${SIZE}px)` }}
        >
          Match Score
        </text>
      </svg>
    );
  }
}

Index.propTypes = {
  value: PropTypes.number.isRequired,
};

export default Index;
