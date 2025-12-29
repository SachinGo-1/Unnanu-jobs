import moment from "moment";
import urls from "services/api/urls";

export function getSalaryEstimate(type, start, end) {
  if (type === "Unspecified") {
    return ` and ${start} eq 0 and ${end} eq 0`;
  } else if (type.includes("Below")) {
    return ` and ${start} gt 0 and ${end} gt 0 and ${start} lt 50000 and ${end} lt 50000`;
  } else {
    const number = type.replace(/[^0-9]/g, "");
    const salaryNumber =
      number < 100 ? Math.round((number * 2080) / 10000) * 10000 : number;
    return ` and (${start} ge ${salaryNumber} or ${end} ge ${salaryNumber})`;
  }
}

export function getLocationFilter(location) {
  if (location === "Global") {
    return "";
  } else {
    try {
      const fixLocation = location.match(/[^,]+,[^,]+/g)[0];
      return ` and location eq '${fixLocation}'`;
    } catch (e) {
      return ` and location eq '${location}'`;
    }
  }
}

export function setSearchKeyword(keyword, isCompany) {
  if (isCompany) {
    return ` and company_name eq '${keyword}'`;
  } else {
    return ` and search.ismatch('${keyword}')`;
  }
}

export function getSortBy(type, filter) {
  return `&$orderby=${filter} ${type === 1 ? "asc" : "desc"}`;
}

export function getJobType(type, filter) {
  return ` and ${filter}/ any (x: x eq '${type}')`;
}

export function getWorkType(type, filter) {
  return ` and ${filter}/ any (x: x eq '${type}')`;
}

export function getDatesType(type, filter) {
  const today = moment(new Date())
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");
  const tomorrow = moment(new Date())
    .add(1, "days")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");
  const thisWeek = moment()
    .endOf("week")
    .format("YYYY-MM-DDTHH:mm:ss");
  const nextWeekStart = moment()
    .utc()
    .add(1, "weeks")
    .startOf("week")
    .format("YYYY-MM-DDTHH:mm:ss");
  const nextWeekEnd = moment()
    .utc()
    .add(1, "weeks")
    .endOf("week")
    .format("YYYY-MM-DDTHH:mm:ss");
  const nextTwoWeeksStart = moment()
    .add(2, "weeks")
    .startOf("week")
    .format("YYYY-MM-DDTHH:mm:ss");
  const nextTwoWeeksEnd = moment()
    .add(2, "weeks")
    .endOf("week")
    .format("YYYY-MM-DDTHH:mm:ss");
  const inOneMonth = moment()
    .add(1, "months")
    .endOf("day")
    .format("YYYY-MM-DDTHH:mm:ss");

  switch (type) {
    case "Today":
      return ` and ${filter} le ${today}Z`;
      break;
    case "Tomorrow":
      return ` and ${filter} gt ${today}Z and ${filter} le ${tomorrow}Z`;
      break;
    case "This week":
      return ` and ${filter} le ${thisWeek}Z`;
      break;
    case "Next week":
      return ` and ${filter} ge ${nextWeekStart}Z and ${filter} le ${nextWeekEnd}Z`;
      break;
    case "In two weeks":
      return ` and ${filter} ge ${nextTwoWeeksStart}Z and ${filter} le ${nextTwoWeeksEnd}Z`;
      break;
    case "In a month":
      return ` and ${filter} le ${inOneMonth}Z`;
      break;
    case "In 30 days+":
      return ` and ${filter} gt ${inOneMonth}Z`;
      break;
    default:
      return ` and ${filter} gt ${inOneMonth}Z`;
  }
}

export function prepareURLQuery(query) {
  // remove if default values
  let queryObject = query;
  if (query.sort === 0) {
    delete queryObject.sort;
  }
  if (query.salary === "All salary estimates") {
    delete queryObject.salary;
  }
  if (query.jobtype === "All job types") {
    delete queryObject.jobtype;
  }
  if (query.worktype === "All work types") {
    delete queryObject.worktype;
  }
  if (query.closedate === "Closing anytime") {
    delete queryObject.closedate;
  }
  if (query.keyword === "") {
    delete queryObject.keyword;
  }
  const queryParams = Object.keys(queryObject)
    .reduce(function(a, k) {
      a.push(k + "=" + encodeURIComponent(queryObject[k]));
      return a;
    }, [])
    .join("&");
  return queryParams;
}

export function prepareTweetData(data) {
  const string = `Apply here for a ${data.title} job opening at ${
    data.company
  } : ${data.url} #careers #jobs`;
  return "https://twitter.com/intent/tweet?text=" + encodeURIComponent(string);
}

export function prepareEmailData(data) {
  const subject = `Apply here for a ${data.title} job opening at ${
    data.company
  }`;
  const body = ` You might want to take a look at this ${
    data.title
  } job opening at ${data.company} : ${data.url}`;

  return (
    "mailto:?&subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(body)
  );
}

export function prepareFBData(link) {
  return `https://www.facebook.com/sharer/sharer.php?u=${link}`;
}

export function prepareLinkedinData(link) {
  return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
    link
  )}&title=&summary=&source=`;
}

export function imageURL(url) {
  const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if (!regex.test(url)) {
    const defaultImg =
      url !== "" && url ? url : "/companylogo/experience-default.jpg";
    return `${urls.Image}${defaultImg}`;
  }
  return url;
}

export function profileImageURL(url) {
  const regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  const imageUrl =
    url !== ""
      ? url
      : `${urls.Recruit}/assets/img/default-profile-picture-thumb.svg`;
  if (!regex.test(imageUrl)) {
    return `${urls.Image}/${imageUrl}`;
  }
  return imageUrl;
}

export function prepareURLName(obj) {
  const urlName = `${obj.title} at ${obj.company}`;
  return urlName
    .replace(".", "")
    .replace("&", "and")
    .replace("#", " sharp")
    .replace("/", " ")
    .replace(/[^a-zA-Z0-9+/.#]+/g, "-")
    .replace(" ", "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function formatSalary(
  salary_hr_start,
  salary_hr_end,
  salary_type_text = ""
) {
  let salaryType = "yearly";

  const processSalary = (salary) => {
    if (!salary || salary === "N/A" || salary === "0") return null;

    salary = salary.replace(/\$/g, "").trim();

    salary = salary.replace(/,/g, "").trim();

    if (salary.includes("-")) {
      const [start, end] = salary
        .split("-")
        .map((num) => parseFloat(num.trim()));
      return [start, end];
    }

    return [parseFloat(salary), null];
  };

  const startValues = processSalary(salary_hr_start) || [null, null];
  const endValues = processSalary(salary_hr_end) || [null, null];

  const startSalary =
    startValues[0] !== null
      ? startValues[0]
      : endValues[0] !== null
      ? endValues[0]
      : null;
  const endSalary =
    startValues[1] !== null
      ? startValues[1]
      : endValues[1] !== null
      ? endValues[1]
      : endValues[0] !== null
      ? endValues[0]
      : null;

  if (startSalary !== null) {
    if (startSalary <= 600) {
      salaryType = "hourly";
    } else if (startSalary > 600 && startSalary <= 3000) {
      salaryType = "monthly";
    }
  }

  let salaryString = "Salary Not Specified";
  if (startSalary !== null && startSalary > 15) {
    salaryString =
      endSalary && startSalary !== endSalary
        ? `${startSalary.toLocaleString()} - ${endSalary.toLocaleString()} ${salaryType}`
        : `${startSalary.toLocaleString()} ${salaryType}`;
  }

  return salaryString;
}

export function isValidDate(dateString) {
  return moment(dateString, moment.ISO_8601, true).isValid();
}

export function debounce(func, wait) {
  let timeout;
  const debouncedFunction = (...args) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      if (typeof func === "function") {
        func.apply(this, args);
      }
    }, wait);
  };

  debouncedFunction.cancel = () => {
    if (timeout) clearTimeout(timeout);
  };

  return debouncedFunction;
}
