import Students from '../studentJson'
export const REQUEST_PROFILES = 'REQUEST_PROFILES'
export const RECEIVE_PROFILES = 'RECEIVE_PROFILES'
export const INVALIDATE_PROFILES = 'INVALIDATE_PROFILES'
export const SELECT_INDUSTRY = 'SELECT_INDUSTRY'
export const SELECT_YEAR = 'SELECT_YEAR'
export const SELECT_PROGRAMME = 'SELECT_PROGRAMME'
export const GET_INDUSTRY = 'GET_INDUSTRY'
export const NEXT_PAGE_INFO ='NEXT_PAGE_INFO'
export const FACETS_INFO ='FACETS_INFO'


export const selectIndustry = industry => ({
  type: SELECT_INDUSTRY,
  industry
})

export const getIndusrty = gIndusrty => ({
  type: GET_INDUSTRY,
  gIndusrty
})

export const selectYear = year => ({
  type: SELECT_YEAR,
  year
})

export const selectProgramme = programme => ({
  type: SELECT_PROGRAMME,
  programme
})

export const invalidateProfiles = error => ({
  type: INVALIDATE_PROFILES,
  error
})

export const requestProfiles = (industry, year, programme) => ({
  type: REQUEST_PROFILES,
  industry,
  year,
  programme
})

export const receiveProfiles = (stuprofiles, json) => ({
  type: RECEIVE_PROFILES,
  stuprofiles,
  posts: json.results.map(child => child	),
  receivedAt: Date.now()
})

export const nextPageInfo = json => ({
  type : NEXT_PAGE_INFO,
  page: json.summary.currStart,
  perPage: json.summary.numRanks,
  nextStart: json.summary.nextStart,
  totalPages: json.summary.totalMatching,
  currEnd: json.summary.currEnd
})

export const getFacetsInfo = json => ({
  type : FACETS_INFO,
  facets: json.facets
}) 

const fetchPosts = (industry, year, programme) => dispatch => {
  dispatch(requestProfiles(industry, year, programme))
  let i = String(industry),
      n = String(year),
      p = String(programme)
  return fetch(`https://www.cass.city.ac.uk/fb/search.html?form=json&collection=CASS-Student-Profiles&meta_I_orsand=${i === 'all' ? '': industry}&meta_Y_orsand=${n === 'all' ? '': year}&meta_P_orsand=${p === 'all'? '': programme}&num_ranks=5`)
    .then(response => response.json())
    .then(function json (j) { dispatch(receiveProfiles(industry, j)); dispatch(nextPageInfo(j))})
    .catch(e =>  dispatch(invalidateProfiles(e)))
}

export const loadMore = (industry, year, programme, page, perPage, totalPages, currEnd) => (dispatch, getState )=> {
  let page = page,
      perpage = perPage,
      totalPage = totalPages,
      currEnd = currEnd,
      i = String(industry),
      n = String(year),
      p = String(programme)
  if (perpage < totalPage ){
    let v = perpage+5
  return fetch(`https://www.cass.city.ac.uk/fb/search.html?form=json&collection=CASS-Student-Profiles&meta_I_orsand=${i === 'all' ? '': industry}&meta_Y_orsand=${n === 'all' ? '': year}&meta_P_orsand=${p === 'all'? '': programme}&num_ranks=${v}`)
  .then(response => response.json())
  .then(function json (j) { dispatch(receiveProfiles(industry, j)); dispatch(nextPageInfo(j))})
}
}

export const fetchProfileIfNeeded = (industry, year, programme) => (dispatch, getState) => {
  
    return dispatch(fetchPosts(industry, year, programme)) //change to use local JSON from funnelback
    //return dispatch(receiveProfiles(industry, Students))
  
}
