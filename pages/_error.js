import React from "react";
import Layout from "./../components/Layout";

import urls from "services/api/urls";

class Error extends React.Component {
  static getInitialProps({ res, err }) {
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;
    return { statusCode };
  }

  render() {
    const { deviceInfo, statusCode } = this.props;
    return (
      <div className="viewport d-flex flex-column h-100">
        <div className="container text-center">
          <img
            src="/static/banners/giraffe-dude.png"
            srcSet="/static/banners/giraffe-dude@2x.png 2x, /static/banners/giraffe-dude@3x.png 3x"
          />
          <h1>{statusCode} Not found.</h1>
          <p>
            The requested page or URL was not found in our
            <br className="d-none d-sm-block" />
            website. It has either been removed or moved.
            <br />
            <br />
            If you need help <a href="mailto:support@unnanu.ai">
              contact us
            </a>{" "}
            or <a href="/">visit our home page</a>
          </p>
        </div>
        <footer className="footer mt-auto">
          <div className="single-job-footer-container container">
            <div className="row d-flex justify-content-between">
              <div className="copyright">
                © {new Date().getFullYear()} Unnanu, Inc.
              </div>
              <div className="footer-links">
                <a href={urls.Links.Terms} target="_blank">
                  Terms
                </a>{" "}
                · <a href={urls.Links.Privacy}>Privacy</a> ·{" "}
                <a href={urls.Links.FAQ} target="_blank">
                  FAQ
                </a>{" "}
                ·{" "}
                <a href={urls.Links.About} target="_blank">
                  About
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default Error;
