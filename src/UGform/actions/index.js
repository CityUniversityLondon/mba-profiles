export const REQUEST_PROFILES = 'REQUEST_PROFILES'
export const RECEIVE_PROFILES = 'RECEIVE_PROFILES'
export const INVALIDATE_PROFILES = 'INVALIDATE_PROFILES'
export const SELECT_STYPE = 'SELECT_STYPE'
export const SELECT_NATIONALITY = 'SELECT_NATIONALITY'
export const SELECT_PROGRAMME = 'SELECT_PROGRAMME'
export const GET_INDUSTRY = 'GET_INDUSTRY'
export const NEXT_PAGE_INFO = 'NEXT_PAGE_INFO'
export const FACETS_INFO = 'FACETS_INFO'


export const selectSType = stype => ({
    type: SELECT_STYPE,
    stype
})

export const getIndusrty = gIndusrty => ({
    type: GET_INDUSTRY,
    gIndusrty
})

export const selectNationality = nationality => ({
    type: SELECT_NATIONALITY,
    nationality
})

export const selectProgramme = programme => ({
    type: SELECT_PROGRAMME,
    programme
})

export const invalidateProfiles = error => ({
    type: INVALIDATE_PROFILES,
    error
})

export const requestProfiles = (industry, nationality, programme) => ({
    type: REQUEST_PROFILES,
    industry,
    nationality,
    programme
})

export const receiveProfiles = (stuprofiles, json) => ({
    type: RECEIVE_PROFILES,
    stuprofiles,
    posts: json.results.map(child => child),
    receivedAt: Date.now()
})

export const nextPageInfo = json => ({
    type: NEXT_PAGE_INFO,
    page: json.summary.currStart,
    perPage: json.summary.numRanks,
    nextStart: json.summary.nextStart,
    totalPages: json.summary.totalMatching,
    currEnd: json.summary.currEnd
})

export const getFacetsInfo = json => ({
    type: FACETS_INFO,
    facets: json.facets
})

const fetchPosts = (industry, nationality, programme) => dispatch => {
    dispatch(requestProfiles(industry, nationality, programme))
    let i = String(industry),
        n = String(nationality),
        p = String(programme),
        pq

    if (p === 'all') {
        pq = ''
    } else if (p === 'executive mba') {
        pq = '"' + p + '"' + '&meta_P_not="in%20dubai"'
    } else {
        pq = '"' + p + '"'
    }

    let url = `https://www.bayes.city.ac.uk/webservices/funnelback-find-fb16?form=json&collection=city-university~sp-CASS-Student-Profiles&meta_L_orsand=UG&meta_T_orsand=${i === 'all' ? '': industry}&meta_N_orsand=${n === 'all' ? '': nationality}&meta_P_and=` + pq + '&num_ranks=6&sort=title'
    return fetch(url)
        .then(response => response.json())
        .then(function json(j) { dispatch(receiveProfiles(industry, j));
            dispatch(nextPageInfo(j)) })
        .catch(e => dispatch(invalidateProfiles(e)))
}

export const loadMore = (industry, nationality, programme, page, perPage, totalPages, currEnd) => (dispatch, getState) => {
    let page = page,
        perpage = perPage,
        totalPage = totalPages,
        currEnd = currEnd,
        i = String(industry),
        n = String(nationality),
        p = String(programme),
        pq

    if (p === 'all') {
        pq = ''
    } else if (p === 'executive mba') {
        pq = '"' + p + '"' + '&meta_P_not="in%20dubai"'
    } else {
        pq = '"' + p + '"'
    }

    if (perpage < totalPage) {
        let v = perpage + 6
        let url = `https://www.bayes.city.ac.uk/webservices/funnelback-find-fb16?form=json&collection=city-university~sp-CASS-Student-Profiles&meta_L_orsand=UG&meta_T_orsand=${i === 'all' ? '': industry}&meta_N_orsand=${n === 'all' ? '': nationality}&meta_P_and=` + pq + `&num_ranks=${v}&sort=title`
        return fetch(url)
            .then(response => response.json())
            .then(function json(j) { dispatch(receiveProfiles(industry, j));
                dispatch(nextPageInfo(j)) })
    }
}

export const fetchProfileIfNeeded = (industry, nationality, programme) => (dispatch, getState) => {

    return dispatch(fetchPosts(industry, nationality, programme))


}