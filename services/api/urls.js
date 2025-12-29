const urls = {
  SearchIndex: {
    URL: process.env.SEARCH_INDEX_URL,
    Key: process.env.SEARCH_INDEX_KEY,
  },
  API: process.env.RECRUIT_API_URL,
  HireAPI: process.env.HIRE_API_URL,
  HireOtherAPI: process.env.HIRE_OTHER_API_URL,
  TalentOtherAPI: process.env.TALENT_OTHER_API_URL,
  Recruit: process.env.RECRUIT_URL,
  Socket: process.env.SOCKET_URL,
  Links: {
    Terms: process.env.TERMS_URL,
    Privacy: process.env.PRIVACY_URL,
    FAQ: process.env.FAQ_URL,
    Cookie: process.env.COOKIE_URL,
    About: process.env.ABOUT_URL,
    Hire: process.env.HIRE_URL,
    Landing: process.env.TALENT_LANDING_URL,
  },
  Image: process.env.IMAGE_URL,
  BaseURL: process.env.BASE_URL,
};

export default urls;
