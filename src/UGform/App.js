import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { fetchProfileIfNeeded, loadMore, invalidateProfiles, selectSType,
 selectNationality, selectProgramme, getIndusrty, receiveProfiles, nextPageInfo, getFacetsInfo } from './actions'
import Profiles from './components/Profiles'
import PickerSType from './components/PickerSType'
import PickerNationality from './components/PickerNationality'
import PickerProgramme from './components/PickerProgramme'
import Progressbar from './components/Progressbar'
import PropTypes from 'prop-types'
import ClearFilters from './components/ClearFilters'
import qs from 'qs';
import { BeatLoader } from 'react-spinners';





class app extends PureComponent {
  
  static propTypes = {
    selectedSType: PropTypes.string.isRequired,
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


    

  

    const parsed = qs.parse(this.props.history.location.search, { ignoreQueryPrefix: true })
    
    if(parsed.stype !== undefined){
      this.props.dispatch(selectSType(parsed.stype))
    }
      
    if(parsed.nationality !== undefined){
      this.props.dispatch(selectNationality(parsed.nationality))
    }

    if(parsed.programme !== undefined){
      this.props.dispatch(selectProgramme(parsed.programme))
    }

    
  }

  componentDidMount() {

    fetch(`https://www.cass.city.ac.uk/fb/search.html?form=json&collection=CASS-Student-Profiles&meta_L_orsand=UG`)
    .then(response => response.json())
    .then(json => this.props.dispatch(getFacetsInfo(json)))  
 

    const { dispatch, selectedSType, selectedNationality, selectedProgramme } = this.props
    dispatch(fetchProfileIfNeeded( selectedSType, selectedNationality, selectedProgramme ))
  }

  componentWillReceiveProps(nextProps) {
    
    const { dispatch, selectedSType, selectedNationality, selectedProgramme, history } = nextProps

    history.listen(function(location) {
      let parsed =  qs.parse(history.location.search, { ignoreQueryPrefix: true })
      if(parsed.stype !== undefined){
        dispatch(selectSType(parsed.stype))
      }else{
        dispatch(selectSType('all'))
      }
      
      if(parsed.nationality !== undefined){
        dispatch(selectNationality(parsed.nationality))
      }else{
        dispatch(selectNationality('all'))
      }

      if(parsed.programme !== undefined){
        dispatch(selectProgramme(parsed.programme))
      }else{
        dispatch(selectProgramme('all'))
      }

    })

    if ((nextProps.selectedSType !== this.props.selectedSType) || 
      (nextProps.selectedNationality !== this.props.selectedNationality) || 
      (nextProps.selectedProgramme !== this.props.selectedProgramme)) {
      
      dispatch(fetchProfileIfNeeded( selectedSType, selectedNationality, selectedProgramme ))
      
    }
  }
  
  getHistory = () =>{

    const h = this.props.location.search
    const parsed = qs.parse(h, { ignoreQueryPrefix: true })
    return parsed
  }

  setHistory = parseHistory =>{
    this.props.history.push(parseHistory)
  }

  handleChangeIndus = nextIndus => {
    this.props.dispatch(selectSType(nextIndus))
    const h = this.getHistory()
    h.stype = nextIndus
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

  loadMore = () => {
    const { dispatch, selectedSType, selectedNationality, selectedProgramme, receiveNextPageInfo } = this.props
    dispatch(loadMore( selectedSType, selectedNationality, selectedProgramme, 
      receiveNextPageInfo.page, receiveNextPageInfo.perPage, receiveNextPageInfo.totalPages, receiveNextPageInfo.currEnd ))
  }

  

  getFacets = selected => {
    
    const i = this.props.receiveFacetsInfo
    const a = []
    i.forEach( e => {
            if(e.name === selected)
              e.options.forEach( el => {
                let nat = el.v.split('; ');
                a.push(nat)
              }) 
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
        case 'sType':
          const f = this.getFacets(facet)
          f.unshift('-- Student type --')
          return f.sort()
        case 'Nationality':
          const a = this.getFacets(facet)
          let flatten = [].concat(...a);
          let removeDup = [...(new Set(flatten))];
          removeDup.unshift('-- Nationality --')
          return removeDup.sort()
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
    const { selectedSType, selectedNationality, selectedProgramme, profiles, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo, history} = this.props

    return (
      <div className="student-profiles-search">
        <div className="student-profiles-search__top">

          <div className="student-profiles-search__filters">
            <PickerSType value={selectedSType}
                      onChange={this.handleChangeIndus}
                      options={this.loadFacets('sType')} />
            <PickerNationality value={selectedNationality}
                      onChange={this.handleChangeNationality}
                      options={this.loadFacets('Nationality')} />
            <PickerProgramme value={selectedProgramme}
                      onChange={this.handleChangeProg}
                      options={this.loadFacets('Programme')} />
          </div> 

          <ClearFilters sIndustry={selectedSType} sYear={selectedNationality} sProgramme={selectedProgramme} historyInfo={history} />

          <Profiles profiles={profiles} sIndustry={selectedSType} />
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
  const { selectedSType, selectedNationality, selectedProgramme, profileByF, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo } = state
  const {
    isFetching,
    lastUpdated,
    items: profiles
  } = profileByF[selectedSType] || {
    isFetching: true,
    items: [],
  }
  return { 
    selectedSType,
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


export default connect(mapStateToProps)(app);
