import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { fetchProfileIfNeeded, loadMore, invalidateProfiles, selectIndustry,
 selectNationality, selectProgramme, getIndusrty, receiveProfiles, nextPageInfo, getFacetsInfo } from './actions'
import Profiles from './components/Profiles'
import PickerIdustry from './components/PickerIdustry'
import PickerNationality from './components/PickerNationality'
import PickerProgramme from './components/PickerProgramme'
import Progressbar from './components/Progressbar'
import PropTypes from 'prop-types'
import ClearFilters from './components/ClearFilters'
import Students from './studentJson'
import qs from 'qs';
import { BeatLoader } from 'react-spinners';





class MainPage extends PureComponent {
  
  static propTypes = {
    selectedIndustry: PropTypes.string.isRequired,
    selectedNationality: PropTypes.string.isRequired,
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
      
    if(parsed.nationality !== undefined){
      this.props.dispatch(selectNationality(parsed.nationality))
      console.log('componentWillMount nationality')
    }

    if(parsed.programme !== undefined){
      this.props.dispatch(selectProgramme(parsed.programme))
      console.log('componentWillMount programme')
    }

    
  }

  componentDidMount() {
    //after component mount dispatch to fetch profile
    const { dispatch, selectedIndustry, selectedNationality, selectedProgramme } = this.props
    dispatch(fetchProfileIfNeeded( selectedIndustry, selectedNationality, selectedProgramme ))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedIndustry, selectedNationality, selectedProgramme, history } = nextProps
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
      
      if(parsed.nationality !== undefined){
        dispatch(selectNationality(parsed.nationality))
        console.log('componentWillMount nationality')
      }else{
        dispatch(selectNationality('all'))
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
      (nextProps.selectedNationality !== this.props.selectedNationality) || 
      (nextProps.selectedProgramme !== this.props.selectedProgramme)) {
      
      dispatch(fetchProfileIfNeeded( selectedIndustry, selectedNationality, selectedProgramme ))
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

  handleChangeNationality = nextNationality => {
    this.props.dispatch(selectNationality(nextNationality))
    const h = this.getHistory()
    h.nationality = nextNationality
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
    const { dispatch, selectedIndustry, selectedNationality, selectedProgramme, receiveNextPageInfo } = this.props
    dispatch(loadMore( selectedIndustry, selectedNationality, selectedProgramme, 
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
        case 'Nationality':
          const a = this.getFacets(facet)
          a.unshift('-- Nationality --')
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
    const { selectedIndustry, selectedNationality, selectedProgramme, profiles, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo, history} = this.props
      console.log(this.props.receiveFacetsInfo)

    return (
      <div className="student-profiles-search">
        <div className="student-profiles-search__top">

          <div className="student-profiles-search__filters">
            <PickerIdustry value={selectedIndustry}
                      onChange={this.handleChangeIndus}
                      options={this.loadFacets('Industry')} />
            <PickerNationality value={selectedNationality}
                      onChange={this.handleChangeNationality}
                      options={this.loadFacets('Nationality')} />
            <PickerProgramme value={selectedProgramme}
                      onChange={this.handleChangeProg}
                      options={this.loadFacets('Programme')} />
          </div> 

          <ClearFilters sIndustry={selectedIndustry} sYear={selectedNationality} sProgramme={selectedProgramme} historyInfo={history} />

          <Profiles profiles={profiles} sIndustry={selectedIndustry} />
          <div className="student-profiles-search__loadingSpinner">
            <BeatLoader
              color={'#88d1ce'} 
              loading={this.props.isFetching} 
            />
          </div>
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
  const { selectedIndustry, selectedNationality, selectedProgramme, profileByF, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo } = state
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
    selectedNationality,
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
