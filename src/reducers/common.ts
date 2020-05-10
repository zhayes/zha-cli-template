export const SAVE_BREADCRUMB = Symbol('RECEIVE_BREADCRUMB');

export const SAVE_SIDEMENUDATA = Symbol('SAVE_SIDEMENUDATA');

export const FETCH_CODEURL = Symbol('FETCH_CODEURL');
export const SAVE_CODEURL = Symbol('RECEIVE_CODEURL');

export const FETCH_LOGIN_INFO = Symbol('REQUEST_LOGIN');
export const SAVE_LOGIN_INFO = Symbol('SAVE_LOGIN');

export const UPDATE_PASSWORD = Symbol('UPDATE_PASSWORD');

export const FETCH_PERMISSIONS = Symbol('FETCH_PERMISSIONS');
export const SAVE_PERMISSIONS = Symbol('SAVE_PERMISSIONS');

export const INIT_STATE = Symbol('SAVE_NEWS_SOURCE_TAGS')

const initState = {
  sideMenu: [],
  breadcrumb : [],
  permissions: []
}

const common = (state = initState, action:Action) => {
  switch (action.type) {
    case SAVE_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.data || []
      }
    case SAVE_SIDEMENUDATA:
      return {
        ...state,
        sideMenu: action.data
      }
    case SAVE_CODEURL:
      return {
        ...state,
        ...action.data
      }
    case SAVE_LOGIN_INFO:
      return {
        ...state,
        loginInfo: action.data
      }
    case SAVE_PERMISSIONS:
      return {
        ...state,
        permissions: action.data
      }
    case INIT_STATE:
      return {
        ...initState
      }
    default:
      return state
  }
}

export default common
