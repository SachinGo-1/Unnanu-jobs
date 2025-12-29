import {
  FETCH_LOCATION_SUCCEEDED,
  FETCH_LOCATION_FAILED,
  POPUP_SHOW_HIDE,
  FETCH_USER_PROFILE_SUCCESS,
  FETCH_USER_PROFILE_FAIL,
  FETCH_SAVED_JOBS_SUCCESS,
  STORE_TOKEN,
  SAVE_JOB_SUCCESS,
  REMOVE_JOB_SUCCESS,
  FETCH_APPLIED_JOBS_SUCCESS,
  SIGN_OUT_SUCCESS,
  FETCH_POPULAR_JOBS_SUCCESS,
  FETCH_NOTIFICATIONS_SUCCESS,
  MOBILE_SEARCH_SHOW,
  MOBILE_SEARCH_DATA,
  SET_ACTIVE_JOB_NAME,
  FETCH_UNNANU_JOBS_SUCCESS,
  FETCH_GOOGLE_JOBS_SUCCESS,
  FETCH_X_JOBS_SUCCESS,
  FETCH_INDEED_JOBS_SUCCESS,
  FETCH_LINKEDIN_JOBS_SUCCESS,
  FETCH_GLASSDOOR_JOBS_SUCCESS,
  FETCH_ZIPRECRUITER_JOBS_SUCCESS,
  FETCH_SAVED_JOBS_LIST_SUCCESS,
  SAVE_GOOGLE_JOB_SUCCESS,
  SAVE_X_JOB_SUCCESS,
  SAVE_INDEED_JOB_SUCCESS,
  SAVE_LINKEDIN_JOB_SUCCESS,
  SAVE_GLASSDOOR_JOB_SUCCESS,
  SAVE_ZIPRECRUITER_JOB_SUCCESS,
  REMOVE_SAVE_GOOGLE_JOB_SUCCESS,
  REMOVE_SAVE_X_JOB_SUCCESS,
  REMOVE_SAVE_INDEED_JOB_SUCCESS,
  REMOVE_SAVE_LINKEDIN_JOB_SUCCESS,
  REMOVE_SAVE_GLASSDOOR_JOB_SUCCESS,
  REMOVE_SAVE_ZIPRECRUITER_JOB_SUCCESS,
  IN_PROCESS_X_JOB_SUCCESS,
  IN_PROCESS_GOOGLE_JOB_SUCCESS,
  IN_PROCESS_INDEED_JOB_SUCCESS,
  IN_PROCESS_LINKEDIN_JOB_SUCCESS,
  IN_PROCESS_GLASSDOOR_JOB_SUCCESS,
  IN_PROCESS_ZIPRECRUITER_JOB_SUCCESS,
  APPLY_GOOGLE_JOB_SUCCESS,
  APPLY_X_JOB_SUCCESS,
  APPLY_INDEED_JOB_SUCCESS,
  APPLY_LINKEDIN_JOB_SUCCESS,
  APPLY_GLASSDOOR_JOB_SUCCESS,
  APPLY_ZIPRECRUITER_JOB_SUCCESS,
  WITHDRAW_UNNANU_JOB_SUCCESS,
  WITHDRAW_GOOGLE_JOB_SUCCESS,
  WITHDRAW_X_JOB_SUCCESS,
  WITHDRAW_INDEED_JOB_SUCCESS,
  WITHDRAW_LINKEDIN_JOB_SUCCESS,
  WITHDRAW_GLASSDOOR_JOB_SUCCESS,
  WITHDRAW_ZIPRECRUITER_JOB_SUCCESS,
  FETCH_APPLIED_GOOGLE_JOBS_SUCCESS,
  FETCH_APPLIED_X_JOBS_SUCCESS,
  FETCH_APPLIED_INDEED_JOBS_SUCCESS,
  FETCH_APPLIED_LINKEDIN_JOBS_SUCCESS,
  FETCH_APPLIED_GLASSDOOR_JOBS_SUCCESS,
  FETCH_APPLIED_ZIPRECRUITER_JOBS_SUCCESS,
  DELETE_UNNANU_JOB_SUCCESS,
  DELETE_GOOGLE_JOB_SUCCESS,
  DELETE_X_JOB_SUCCESS,
  DELETE_INDEED_JOB_SUCCESS,
  DELETE_LINKEDIN_JOB_SUCCESS,
  DELETE_GLASSDOOR_JOB_SUCCESS,
  DELETE_ZIPRECRUITER_JOB_SUCCESS,
  FETCH_JOB_EXTRACT_ACTIVITY_SUCCESS,
  FETCH_JOBS_HEADER_COUNT_SUCCESS,
  FETCH_SAVED_X_JOBS_SUCCESS,
  FETCH_SAVED_GOOGLE_JOBS_SUCCESS,
  FETCH_SAVED_INDEED_JOBS_SUCCESS,
  FETCH_SAVED_LINKEDIN_JOBS_SUCCESS,
  FETCH_SAVED_GLASSDOOR_JOBS_SUCCESS,
  FETCH_SAVED_ZIPRECRUITER_JOBS_SUCCESS,
  FETCH_UNNANU_JOBS_FAIL,
  FETCH_X_JOBS_FAIL,
  FETCH_GOOGLE_JOBS_FAIL,
  FETCH_INDEED_JOBS_FAIL,
  FETCH_LINKEDIN_JOBS_FAIL,
  FETCH_GLASSDOOR_JOBS_FAIL,
  FETCH_ZIPRECRUITER_JOBS_FAIL,
  SET_JOB_LOADING
} from "store/app/actions";

const initialState = {
  // MB:01/25/2021
  // location: 'Austin, TX, USA',
  location: "Global",
  user: {},
  isLogged: false,
  isModalOpen: false,
  showMobileSearch: false,
  savedJobs: [],
  savedXJobs: [],
  savedIndeedJobs: [],
  savedLinkedinJobs: [],
  savedGoogleJobs: [],
  savedGlassdoorJobs: [],
  savedZiprecruiterJobs: [],
  savedJobsList: [],
  // savedXJobsList: [],
  // savedIndeedJobsList: [],
  // savedLinkedinJobsList: [],
  // savedGoogleJobsList: [],
  // savedGlassdoorJobsList: [],
  // savedZiprecruiterJobsList: [],
  appliedJobs: [],
  appliedXJobs: [],
  appliedIndeedJobs: [],
  appliedLinkedinJobs: [],
  appliedGoogleJobs: [],
  appliedGlassdoorJobs: [],
  appliedZiprecruiterJobs: [],
  // appliedJobsList: [],
  // appliedXJobsList: [],
  // appliedIndeedJobsList: [],
  // appliedLinkedinJobsList: [],
  // appliedGoogleJobsList: [],
  // appliedGlassdoorJobsList: [],
  // appliedZiprecruiterJobsList: [],
  popularJobs: [],
  unnanuJobs: [],
  xJobs: [],
  indeedJobs: [],
  linkedinJobs: [],
  googleJobs: [],
  glassdoorJobs: [],
  ziprecruiterJobs: [],
  token: null,
  notifications: {},
  mobileSearch: {},
  activeJobName: "unnanu",
  jobExtractActivity: {},
  jobsHeaderCount: [],

  // Add pagination states for each job type
  currentPage: {
    unnanu: 0,
    google: 0,
    x: 0,
    indeed: 0,
    linkedin: 0,
    glassdoor: 0,
    ziprecruiter: 0,
    unnanuSaved: 0,
    googleSaved: 0,
    xSaved: 0,
    indeedSaved: 0,
    linkedinSaved: 0,
    glassdoorSaved: 0,
    ziprecruiterSaved: 0,
    unnanuApplied: 0,
    googleApplied: 0,
    xApplied: 0,
    indeedApplied: 0,
    linkedinApplied: 0,
    glassdoorApplied: 0,
    ziprecruiterApplied: 0
  },

  // Add loading states
  isLoading: {
    unnanu: false,
    google: false,
    x: false,
    indeed: false,
    linkedin: false,
    glassdoor: false,
    ziprecruiter: false,
    unnanuSaved: false,
    googleSaved: false,
    xSaved: false,
    indeedSaved: false,
    linkedinSaved: false,
    glassdoorSaved: false,
    ziprecruiterSaved: false,
    unnanuApplied: false,
    googleApplied: false,
    xApplied: false,
    indeedApplied: false,
    linkedinApplied: false,
    glassdoorApplied: false,
    ziprecruiterApplied: false
  },

  // Add hasMore flags for each job type
  hasMore: {
    unnanu: true,
    google: true,
    x: true,
    indeed: true,
    linkedin: true,
    glassdoor: true,
    ziprecruiter: true,
    unnanuSaved: false,
    googleSaved: false,
    xSaved: false,
    indeedSaved: false,
    linkedinSaved: false,
    glassdoorSaved: false,
    ziprecruiterSaved: false,
    unnanuApplied: false,
    googleApplied: false,
    xApplied: false,
    indeedApplied: false,
    linkedinApplied: false,
    glassdoorApplied: false,
    ziprecruiterApplied: false,
  },

  isChecked: {
    unnanu: false,
    google: false,
    x: false,
    indeed: false,
    linkedin: false,
    glassdoor: false,
    ziprecruiter: false
  }
};

export default function(state = initialState, action, prevState) {
  switch (action.type) {
    case FETCH_JOBS_HEADER_COUNT_SUCCESS:
      return { ...state, jobsHeaderCount: action.payload };
    case FETCH_JOB_EXTRACT_ACTIVITY_SUCCESS:
      return { ...state, jobExtractActivity: action.payload };
    case FETCH_LOCATION_SUCCEEDED:
      return { ...state, location: action.payload };
    case FETCH_LOCATION_FAILED:
      return { ...state, location: "Austin, TX" };
    case POPUP_SHOW_HIDE:
      return { ...state, isModalOpen: action.payload };
    case MOBILE_SEARCH_SHOW:
      return { ...state, showMobileSearch: action.payload };
    case MOBILE_SEARCH_DATA:
      return { ...state, mobileSearch: action.payload };
    case FETCH_POPULAR_JOBS_SUCCESS: {
      const formatPopular = action.payload.map(obj => ({
        ...obj,
        j_id: obj.id
      }));
      return { ...state, popularJobs: formatPopular };
    }
    case FETCH_UNNANU_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let unnanuJobs = [];
      if (!Array.isArray(data)) {
        unnanuJobs = [...state.unnanuJobs];
      } else {
        unnanuJobs = page > 0 ? [...state.unnanuJobs, ...data] : data;
      }

      return {
        ...state,
        unnanuJobs,
        currentPage: {
          ...state.currentPage,
          unnanu: page
        },
        hasMore: {
          ...state.hasMore,
          unnanu:
            unnanuJobs.length > 0 &&
            unnanuJobs.length < (state.jobsHeaderCount.find(job => job.jb === "unnanujobs") && state.jobsHeaderCount.find(job => job.jb === "unnanujobs").count)
        },
        isLoading: {
          ...state.isLoading,
          unnanu: false
        },
        isChecked: {
          ...state.isChecked,
          unnanu: true
        }
      };
    }
    case FETCH_GOOGLE_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let googleJobs = [];
      if (!Array.isArray(data)) {
        googleJobs = [...state.googleJobs];
      } else {
        googleJobs =  [...state.googleJobs, ...data];
      }

      return {
        ...state,
        googleJobs,
        currentPage: { ...state.currentPage, google: action.payload.page },
        hasMore: {
          ...state.hasMore,
          google:
            googleJobs.length > 0 &&
            googleJobs.length < (state.jobsHeaderCount.find(job => job.jb === "googlejobs") &&
              state.jobsHeaderCount.find(job => job.jb === "googlejobs").count)
        },
        isLoading: { ...state.isLoading, google: false },
        isChecked: { ...state.isChecked, google: true }
      };
    }
    case FETCH_X_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let xJobs = [];
      if (!Array.isArray(data)) {
        xJobs = [...state.xJobs];
      } else {
        xJobs = [...state.xJobs, ...data];
      }

      return {
        ...state,
        xJobs,
        currentPage: {
          ...state.currentPage,
          x: action.payload.page
        },
        hasMore: {
          ...state.hasMore,
          x:
            xJobs.length > 0 &&
            xJobs.length < (state.jobsHeaderCount.find(job => job.jb === "xjobs") &&
              state.jobsHeaderCount.find(job => job.jb === "xjobs").count )
        },
        isLoading: {
          ...state.isLoading,
          x: false
        },
        isChecked: {
          ...state.isChecked,
          x: true
        }
      };
    }
    case FETCH_INDEED_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let indeedJobs = [];
      if (!Array.isArray(data)) {
        indeedJobs = [...state.indeedJobs];
      } else {
        indeedJobs = [...state.indeedJobs, ...data];
      }

      return {
        ...state,
        indeedJobs,
        currentPage: {
          ...state.currentPage,
          indeed: page
        },
        hasMore: {
          ...state.hasMore,
          indeed:
            indeedJobs.length > 0 &&
            indeedJobs.length < (state.jobsHeaderCount.find(job => job.jb === "indeedjobs") &&
                  state.jobsHeaderCount.find(job => job.jb === "indeedjobs").count)
        },
        isLoading: {
          ...state.isLoading,
          indeed: false
        },
        isChecked: {
          ...state.isChecked,
          indeed: true
        }
      };
    }

    case FETCH_LINKEDIN_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let linkedinJobs = [];
      if (!Array.isArray(data)) {
        linkedinJobs = [...state.linkedinJobs];
      } else {
        linkedinJobs =  [...state.linkedinJobs, ...data];
      }

      return {
        ...state,
        linkedinJobs,
        currentPage: {
          ...state.currentPage,
          linkedin: action.payload.page
        },
        hasMore: {
          ...state.hasMore,
          linkedin:
            linkedinJobs.length > 0 &&
            linkedinJobs.length < (state.jobsHeaderCount.find(job => job.jb === "linkedinjobs") && state.jobsHeaderCount.find(job => job.jb === "linkedinjobs").count)
        },
        isLoading: {
          ...state.isLoading,
          linkedin: false
        },
        isChecked: {
          ...state.isChecked,
          linkedin: true
        }
      };
    }

    case FETCH_GLASSDOOR_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let glassdoorJobs = [];
      if (!Array.isArray(data)) {
        glassdoorJobs = [...state.glassdoorJobs];
      } else {
        glassdoorJobs = [...state.glassdoorJobs, ...data]
      }

      return {
        ...state,
        glassdoorJobs,
        currentPage: {
          ...state.currentPage,
          glassdoor: action.payload.page
        },
        hasMore: {
          ...state.hasMore,
          glassdoor:
            glassdoorJobs.length > 0 &&
            glassdoorJobs.length < (state.jobsHeaderCount.find(job => job.jb === "glassdoorjobs") && state.jobsHeaderCount.find(job => job.jb === "glassdoorjobs").count)
        },
        isLoading: {
          ...state.isLoading,
          glassdoor: false
        },
        isChecked: {
          ...state.isChecked,
          glassdoor: true
        }
      };
    }

    case FETCH_ZIPRECRUITER_JOBS_SUCCESS: {
      const { data, page } = action.payload;
      let ziprecruiterJobs = [];
      if (!Array.isArray(data)) {
        ziprecruiterJobs = [...state.ziprecruiterJobs];
      } else {
        ziprecruiterJobs = [...state.ziprecruiterJobs, ...data]
      }

      return {
        ...state,
        ziprecruiterJobs,
        currentPage: {
          ...state.currentPage,
          ziprecruiter: action.payload.page
        },
        hasMore: {
          ...state.hasMore,
          ziprecruiter:
            ziprecruiterJobs.length > 0 &&
            ziprecruiterJobs.length < (state.jobsHeaderCount.find(job => job.jb === "zip_recruiterjobs") &&
              state.jobsHeaderCount.find(job => job.jb === "zip_recruiterjobs").count)
        },
        isLoading: {
          ...state.isLoading,
          ziprecruiter: false
        },
        isChecked: {
          ...state.isChecked,
          ziprecruiter: true
        }
      };
    }
    case FETCH_SAVED_JOBS_SUCCESS: {
      const formatSaved = action.payload.map(obj => ({ ...obj, j_id: obj.id }));
      formatSaved.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return { ...state, savedJobs: formatSaved };
    }
    case FETCH_APPLIED_JOBS_SUCCESS: {
     const  { data, page } = action.payload;
      let appliedJobs = [];
      if (!Array.isArray(data)) {
        appliedJobs = [...state.appliedJobs];
      } else {
        appliedJobs = page > 0 ? [...state.appliedJobs, ...data] : data;
      }

      return {
        ...state,
        appliedJobs,
        currentPage: {
          ...state.currentPage,
          unnanuApplied: page
        },
        isLoading: {
          ...state.isLoading,
          unnanuApplied: false
        }
      };
    }
    case FETCH_SAVED_JOBS_LIST_SUCCESS:
      return { ...state, savedJobsList: action.payload };
    case STORE_TOKEN:
      return { ...state, token: action.payload };
    case FETCH_NOTIFICATIONS_SUCCESS:
      return { ...state, notifications: action.payload };
    case FETCH_USER_PROFILE_SUCCESS:
      return { ...state, user: action.payload, isLogged: true };
    case FETCH_USER_PROFILE_FAIL:
      return { ...state, isLogged: false };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        user: {},
        isLogged: false,
        savedJobs: [],
        savedGoogleJobs: [],
        savedXJobs: [],
        savedIndeedJobs: [],
        savedLinkedinJobs: [],
        savedGlassdoorJobs: [],
        savedZiprecruiterJobs: [],
        savedJobsList: [], // savedXJobsList: [],
        // savedIndeedJobsList: [],
        // savedLinkedinJobsList: [],
        // savedGoogleJobsList: [],
        // savedGlassdoorJobsList: [],
        // savedZiprecruiterJobsList: [],
        appliedJobs: [],
        appliedGoogleJobs: [],
        appliedXJobs: [],
        appliedIndeedJobs: [],
        appliedLinkedinJobs: [],
        appliedGlassdoorJobs: [],
        appliedZiprecruiterJobs: [], // appliedJobsList: [],
        // appliedGoogleJobsList: [],
        // appliedXJobsList: [],
        // appliedIndeedJobsList: [],
        // appliedLinkedinJobsList: [],
        // appliedGlassdoorJobsList: [],
        // appliedZiprecruiterJobsList: [],
        token: null,
        unnanuJobs: [],
        googleJobs: [],
        xJobs: [],
        indeedJobs: [],
        linkedinJobs: [],
        glassdoorJobs: [],
        ziprecruiterJobs: [],
        notifications: {},
        currentPage: {
          unnanu: 0,
          google: 0,
          x: 0,
          indeed: 0,
          linkedin: 0,
          glassdoor: 0,
          ziprecruiter: 0
        },
        // Add loading states
        isLoading: {
          unnanu: false,
          google: false,
          x: false,
          indeed: false,
          linkedin: false,
          glassdoor: false,
          ziprecruiter: false
        },
        // Add hasMore flags for each job type
        hasMore: {
          unnanu: true,
          google: true,
          x: true,
          indeed: true,
          linkedin: true,
          glassdoor: true,
          ziprecruiter: true
        }
      };

    case SAVE_JOB_SUCCESS: {
      const savedJobs = Array.isArray(state.savedJobs) ? state.savedJobs : [];
      const savedJobsList = Array.isArray(state.savedJobsList) ? state.savedJobsList : [];
      const unnanuJobs = Array.isArray(state.unnanuJobs) ? state.unnanuJobs : [];

      const newSavedJobsList = [action.payload.id, ...savedJobsList];
      const newSavedJobs = [action.payload, ...savedJobs];
      const result = newSavedJobs.reduce((unique, o) => {
        if (!unique.some(obj => obj.id === o.id)) {
          unique.push(o);
        }
        return unique;
      }, []);
      const updatedUnnanuJobs = unnanuJobs.map(job =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "unnanujobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        unnanuJobs: updatedUnnanuJobs,
        savedJobs: result,
        savedJobsList: newSavedJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }
    case REMOVE_JOB_SUCCESS: {
      const savedJobs = Array.isArray(state.savedJobs) ? state.savedJobs : [];
      const savedJobsList = Array.isArray(state.savedJobsList) ? state.savedJobsList : [];
      const unnanuJobs = Array.isArray(state.unnanuJobs) ? state.unnanuJobs : [];

      const removeOldJob = savedJobs.filter(
        obj => obj.id !== parseInt(action.payload, 10)
      );
      const getCurrentSavedList = savedJobsList.filter(
        e => e !== parseInt(action.payload, 10)
      );
      const updatedUnnanuJobs = unnanuJobs.map(job =>
        job.j_id === action.payload ? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];
      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "unnanujobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });
      return {
        ...state,
        unnanuJobs: updatedUnnanuJobs,
        savedJobs: removeOldJob,
        savedJobsList: getCurrentSavedList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }
    case SET_ACTIVE_JOB_NAME:
      return { ...state, activeJobName: action.payload };
    case SAVE_GOOGLE_JOB_SUCCESS: {
      const savedGoogleJobs = Array.isArray(state.savedGoogleJobs) ? state.savedGoogleJobs : [];
      const savedGoogleJobsList = Array.isArray(state.savedGoogleJobsList) ? state.savedGoogleJobsList : [];
      const googleJobs = Array.isArray(state.googleJobs) ? state.googleJobs : [];
      const newSavedGoogleJobs = [action.payload, ...savedGoogleJobs];
      const newSavedGoogleJobsList = [
        action.payload.id,
        ...savedGoogleJobsList,
      ];
      const newSavedGoogleJobsResult = newSavedGoogleJobs.reduce(
        (unique, o) => {
          if (!unique.some((obj) => obj.id == o.id)) {
            unique.push(o);
          }
          return unique;
        },
        []
      );
      const updatedGoogleJobs = googleJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "googlejobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        googleJobs: updatedGoogleJobs,
        savedGoogleJobs: newSavedGoogleJobsResult,
        savedGoogleJobsList: newSavedGoogleJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }
    case SAVE_X_JOB_SUCCESS: {
      const savedXJobs = Array.isArray(state.savedXJobs) ? state.savedXJobs : [];
      const savedXJobsList = Array.isArray(state.savedXJobsList) ? state.savedXJobsList : [];
      const newSavedXJobs = [action.payload, ...savedXJobs];
      const newSavedXJobsList = [action.payload.id, ...savedXJobsList];
      const newSavedXJobsResult = newSavedXJobs.reduce((unique, o) => {
        if (!unique.some((obj) => obj.id == o.id)) {
          unique.push(o);
        }
        return unique;
      }, []);
      const updatedXJobs = state.xJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "xjobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });

      return {
        ...state,
        xJobs: updatedXJobs,
        savedXJobs: newSavedXJobsResult,
        savedXJobsList: newSavedXJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }
    case IN_PROCESS_GOOGLE_JOB_SUCCESS: {
      const googleJobs = Array.isArray(state.googleJobs) ? state.googleJobs : [];
      const savedGoogleJobs = Array.isArray(state.savedGoogleJobs) ? state.savedGoogleJobs : [];
      const updatedGoogleJobs = googleJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );

      const newSavedGoogleJobs = savedGoogleJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
          ? { ...job, in_progress: action.payload.inProgress }
          : job );

      return { ...state, googleJobs: updatedGoogleJobs, savedGoogleJobs:newSavedGoogleJobs };
    }
    case APPLY_GOOGLE_JOB_SUCCESS: {
      const googleJobs = Array.isArray(state.googleJobs) ? state.googleJobs : [];
      const appliedGoogleJobs = Array.isArray(state.appliedGoogleJobs) ? state.appliedGoogleJobs : [];
      const appliedGoogleJobsList = Array.isArray(state.appliedGoogleJobsList) ? state.appliedGoogleJobsList : [];
      const savedGoogleJobs = Array.isArray(state.savedGoogleJobs) ? state.savedGoogleJobs :[];

      const upadtedSavedGoogleJobs = savedGoogleJobs.filter(job =>
        job.id != action.payload.id
      );
      const updatedGoogleJobs = googleJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const newAppliedGoogleJobs = [action.payload, ...appliedGoogleJobs];
      const newAppliedGoogleJobsList = [
        action.payload.id,
        ...appliedGoogleJobsList
      ];
      const newAppliedGoogleJobsResult = newAppliedGoogleJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedGoogleJobsListResult = [
        ...new Set(newAppliedGoogleJobsList)
      ];

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "googlejobs"){
          return {...newItem, count: item.count-1, appliedcount: item.appliedcount+1, savedcount: action.payload.is_saved ? item.savedcount-1: item.savedcount};
        }
        return newItem;
      });

      return {
        ...state,
        googleJobs: updatedGoogleJobs,
        savedGoogleJobs: upadtedSavedGoogleJobs,
        appliedGoogleJobs: newAppliedGoogleJobsResult,
        appliedGoogleJobsList: newAppliedGoogleJobsListResult,
        jobsHeaderCount: newJobsHeaderCount
      };
    }
    case IN_PROCESS_X_JOB_SUCCESS: {
      const savedXJobs = Array.isArray(state.savedXJobs) ? state.savedXJobs : [];
      const xJobs = Array.isArray(state.xJobs) ? state.xJobs : [];
      const updatedXJobs = xJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );
      const newSavedXJobs = savedXJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
        ? { ...job, in_progress: action.payload.inProgress }
        : job )
      return { ...state, xJobs: updatedXJobs, savedXJobs:newSavedXJobs};
    }
    case APPLY_X_JOB_SUCCESS: {
      const xJobs = Array.isArray(state.xJobs) ? state.xJobs : [];
      const appliedXJobs = Array.isArray(state.appliedXJobs) ? state.appliedXJobs : [];
      const appliedXJobsList = Array.isArray(state.appliedXJobsList) ? state.appliedXJobsList : [];
      const savedXJobs = Array.isArray(state.savedXJobs) ? state.savedXJobs :[];

      const upadtedSavedXJobs = savedXJobs.filter(job =>
        job.id != action.payload.id
      );

      const updatedXJobs = xJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const newAppliedXJobs = [action.payload, ...appliedXJobs];
      const newAppliedXJobsList = [
        action.payload.id,
        ...appliedXJobsList
      ];
      const newAppliedXJobsResult = newAppliedXJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedXJobsListResult = [...new Set(newAppliedXJobsList)];

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "xjobs"){
          return {...newItem, appliedcount: item.appliedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        xJobs: updatedXJobs,
        savedXJobs: upadtedSavedXJobs,
        appliedXJobs: newAppliedXJobsResult,
        appliedXJobsList: newAppliedXJobsListResult,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }
    case REMOVE_SAVE_GOOGLE_JOB_SUCCESS: {
      const savedGoogleJobs = Array.isArray(state.savedGoogleJobs) ? state.savedGoogleJobs : [];
      const savedGoogleJobsList = Array.isArray(state.savedGoogleJobsList) ? state.savedGoogleJobsList : [];
      const googleJobs = Array.isArray(state.googleJobs) ? state.googleJobs : [];

      const updatedSavedGoogleJobs = savedGoogleJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedSavedGoogleJobsList = savedGoogleJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedGoogleJobs = googleJobs.map(job =>
        parseInt(job.j_id, 10) == parseInt(action.payload.id, 10) ? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];
      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "googlejobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });
      return {
        ...state,
        googleJobs: updatedGoogleJobs,
        savedGoogleJobs: updatedSavedGoogleJobs,
        savedGoogleJobsList: updatedSavedGoogleJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }
    case REMOVE_SAVE_X_JOB_SUCCESS: {
      const savedXJobs = Array.isArray(state.savedXJobs) ? state.savedXJobs : [];
      const savedXJobsList = Array.isArray(state.savedXJobsList) ? state.savedXJobsList : [];
      const xJobs = Array.isArray(state.xJobs) ? state.xJobs : [];
      const updatedSavedXJobs = savedXJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedSavedXJobsList = savedXJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedXJobs = xJobs.map(job =>
        parseInt(job.j_id, 10) == parseInt(action.payload.id, 10) ? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];

      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "xjobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        xJobs: updatedXJobs,
        savedXJobs: updatedSavedXJobs,
        savedXJobsList: updatedSavedXJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case WITHDRAW_UNNANU_JOB_SUCCESS: {
      const unnanuJobs = Array.isArray(state.unnanuJobs) ? state.unnanuJobs : [];
      const appliedJobs = Array.isArray(state.appliedJobs) ? state.appliedJobs : [];
      const appliedJobsList = Array.isArray(state.appliedJobsList) ? state.appliedJobsList : [];
      const updatedUnnanuJobs = unnanuJobs.map(job =>
        job.j_id === action.payload.id ? { ...job, is_applied: false } : job
      );
      const updatedAppliedJobs = appliedJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedJobsList = appliedJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "unnanujobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        unnanuJobs: updatedUnnanuJobs,
        appliedJobs: updatedAppliedJobs,
        appliedJobsList: updatedAppliedJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case WITHDRAW_GOOGLE_JOB_SUCCESS: {
      const googleJobs = Array.isArray(state.googleJobs) ? state.googleJobs : [];
      const appliedGoogleJobs = Array.isArray(state.appliedGoogleJobs) ? state.appliedGoogleJobs : [];
      const appliedGoogleJobsList = Array.isArray(state.appliedGoogleJobsList) ? state.appliedGoogleJobsList : [];
      const updatedGoogleJobs = googleJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, inprogress: false }
          : job
      );
      const updatedAppliedGoogleJobs = appliedGoogleJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedGoogleJobsList = appliedGoogleJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "googlejobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        googleJobs: updatedGoogleJobs,
        appliedGoogleJobs: updatedAppliedGoogleJobs,
        appliedGoogleJobsList: updatedAppliedGoogleJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case WITHDRAW_X_JOB_SUCCESS: {
      const xJobs = Array.isArray(state.xJobs) ? state.xJobs : [];
      const appliedXJobs = Array.isArray(state.appliedXJobs) ? state.appliedXJobs : [];
      const appliedXJobsList = Array.isArray(state.appliedXJobsList) ? state.appliedXJobsList : [];
      const updatedXJobs = xJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, inprogress: false }
          : job
      );
      const updatedAppliedXJobs = appliedXJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedXJobsList = appliedXJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "xjobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        xJobs: updatedXJobs,
        appliedXJobs: updatedAppliedXJobs,
        appliedXJobsList: updatedAppliedXJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case FETCH_APPLIED_GOOGLE_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedGoogleJobs = [];
      if (!Array.isArray(data)) {
        appliedGoogleJobs = [...state.appliedGoogleJobs];
      } else {
        appliedGoogleJobs = page > 0 ? [...state.appliedGoogleJobs, ...data] : data;
      }

      return {
        ...state,
        appliedGoogleJobs,
        currentPage: {
          ...state.currentPage,
          googleApplied: page
        },
        isLoading: {
          ...state.isLoading,
          googleApplied: false
        }
      };
    }

    case FETCH_APPLIED_X_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedXJobs = [];
      if (!Array.isArray(data)) {
        appliedXJobs = [...state.appliedXJobs];
      } else {
        appliedXJobs = page > 0 ? [...state.appliedXJobs, ...data] : data;
      }

      return {
        ...state,
        appliedXJobs,
        currentPage: {
          ...state.currentPage,
          xApplied: page
        },
        isLoading: {
          ...state.isLoading,
          xApplied: false
        }
      };
    }

    case FETCH_APPLIED_INDEED_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedIndeedJobs = [];
      if (!Array.isArray(data)) {
        appliedIndeedJobs = [...state.appliedIndeedJobs];
      } else {
        appliedIndeedJobs = page > 0 ? [...state.appliedIndeedJobs, ...data] : data;
      }

      return {
        ...state,
        appliedIndeedJobs,
        currentPage: {
          ...state.currentPage,
          indeedApplied: page
        },
        isLoading: {
          ...state.isLoading,
          indeedApplied: false
        }
      };
    }

    case FETCH_APPLIED_LINKEDIN_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedLinkedinJobs = [];
      if (!Array.isArray(data)) {
        appliedLinkedinJobs = [...state.appliedLinkedinJobs];
      } else {
        appliedLinkedinJobs = page > 0 ? [...state.appliedLinkedinJobs, ...data] : data;
      }

      return {
        ...state,
        appliedLinkedinJobs,
        currentPage: {
          ...state.currentPage,
          linkedinApplied: page
        },
        isLoading: {
          ...state.isLoading,
          linkedinApplied: false
        }
      };
    }

    case FETCH_APPLIED_GLASSDOOR_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedGlassdoorJobs = [];
      if (!Array.isArray(data)) {
        appliedGlassdoorJobs = [...state.appliedGlassdoorJobs];
      } else {
        appliedGlassdoorJobs = page > 0 ? [...state.appliedGlassdoorJobs, ...data] : data;
      }

      return {
        ...state,
        appliedGlassdoorJobs,
        currentPage: {
          ...state.currentPage,
          glassdoorApplied: page
        },
        isLoading: {
          ...state.isLoading,
          glassdoorApplied: false
        }
      };
    }

    case FETCH_APPLIED_ZIPRECRUITER_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let appliedZiprecruiterJobs = [];
      if (!Array.isArray(data)) {
        appliedZiprecruiterJobs = [...state.appliedZiprecruiterJobs];
      } else {
        appliedZiprecruiterJobs = page > 0 ? [...state.appliedZiprecruiterJobs, ...data] : data;
      }

      return {
        ...state,
        appliedZiprecruiterJobs,
        currentPage: {
          ...state.currentPage,
          ziprecruiterApplied: page
        },
        isLoading: {
          ...state.isLoading,
          ziprecruiterApplied: false
        }
      };
    }

    // Add state handling for Indeed, Linkedin, Glassdoor, Ziprecruiter
    case SAVE_INDEED_JOB_SUCCESS: {
      const savedIndeedJobs = Array.isArray(state.savedIndeedJobs) ? state.savedIndeedJobs : [];
      const savedIndeedJobsList = Array.isArray(state.savedIndeedJobsList) ? state.savedIndeedJobsList : [];
      const indeedJobs = Array.isArray(state.indeedJobs) ? state.indeedJobs : [];
      const newSavedIndeedJobs = [action.payload, ...savedIndeedJobs];
      const newSavedIndeedJobsList = [
        action.payload.id,
        ...savedIndeedJobsList,
      ];
      const newSavedIndeedJobsResult = newSavedIndeedJobs.reduce(
        (unique, o) => {
          if (!unique.some((obj) => obj.id == o.id)) {
            unique.push(o);
          }
          return unique;
        },
        []
      );
      const updatedIndeedJobs = indeedJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "indeedjobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        indeedJobs: updatedIndeedJobs,
        savedIndeedJobs: newSavedIndeedJobsResult,
        savedIndeedJobsList: newSavedIndeedJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case IN_PROCESS_INDEED_JOB_SUCCESS: {
      const indeedJobs = Array.isArray(state.indeedJobs) ? state.indeedJobs : [];
      const savedIndeedJobs = Array.isArray(state.savedIndeedJobs) ? state.savedIndeedJobs : [];
      const updatedIndeedJobs = indeedJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );

      const newSavedIndeedJobs = savedIndeedJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
          ? { ...job, in_progress: action.payload.inProgress }
          : job );

      return { ...state, indeedJobs: updatedIndeedJobs, savedIndeedJobs:newSavedIndeedJobs };
    }

    case APPLY_INDEED_JOB_SUCCESS: {
      const indeedJobs = Array.isArray(state.indeedJobs) ? state.indeedJobs : [];
      const appliedIndeedJobs = Array.isArray(state.appliedIndeedJobs) ? state.appliedIndeedJobs : [];
      const appliedIndeedJobsList = Array.isArray(state.appliedIndeedJobsList) ? state.appliedIndeedJobsList : [];
      const savedIndeedJobs = Array.isArray(state.savedIndeedJobs) ? state.savedIndeedJobs :[];

      const updatedIndeedJobs = indeedJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const upadtedSavedIndeedJobs = savedIndeedJobs.filter(job =>
        job.id != action.payload.id
      );
      const newAppliedIndeedJobs = [action.payload, ...appliedIndeedJobs];
      const newAppliedIndeedJobsList = [
        action.payload.id,
        ...appliedIndeedJobsList
      ];
      const newAppliedIndeedJobsResult = newAppliedIndeedJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedIndeedJobsListResult = [
        ...new Set(newAppliedIndeedJobsList)
      ];
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "indeedjobs"){
          return {...newItem, count: item.count-1, appliedcount: item.appliedcount+1, savedcount: action.payload.is_saved ? item.savedcount-1: item.savedcount};
        }
        return newItem;
      });

      return {
        ...state,
        indeedJobs: updatedIndeedJobs,
        savedIndeedJobs: upadtedSavedIndeedJobs,
        appliedIndeedJobs: newAppliedIndeedJobsResult,
        appliedIndeedJobsList: newAppliedIndeedJobsListResult,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case REMOVE_SAVE_INDEED_JOB_SUCCESS: {
      const savedIndeedJobs = Array.isArray(state.savedIndeedJobs) ? state.savedIndeedJobs : [];
      const savedIndeedJobsList = Array.isArray(state.savedIndeedJobsList) ? state.savedIndeedJobsList : [];
      const indeedJobs = Array.isArray(state.indeedJobs) ? state.indeedJobs : [];
      const updatedSavedIndeedJobs = savedIndeedJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );

      const updatedSavedIndeedJobsList = savedIndeedJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedIndeedJobs =   indeedJobs.map(job =>
        parseInt(job.j_id, 10) == parseInt(action.payload.id, 10)? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];
      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "indeedjobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });
      return {
        ...state,
        indeedJobs: updatedIndeedJobs,
        savedIndeedJobs: updatedSavedIndeedJobs,
        savedIndeedJobsList: updatedSavedIndeedJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case WITHDRAW_INDEED_JOB_SUCCESS: {
      const indeedJobs = Array.isArray(state.indeedJobs) ? state.indeedJobs : [];
      const appliedIndeedJobs = Array.isArray(state.appliedIndeedJobs) ? state.appliedIndeedJobs : [];
      const appliedIndeedJobsList = Array.isArray(state.appliedIndeedJobsList) ? state.appliedIndeedJobsList : [];
      const updatedIndeedJobs = indeedJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, in_progress: false }
          : job
      );
      const updatedAppliedIndeedJobs = appliedIndeedJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedIndeedJobsList = appliedIndeedJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "indeedjobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        indeedJobs: updatedIndeedJobs,
        appliedIndeedJobs: updatedAppliedIndeedJobs,
        appliedIndeedJobsList: updatedAppliedIndeedJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    // Add Linkedin job cases
    case SAVE_LINKEDIN_JOB_SUCCESS: {
      const savedLinkedinJobs = Array.isArray(state.savedLinkedinJobs) ? state.savedLinkedinJobs : [];
      const savedLinkedinJobsList = Array.isArray(state.savedLinkedinJobsList) ? state.savedLinkedinJobsList : [];
      const linkedinJobs = Array.isArray(state.linkedinJobs) ? state.linkedinJobs : [];
      const newSavedLinkedinJobs = [action.payload, ...savedLinkedinJobs];
      const newSavedLinkedinJobsList = [
        action.payload.id,
        ...savedLinkedinJobsList,
      ];
      const newSavedLinkedinJobsResult = newSavedLinkedinJobs.reduce(
        (unique, o) => {
          if (!unique.some((obj) => obj.id == o.id)) {
            unique.push(o);
          }
          return unique;
        },
        []
      );
      const updatedLinkedinJobs = linkedinJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "linkedinjobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        linkedinJobs: updatedLinkedinJobs,
        savedLinkedinJobs: newSavedLinkedinJobsResult,
        savedLinkedinJobsList: newSavedLinkedinJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case IN_PROCESS_LINKEDIN_JOB_SUCCESS: {
      const linkedinJobs = Array.isArray(state.linkedinJobs) ? state.linkedinJobs : [];
      const savedLinkedinJobs = Array.isArray(state.savedLinkedinJobs) ? state.savedLinkedinJobs : [];
      const updatedLinkedinJobs = linkedinJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );

      const newSavedLinkedinJobs = savedLinkedinJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
          ? { ...job, in_progress: action.payload.inProgress }
          : job );

      return { ...state, linkedinJobs: updatedLinkedinJobs, savedLinkedinJobs:newSavedLinkedinJobs };
    }

    case APPLY_LINKEDIN_JOB_SUCCESS: {
      const linkedinJobs = Array.isArray(state.linkedinJobs) ? state.linkedinJobs : [];
      const appliedLinkedinJobs = Array.isArray(state.appliedLinkedinJobs) ? state.appliedLinkedinJobs : [];
      const appliedLinkedinJobsList = Array.isArray(state.appliedLinkedinJobsList) ? state.appliedLinkedinJobsList : [];
      const savedLinkedinJobs = Array.isArray(state.savedLinkedinJobs) ? state.savedLinkedinJobs :[];

      const upadtedSavedLinkedinJobs = savedLinkedinJobs.filter(job =>
        job.id != action.payload.id
      );
      const updatedLinkedinJobs = linkedinJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const newAppliedLinkedinJobs = [
        action.payload,
        ...appliedLinkedinJobs
      ];
      const newAppliedLinkedinJobsList = [
        action.payload.id,
        ...appliedLinkedinJobsList
      ];
      const newAppliedLinkedinJobsResult = newAppliedLinkedinJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedLinkedinJobsListResult = [
        ...new Set(newAppliedLinkedinJobsList)
      ];

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "linkedinjobs"){
          return {...newItem, count: item.count-1, appliedcount: item.appliedcount+1, savedcount: action.payload.is_saved ? item.savedcount-1: item.savedcount};
        }
        return newItem;
      });
      return {
        ...state,
        linkedinJobs: updatedLinkedinJobs,
        savedLinkedinJobs: upadtedSavedLinkedinJobs,
        appliedLinkedinJobs: newAppliedLinkedinJobsResult,
        appliedLinkedinJobsList: newAppliedLinkedinJobsListResult,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case REMOVE_SAVE_LINKEDIN_JOB_SUCCESS: {
      const savedLinkedinJobs = Array.isArray(state.savedLinkedinJobs) ? state.savedLinkedinJobs : [];
      const savedLinkedinJobsList = Array.isArray(state.savedLinkedinJobsList) ? state.savedLinkedinJobsList : [];
      const linkedinJobs = Array.isArray(state.linkedinJobs) ? state.linkedinJobs : [];
      const updatedSavedLinkedinJobs = savedLinkedinJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedSavedLinkedinJobsList = savedLinkedinJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedLinkedinJobs = linkedinJobs.map(job =>
        parseInt(job.j_id, 10) == parseInt(action.payload.id, 10) ? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];
      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "linkedinjobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });
      return {
        ...state,
        linkedinJobs: updatedLinkedinJobs,
        savedLinkedinJobs: updatedSavedLinkedinJobs,
        savedLinkedinJobsList: updatedSavedLinkedinJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case WITHDRAW_LINKEDIN_JOB_SUCCESS: {
      const linkedinJobs = Array.isArray(state.linkedinJobs) ? state.linkedinJobs : [];
      const appliedLinkedinJobs = Array.isArray(state.appliedLinkedinJobs) ? state.appliedLinkedinJobs : [];
      const appliedLinkedinJobsList = Array.isArray(state.appliedLinkedinJobsList) ? state.appliedLinkedinJobsList : [];
      const updatedLinkedinJobs = linkedinJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, inprogress: false }
          : job
      );
      const updatedAppliedLinkedinJobs = appliedLinkedinJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedLinkedinJobsList = appliedLinkedinJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "linkedinjobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        linkedinJobs: updatedLinkedinJobs,
        appliedLinkedinJobs: updatedAppliedLinkedinJobs,
        appliedLinkedinJobsList: updatedAppliedLinkedinJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    // Add Glassdoor job cases
    case SAVE_GLASSDOOR_JOB_SUCCESS: {
      const savedGlassdoorJobs = Array.isArray(state.savedGlassdoorJobs) ? state.savedGlassdoorJobs : [];
      const savedGlassdoorJobsList = Array.isArray(state.savedGlassdoorJobsList) ? state.savedGlassdoorJobsList : [];
      const glassdoorJobs = Array.isArray(state.glassdoorJobs) ? state.glassdoorJobs : [];
      const newSavedGlassdoorJobs = [
        action.payload,
        ...savedGlassdoorJobs,
      ];
      const newSavedGlassdoorJobsList = [
        action.payload.id,
        ...savedGlassdoorJobsList,
      ];
      const newSavedGlassdoorJobsResult = newSavedGlassdoorJobs.reduce(
        (unique, o) => {
          if (!unique.some((obj) => obj.id == o.id)) {
            unique.push(o);
          }
          return unique;
        },
        []
      );
      const updatedGlassdoorJobs = glassdoorJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "glassdoorjobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        glassdoorJobs: updatedGlassdoorJobs,
        savedGlassdoorJobs: newSavedGlassdoorJobsResult,
        savedGlassdoorJobsList: newSavedGlassdoorJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case IN_PROCESS_GLASSDOOR_JOB_SUCCESS: {
      const glassdoorJobs = Array.isArray(state.glassdoorJobs) ? state.glassdoorJobs : [];
      const savedGlassdoorJobs = Array.isArray(state.savedGlassdoorJobs) ? state.savedGlassdoorJobs : [];
      const updatedGlassdoorJobs = glassdoorJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );

      const newSavedGlassdoorJobs = savedGlassdoorJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
          ? { ...job, in_progress: action.payload.inProgress }
          : job );

      return { ...state, glassdoorJobs: updatedGlassdoorJobs, savedGlassdoorJobs:newSavedGlassdoorJobs };
    }

    case APPLY_GLASSDOOR_JOB_SUCCESS: {
      const glassdoorJobs = Array.isArray(state.glassdoorJobs) ? state.glassdoorJobs : [];
      const appliedGlassdoorJobs = Array.isArray(state.appliedGlassdoorJobs) ? state.appliedGlassdoorJobs : [];
      const appliedGlassdoorJobsList = Array.isArray(state.appliedGlassdoorJobsList) ? state.appliedGlassdoorJobsList : [];
      const savedGlassdoorJobs = Array.isArray(state.savedGlassdoorJobs) ? state.savedGlassdoorJobs :[];

      const upadtedSavedGlassdoorJobs = savedGlassdoorJobs.filter(job =>
        job.id != action.payload.id
      );

      const updatedGlassdoorJobs = glassdoorJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const newAppliedGlassdoorJobs = [
        action.payload,
        ...appliedGlassdoorJobs
      ];
      const newAppliedGlassdoorJobsList = [
        action.payload.id,
        ...appliedGlassdoorJobsList
      ];
      const newAppliedGlassdoorJobsResult = newAppliedGlassdoorJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedGlassdoorJobsListResult = [
        ...new Set(newAppliedGlassdoorJobsList)
      ];
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "glassdoorjobs"){
          return {...newItem, count: item.count-1, appliedcount: item.appliedcount+1, savedcount: action.payload.is_saved ? item.savedcount-1: item.savedcount};
        }
        return newItem;
      });

      return {
        ...state,
        glassdoorJobs: updatedGlassdoorJobs,
        savedGlassdoorJobs: upadtedSavedGlassdoorJobs,
        appliedGlassdoorJobs: newAppliedGlassdoorJobsResult,
        appliedGlassdoorJobsList: newAppliedGlassdoorJobsListResult,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case REMOVE_SAVE_GLASSDOOR_JOB_SUCCESS: {
      const savedGlassdoorJobs = Array.isArray(state.savedGlassdoorJobs) ? state.savedGlassdoorJobs : [];
      const savedGlassdoorJobsList = Array.isArray(state.savedGlassdoorJobsList) ? state.savedGlassdoorJobsList : [];
      const glassdoorJobs = Array.isArray(state.glassdoorJobs) ? state.glassdoorJobs : [];
      const updatedSavedGlassdoorJobs = savedGlassdoorJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedSavedGlassdoorJobsList = savedGlassdoorJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedGlassdoorJobs = glassdoorJobs.map(job =>
        parseInt(job.j_id, 10) === parseInt(action.payload.id, 10) ? { ...job, is_saved: false } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "glassdoorjobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        glassdoorJobs: updatedGlassdoorJobs,
        savedGlassdoorJobs: updatedSavedGlassdoorJobs,
        savedGlassdoorJobsList: updatedSavedGlassdoorJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case WITHDRAW_GLASSDOOR_JOB_SUCCESS: {
      const glassdoorJobs = Array.isArray(state.glassdoorJobs) ? state.glassdoorJobs : [];
      const appliedGlassdoorJobs = Array.isArray(state.appliedGlassdoorJobs) ? state.appliedGlassdoorJobs : [];
      const appliedGlassdoorJobsList = Array.isArray(state.appliedGlassdoorJobsList) ? state.appliedGlassdoorJobsList : [];
      const updatedGlassdoorJobs = glassdoorJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, inprogress: false }
          : job
      );
      const updatedAppliedGlassdoorJobs = appliedGlassdoorJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedGlassdoorJobsList = appliedGlassdoorJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "glassdoorjobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        glassdoorJobs: updatedGlassdoorJobs,
        appliedGlassdoorJobs: updatedAppliedGlassdoorJobs,
        appliedGlassdoorJobsList: updatedAppliedGlassdoorJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    // Add Ziprecruiter job cases
    case SAVE_ZIPRECRUITER_JOB_SUCCESS: {
      const savedZiprecruiterJobs = Array.isArray(state.savedZiprecruiterJobs) ? state.savedZiprecruiterJobs : [];
      const savedZiprecruiterJobsList = Array.isArray(state.savedZiprecruiterJobsList) ? state.savedZiprecruiterJobsList : [];
      const ziprecruiterJobs = Array.isArray(state.ziprecruiterJobs) ? state.ziprecruiterJobs : [];

      const newSavedZiprecruiterJobs = [action.payload, ...savedZiprecruiterJobs];
      const newSavedZiprecruiterJobsList = [action.payload.id, ...savedZiprecruiterJobsList];
      const newSavedZiprecruiterJobsResult = newSavedZiprecruiterJobs.reduce(
        (unique, o) => {
          if (!unique.some((obj) => obj.id == o.id)) {
            unique.push(o);
          }
          return unique;
        },
        []
      );
      const updatedZiprecruiterJobs = ziprecruiterJobs.map((job) =>
        job.j_id == action.payload.id ? { ...job, is_saved: true } : job
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "ziprecruiterjobs"){
          return {...newItem, savedcount: item.savedcount+1};
        }
        return newItem;
      });
      return {
        ...state,
        ziprecruiterJobs: updatedZiprecruiterJobs,
        savedZiprecruiterJobs: newSavedZiprecruiterJobsResult,
        savedZiprecruiterJobsList: newSavedZiprecruiterJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case IN_PROCESS_ZIPRECRUITER_JOB_SUCCESS: {
      const ziprecruiterJobs = Array.isArray(state.ziprecruiterJobs) ? state.ziprecruiterJobs : [];
      const savedZiprecruiterJobs = Array.isArray(state.savedZiprecruiterJobs) ? state.savedZiprecruiterJobs : [];
      const updatedZiprecruiterJobs = ziprecruiterJobs.map(job =>
        job.j_id == action.payload.id
          ? { ...job, in_progress: action.payload.inProgress }
          : job
      );

      const newSavedZiprecruiterJobs = savedZiprecruiterJobs.map(job =>
        parseInt(job.id, 10) === parseInt(action.payload.id, 10)
          ? { ...job, in_progress: action.payload.inProgress }
          : job );

      return { ...state, ziprecruiterJobs: updatedZiprecruiterJobs, savedZiprecruiterJobs:newSavedZiprecruiterJobs };
    }

    case APPLY_ZIPRECRUITER_JOB_SUCCESS: {
      const ziprecruiterJobs = Array.isArray(state.ziprecruiterJobs) ? state.ziprecruiterJobs : [];
      const appliedZiprecruiterJobs = Array.isArray(state.appliedZiprecruiterJobs) ? state.appliedZiprecruiterJobs : [];
      const appliedZiprecruiterJobsList = Array.isArray(state.appliedZiprecruiterJobsList) ? state.appliedZiprecruiterJobsList : [];
      const savedZiprecruiterJobs = Array.isArray(state.savedZiprecruiterJobs) ? state.savedZiprecruiterJobs :[];

      const upadtedSavedZiprecruiterJobs = savedZiprecruiterJobs.filter(job =>
        job.id != action.payload.id
      );

      const updatedZiprecruiterJobs = ziprecruiterJobs.filter(job =>
        job.j_id !== action.payload.id.toString()
      );
      const newAppliedZiprecruiterJobs = [
        action.payload,
        ...appliedZiprecruiterJobs
      ];
      const newAppliedZiprecruiterJobsList = [
        action.payload.id,
        ...appliedZiprecruiterJobsList
      ];
      const newAppliedZiprecruiterJobsResult = newAppliedZiprecruiterJobs.reduce(
        (accumulator, current) => {
          if (!accumulator.some(job => job.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        },
        []
      );
      const newAppliedZiprecruiterJobsListResult = [
        ...new Set(newAppliedZiprecruiterJobsList)
      ];

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "ziprecruiterjobs"){
          return {...newItem, count: item.count-1, appliedcount: item.appliedcount+1, savedcount: action.payload.is_saved ? item.savedcount-1: item.savedcount};
        }
        return newItem;
      });

      return {
        ...state,
        ziprecruiterJobs: updatedZiprecruiterJobs,
        savedZiprecruiterJobs: upadtedSavedZiprecruiterJobs,
        appliedZiprecruiterJobs: newAppliedZiprecruiterJobsResult,
        appliedZiprecruiterJobsList: newAppliedZiprecruiterJobsListResult,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case REMOVE_SAVE_ZIPRECRUITER_JOB_SUCCESS: {
      const savedZiprecruiterJobs = Array.isArray(state.savedZiprecruiterJobs) ? state.savedZiprecruiterJobs : [];
      const savedZiprecruiterJobsList = Array.isArray(state.savedZiprecruiterJobsList) ? state.savedZiprecruiterJobsList : [];
      const ziprecruiterJobs = Array.isArray(state.ziprecruiterJobs) ? state.ziprecruiterJobs : [];
      const updatedSavedZiprecruiterJobs = savedZiprecruiterJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
        const updatedSavedZiprecruiterJobsList = savedZiprecruiterJobsList.filter(
        e => e !== parseInt(action.payload.id, 10)
      );
      const updatedZiprecruiterJobs = ziprecruiterJobs.map(job =>
        parseInt(job.j_id, 10) == parseInt(action.payload.id, 10) ? { ...job, is_saved: false } : job
      );

      let newJobsHeaderCount = [];
      newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "zip_recruiterjobs"){
          return {...newItem, savedcount: item.savedcount-1};
        }
        return newItem;
      });
      return {
        ...state,
        ziprecruiterJobs: updatedZiprecruiterJobs,
        savedZiprecruiterJobs: updatedSavedZiprecruiterJobs,
        savedZiprecruiterJobsList: updatedSavedZiprecruiterJobsList,
        jobsHeaderCount: newJobsHeaderCount,
      };
    }

    case WITHDRAW_ZIPRECRUITER_JOB_SUCCESS: {
      const ziprecruiterJobs = Array.isArray(state.ziprecruiterJobs) ? state.ziprecruiterJobs : [];
      const appliedZiprecruiterJobs = Array.isArray(state.appliedZiprecruiterJobs) ? state.appliedZiprecruiterJobs : [];
      const appliedZiprecruiterJobsList = Array.isArray(state.appliedZiprecruiterJobsList) ? state.appliedZiprecruiterJobsList : [];
      const updatedZiprecruiterJobs = ziprecruiterJobs.map(job =>
        job.j_id === action.payload.id
          ? { ...job, is_applied: false, inprogress: false }
          : job
      );
      const updatedAppliedZiprecruiterJobs = appliedZiprecruiterJobs.filter(
        job => job.id !== parseInt(action.payload.id, 10)
      );
      const updatedAppliedZiprecruiterJobsList = appliedZiprecruiterJobsList.filter(
        id => id !== parseInt(action.payload.id, 10)
      );

      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "zip_recruiterjobs"){
          return {...newItem, appliedcount: item.appliedcount-1};
        }
        return newItem;
      });

      return {
        ...state,
        ziprecruiterJobs: updatedZiprecruiterJobs,
        appliedZiprecruiterJobs: updatedAppliedZiprecruiterJobs,
        appliedZiprecruiterJobsList: updatedAppliedZiprecruiterJobsList,
        jobsHeaderCount: newJobsHeaderCount
      };
    }

    case DELETE_UNNANU_JOB_SUCCESS:
      return {
        ...state,
        unnanuJobs: state.unnanuJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    case DELETE_GOOGLE_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "googlejobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        googleJobs: state.googleJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    }

    case DELETE_X_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "xjobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        xJobs: state.xJobs.filter(job => job.j_id !== action.payload.id)
      };
    }

    case DELETE_INDEED_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "indeedjobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        indeedJobs: state.indeedJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    }

    case DELETE_LINKEDIN_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "linkedinjobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        linkedinJobs: state.linkedinJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    }

    case DELETE_GLASSDOOR_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "glassdoorjobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        glassdoorJobs: state.glassdoorJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    }

    case DELETE_ZIPRECRUITER_JOB_SUCCESS:{
      const newJobsHeaderCount = state.jobsHeaderCount.map(item =>{
        const newItem = {...item};
        if(newItem.jb === "ziprecruiterjobs"){
          return {...newItem, count: item.count-1};
        }
        return newItem;
      });

      return {
        ...state,
        jobsHeaderCount: newJobsHeaderCount,
        ziprecruiterJobs: state.ziprecruiterJobs.filter(
          job => job.j_id !== action.payload.id
        )
      };
    }

    case FETCH_SAVED_X_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let savedXJobs = [];
      if (!Array.isArray(data)) {
        savedXJobs = [...state.savedXJobs];
      } else {
        savedXJobs = page > 0 ? [...state.savedXJobs, ...data] : data;
      }

      return {
        ...state,
        savedXJobs,
        currentPage: {
          ...state.currentPage,
          xSaved: page
        },
        isLoading: {
          ...state.isLoading,
          xSaved: false
        }
      };
    }

    case FETCH_SAVED_GOOGLE_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let savedGoogleJobs = [];
      if (!Array.isArray(data)) {
        savedGoogleJobs = [...state.savedGoogleJobs];
      } else {
        savedGoogleJobs = page > 0 ? [...state.savedGoogleJobs, ...data] : data;
      }

      return {
        ...state,
        savedGoogleJobs,
        currentPage: {
          ...state.currentPage,
          googleSaved: page,
        },
        isLoading: {
          ...state.isLoading,
          googleSaved: false
        }
      };
    }

    case FETCH_SAVED_INDEED_JOBS_SUCCESS:{

      const { data, page } = action.payload;
      let savedIndeedJobs = [];
      if (!Array.isArray(data)) {
        savedIndeedJobs = [...state.savedIndeedJobs];
      } else {
        savedIndeedJobs = page > 0 ? [...state.savedIndeedJobs, ...data] : data;
      }

      return {
        ...state,
        savedIndeedJobs,
        currentPage: {
          ...state.currentPage,
          indeedSaved: page
        },
        isLoading: {
          ...state.isLoading,
          indeedSaved: false
        },
      };
    }

    case FETCH_SAVED_LINKEDIN_JOBS_SUCCESS:{
      const { data, page } = action.payload;
      let savedLinkedinJobs = [];
      if (!Array.isArray(data)) {
        savedLinkedinJobs = [...state.savedLinkedinJobs];
      } else {
        savedLinkedinJobs = page > 0 ? [...state.savedLinkedinJobs, ...data] : data;
      }

      return {
        ...state,
        savedLinkedinJobs,
        currentPage: {
          ...state.currentPage,
          linkedinSaved: page
        },
        isLoading: {
          ...state.isLoading,
          linkedinSaved: false
        }
      };
    }

    case FETCH_SAVED_GLASSDOOR_JOBS_SUCCESS: {
      const {data, page} = action.payload;
      let savedGlassdoorJobs = [];
      if (!Array.isArray(data)) {
        savedGlassdoorJobs = [...state.savedGlassdoorJobs];
      } else {
        savedGlassdoorJobs = page > 0 ? [...state.savedGlassdoorJobs, ...data] : data;
      }

      return {
        ...state,
        savedGlassdoorJobs,
        currentPage: {
          ...state.currentPage,
          glassdoorSaved: page
        },
        isLoading: {
          ...state.isLoading,
          glassdoorSaved: false
        }
      };
    }

    case FETCH_SAVED_ZIPRECRUITER_JOBS_SUCCESS: {
      const {data, page} = action.payload;
      let savedZiprecruiterJobs = [];
      if (!Array.isArray(data)) {
        savedZiprecruiterJobs = [...state.savedZiprecruiterJobs];
      } else {
        savedZiprecruiterJobs = page > 0 ? [...state.savedZiprecruiterJobs, ...data] : data;
      }

      return {
        ...state,
        savedZiprecruiterJobs,
        currentPage: {
          ...state.currentPage,
          ziprecruiterSaved: page
        },
        isLoading: {
          ...state.isLoading,
          ziprecruiterSaved: false
        }
      };
    }

    case SET_JOB_LOADING:
      return {
        ...state,
        isLoading: {
          ...state.isLoading,
          [action.payload.jobType]: action.payload.isLoading
        }
      };

    case FETCH_UNNANU_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          unnanu: false,
        },
        isLoading: {
          ...state.isLoading,
          unnanu: false
        },
        isChecked: {
          ...state.isChecked,
          unnanu: true
        }
      };
    };
    case FETCH_X_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          x: false,
        },
        isLoading: {
          ...state.isLoading,
          x: false
        },
        isChecked: {
          ...state.isChecked,
          x: true
        }
      };
    };
    case FETCH_GOOGLE_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          google: false,
        },
        isLoading: {
          ...state.isLoading,
          google: false
        },
        isChecked: {
          ...state.isChecked,
          google: true
        }
      };
    };
    case FETCH_INDEED_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          indeed: false,
        },
        isLoading: {
          ...state.isLoading,
          indeed: false
        },
        isChecked: {
          ...state.isChecked,
          indeed: true
        }
      };
    };
    case FETCH_LINKEDIN_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          linkedin: false,
        },
        isLoading: {
          ...state.isLoading,
          linkedin: false
        },
        isChecked: {
          ...state.isChecked,
          linkedin: true
        }
      };
    };
    case FETCH_GLASSDOOR_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          glassdoor: false,
        },
        isLoading: {
          ...state.isLoading,
          glassdoor: false
        },
        isChecked: {
          ...state.isChecked,
          glassdoor: true
        }
      };
    };
    case FETCH_ZIPRECRUITER_JOBS_FAIL : {
      return {
        ...state,
        hasMore: {
          ...state.hasMore,
          ziprecruiter: false,
        },
        isLoading: {
          ...state.isLoading,
          ziprecruiter: false
        },
        isChecked: {
          ...state.isChecked,
          ziprecruiter: true
        }
      };
    };

    default:
      return state;
  }
}
