import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux';
import { REQUEST_PROFILES, RECEIVE_PROFILES, INVALIDATE_PROFILES,
 SELECT_STYPE, SELECT_NATIONALITY, SELECT_PROGRAMME, GET_INDUSTRY, NEXT_PAGE_INFO, FACETS_INFO } from '../actions'


const selectedSType = (state = 'all', action) => {
  switch (action.type) {
    case SELECT_STYPE:
      return action.stype
    default:
      return state
  }
}

const selectedNationality = (state = 'all', action) => {
  switch (action.type) {
    case SELECT_NATIONALITY:
      return action.nationality
    default:
      return state
  }
}

const selectedProgramme = (state = 'all', action) => {
  switch (action.type) {
    case SELECT_PROGRAMME:
      return action.programme
    default:
      return state
  }
}

const receiveIndustry = (state = {}, action) => {
  switch (action.type){
    case GET_INDUSTRY:
      return action.gIndusrty
    default:
      return state
  }
}

const receiveNextPageInfo = (state = {}, action ) => {
  switch (action.type){
    case NEXT_PAGE_INFO:
      return {
        page: action.page,
        perPage: action.perPage,
        totalPages: action.totalPages,
        currEnd: action.currEnd
      }
    default:
      return state
  }
}

const receiveFacetsInfo = (state = {}, action ) => {
  switch (action.type){
    case FACETS_INFO:
      return action.facets
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
  	case INVALIDATE_PROFILES:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_PROFILES:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_PROFILES:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt,
        
      }
    default:
      return state
  }
}

const profileByF = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_PROFILES:
    case RECEIVE_PROFILES:
    case REQUEST_PROFILES:
      return {
        ...state,
        [action.stuprofiles]: posts(state[action.stuprofiles], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  profileByF,
  selectedSType,
  selectedNationality,
  selectedProgramme,
  receiveIndustry,
  receiveNextPageInfo,
  receiveFacetsInfo,
  routing: routerReducer
})

export default rootReducer