import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { fetchProfileIfNeeded, loadMore, invalidateProfiles, selectIndustry,
 selectYear, selectProgramme, getIndusrty, receiveProfiles, nextPageInfo, getFacetsInfo } from './actions'
import Profiles from './components/Profiles'
import PickerIdustry from './components/PickerIdustry'
import PickerYear from './components/PickerYear'
import PickerProgramme from './components/PickerProgramme'
import Progressbar from './components/Progressbar'
import PropTypes from 'prop-types'
import ClearFilters from './components/ClearFilters'
import Students from './studentJson'
import qs from 'qs';





class MainPage extends PureComponent {
  
  static propTypes = {
    selectedIndustry: PropTypes.string.isRequired,
    selectedYear: PropTypes.string.isRequired,
    selectedProgramme: PropTypes.string.isRequired,
    profiles: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired,
    handleChangeIndus: PropTypes.func,
    handleChangeNat: PropTypes.func,
    handleChangeProg: PropTypes.func
  }

  componentWillMount(){
    //load facets info from funnelback and dispatch into redux store
    fetch(`https://www.cass.city.ac.uk/fb/search.html?form=json&collection=CASS-Student-Profiles`)
    .then(response => response.json())
    .then(json => this.props.dispatch(getFacetsInfo(json)))  

  
    //using URL query parameter to set state 
    const parsed = qs.parse(this.props.history.location.search, { ignoreQueryPrefix: true })
    
    if(parsed.industry !== undefined){
      this.props.dispatch(selectIndustry(parsed.industry))
      console.log('componentWillMount industry')
    }
      
    if(parsed.year !== undefined){
      this.props.dispatch(selectYear(parsed.year))
      console.log('componentWillMount year')
    }

    if(parsed.programme !== undefined){
      this.props.dispatch(selectProgramme(parsed.programme))
      console.log('componentWillMount programme')
    }

    
  }

  componentDidMount() {
    //after component mount dispatch to fetch profile
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme } = this.props
    dispatch(fetchProfileIfNeeded( selectedIndustry, selectedYear, selectedProgramme ))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme, history } = nextProps
    //listen to browser back and forward buttons and dispatch accorrding to parameters
    history.listen(function(location) {
      let parsed =  qs.parse(history.location.search, { ignoreQueryPrefix: true })
      console.log(parsed)
      if(parsed.industry !== undefined){
        dispatch(selectIndustry(parsed.industry))
        console.log('componentWillMount industry')
      }else{
        dispatch(selectIndustry('all'))
      }
      
      if(parsed.year !== undefined){
        dispatch(selectYear(parsed.year))
        console.log('componentWillMount year')
      }else{
        dispatch(selectYear('all'))
      }

      if(parsed.programme !== undefined){
        dispatch(selectProgramme(parsed.programme))
        console.log('componentWillMount programme')
      }else{
        dispatch(selectProgramme('all'))
      }
    })
    //handle selectbox changes by comparing new to old value
    if ((nextProps.selectedIndustry !== this.props.selectedIndustry) || 
      (nextProps.selectedYear !== this.props.selectedYear) || 
      (nextProps.selectedProgramme !== this.props.selectedProgramme)) {
      
      dispatch(fetchProfileIfNeeded( selectedIndustry, selectedYear, selectedProgramme ))
    }
  }
  //handle onchange events on selectboxes
  getHistory = () =>{
    const h = this.props.location.search
    const parsed = qs.parse(h, { ignoreQueryPrefix: true })
    return parsed
  }

  setHistory = parseHistory =>{
    this.props.history.push(parseHistory)
  }

  handleChangeIndus = nextIndus => {
    this.props.dispatch(selectIndustry(nextIndus))
    const h = this.getHistory()
    h.industry = nextIndus
    const stringfiy = qs.stringify(h)
    this.props.history.push('?'+stringfiy)
  }

  handleChangeYear = nextYear => {
    this.props.dispatch(selectYear(nextYear))
    const h = this.getHistory()
    h.year = nextYear
    const stringfiy = qs.stringify(h)
    this.props.history.push('?'+stringfiy)
    
  }

  handleChangeProg = nextProg => {
    this.props.dispatch(selectProgramme(nextProg))
    const h = this.getHistory()
    h.programme = nextProg
    const stringfiy = qs.stringify(h)
    this.props.history.push('?'+stringfiy)
  }
  //handle load more button
  loadMore = () => {
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme, receiveNextPageInfo } = this.props
    dispatch(loadMore( selectedIndustry, selectedYear, selectedProgramme, 
      receiveNextPageInfo.page, receiveNextPageInfo.perPage, receiveNextPageInfo.totalPages, receiveNextPageInfo.currEnd ))
  }

  
  // load selectbox facets from state 
  getFacets = selected => {
    
    const i = this.props.receiveFacetsInfo
    console.log(selected)
    console.log(i)
    const a = []
    i.forEach( e => {
            if(e.name === selected)
              e.options.forEach( el => a.push(el.v)) 
          })
    
    return a
  }

  loadFacets = facet =>{
    const i = this.props.receiveFacetsInfo
    if(Object.keys(i).length === 0 && i.constructor === Object){
      return []
    }
    else{
      switch (facet){
        case 'Industry':
          const f = this.getFacets(facet)
          f.unshift('-- Industry --')
          return f.sort()
        case 'Year':
          const a = this.getFacets(facet)
          a.unshift('-- Year --')
          return a.sort()
        case 'Programme':
          const p = this.getFacets(facet)
          p.unshift('-- Programme --')
          return p.sort()
        default:
          return []
      }
    }
  }

  

  render() {
    const { selectedIndustry, selectedYear, selectedProgramme, profiles, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo, history} = this.props
      console.log(this.props.receiveFacetsInfo)

    return (
      <div className="student-profiles-search">
        <div className="student-profiles-search__top">

          <div className="student-profiles-search__filters">
            <PickerIdustry value={selectedIndustry}
                      onChange={this.handleChangeIndus}
                      options={this.loadFacets('Industry')} />
            <PickerYear value={selectedYear}
                      onChange={this.handleChangeYear}
                      options={this.loadFacets('Year')} />
            <PickerProgramme value={selectedProgramme}
                      onChange={this.handleChangeProg}
                      options={this.loadFacets('Programme')} />
          </div> 

          <ClearFilters sIndustry={selectedIndustry} sYear={selectedYear} sProgramme={selectedProgramme} historyInfo={history} />

          <Profiles profiles={profiles} sIndustry={selectedIndustry} />

        </div>

        <div className="student-profiles-search__bottom">

          <div className="student-profiles-search__profileInfo">
            <div className="student-profiles-search__profileInfo__text">You've viewed {profiles.length} of {receiveNextPageInfo.totalPages} profiles</div>

            <Progressbar />

          </div>
          {
            receiveNextPageInfo.perPage === receiveNextPageInfo.nextStart ? <button type='button' disabled>Load more</button> :
            <div className="loadMoreButtonContainer"><button data-page={profiles.profileByF} 
            onClick={this.loadMore}>Load more</button></div>
          }
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { selectedIndustry, selectedYear, selectedProgramme, profileByF, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo } = state
  const {
    isFetching,
    lastUpdated,
    items: profiles
  } = profileByF[selectedIndustry] || {
    isFetching: true,
    items: [],
  }
  return { 
    selectedIndustry,
    selectedYear,
    selectedProgramme,
    profiles,
    isFetching,
    lastUpdated,
    receiveIndustry,
    receiveNextPageInfo,
    receiveFacetsInfo
  } 
}


export default connect(mapStateToProps)(MainPage);
