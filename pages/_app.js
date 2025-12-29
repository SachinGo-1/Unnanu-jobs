import React from "react";
import App, { Container } from "next/app";
import nookies from 'nookies'
import Router from "next/router";

import {
  isIOS,
  isAndroid,
  isMobile
} from "react-device-detect";

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    const token = nookies.get(ctx).token || null;

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps, cookie: token };
  }

  componentDidMount() {
    this.removeTokenFromUrl();
  }

  removeTokenFromUrl = () => {
    const { asPath } = Router;

    if (asPath.includes("token=")) {
      const urlWithoutToken = asPath.replace(/([?&])token=[^&]+(&|$)/, (match, p1, p2) => {
        return p1 === '?' ? (p2 ? '?' : '') : p2;
      });

      Router.replace(urlWithoutToken, undefined, { shallow: true });
    }
  };

  createUrl = router => {
    // This is to make sure we don't references the router object at call time
    const { pathname, asPath, query } = router;
    return {
      get query() {
        return query;
      },
      get pathname() {
        return pathname;
      },
      get asPath() {
        return asPath;
      },
      back: () => {
        router.back();
      },
      push: (url, as) => router.push(url, as),
      pushTo: (href, as) => {
        const pushRoute = as ? href : null;
        const pushUrl = as || href;

        return router.push(pushRoute, pushUrl);
      },
      replace: (url, as) => router.replace(url, as),
      replaceTo: (href, as) => {
        const replaceRoute = as ? href : null;
        const replaceUrl = as || href;

        return router.replace(replaceRoute, replaceUrl);
      }
    };
  };

  render() {
    const { Component, pageProps, router, cookie } = this.props;
    const url = this.createUrl(router);
    const deviceData = {
      isMobile: isMobile,
      isIOS: isIOS,
      isAndroid: isAndroid,
    }

    return (
      <Container>
        <Component {...pageProps} url={url} cookie={cookie} deviceInfo={deviceData}/>
      </Container>
    );
  }
}
