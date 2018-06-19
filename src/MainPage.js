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
    console.log(this.props.match.params.number)
    fetch(`https://www.cass.city.ac.uk/fb/search.html?form=json&collection=CASS-Student-Profiles`)
    .then(response => response.json())
    .then(json => this.props.dispatch(getFacetsInfo(json)))  

  

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
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme } = this.props
    dispatch(fetchProfileIfNeeded( selectedIndustry, selectedYear, selectedProgramme ))
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme, history } = nextProps

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

    if ((nextProps.selectedIndustry !== this.props.selectedIndustry) || 
      (nextProps.selectedYear !== this.props.selectedYear) || 
      (nextProps.selectedProgramme !== this.props.selectedProgramme)) {
      
      dispatch(fetchProfileIfNeeded( selectedIndustry, selectedYear, selectedProgramme ))
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
  
  loadMore = () => {
    const { dispatch, selectedIndustry, selectedYear, selectedProgramme, receiveNextPageInfo } = this.props
    dispatch(loadMore( selectedIndustry, selectedYear, selectedProgramme, 
      receiveNextPageInfo.page, receiveNextPageInfo.perPage, receiveNextPageInfo.totalPages, receiveNextPageInfo.currEnd ))
  }

  getFacets = () => {
    
    const f = Students.facets.map(child => child)
    return f
  }

  facetsIndustry = facets => {
    const i = this.props.receiveFacetsInfo
    if(Object.keys(i).length === 0 && i.constructor === Object){
      return []
    }
    else{
      const a = []
      i.forEach(e => {
        if(e.name === 'Industry' )
          e.options.forEach( el => a.push(el.v))
      })
      a.sort()
      a.unshift('-- Industry --')
        return a
    }
  }

  facetsYear = facets => {
    const i = this.props.receiveFacetsInfo
    if(Object.keys(i).length === 0 && i.constructor === Object){
      return []
    }
    else{
      const a = []
      i.forEach( e => {
        if(e.name === 'Year')
          e.options.forEach( el => a.push(el.v)) 
      })
      a.sort()
      a.unshift('-- Year --')
        return a
    }
  }

  facetsProgramme = facets => {
    const i = this.props.receiveFacetsInfo
    if(Object.keys(i).length === 0 && i.constructor === Object){
      return []
    }
    else{
      const a = []
      i.forEach( e => {
        if(e.name === 'Programme')
          e.options.forEach( el => a.push(el.v)) 
      })
      a.sort()
      a.unshift('-- Programme --')
        return a
    }
  }

  /*filterProfiles = profiles => {
    const { selectedIndustry, selectedProgramme, selectedNationality } = this.props
    console.log(selectedProgramme)
    
    switch (true){
      //Industry = all & Programme = all & Nationality = all
      
      //Industry = all & Programme = select & Nationality = select
      case (selectedIndustry === 'all' && selectedProgramme !== 'all' && selectedNationality !== 'all'):

        return profiles.filter(profiles => 
      profiles.metaData.P === selectedProgramme && profiles.metaData.N === selectedNationality)
      //Industry = select & Programme = all & Nationality = select
      case (selectedIndustry !== 'all' && selectedProgramme === 'all' && selectedNationality !== 'all'):

        return profiles.filter(profiles => profiles.metaData.I === selectedIndustry
      && profiles.metaData.N === selectedNationality)
      //Industry = select & Programme = select & Nationality = all
      case (selectedIndustry !== 'all' && selectedProgramme !== 'all' && selectedNationality === 'all'):

        return profiles.filter(profiles => profiles.metaData.I === selectedIndustry
     && profiles.metaData.P === selectedProgramme)
      //Industry = all & Programme = all & Nationality = select
      case (selectedIndustry === 'all' && selectedProgramme === 'all' && selectedNationality !== 'all'):

        return profiles.filter(profiles => profiles.metaData.N === selectedNationality)
      //Industry = all & Programme = select & Nationality = all
      case (selectedIndustry === 'all' && selectedProgramme !== 'all' && selectedNationality === 'all'):

        return profiles.filter(profiles => profiles.metaData.P === selectedProgramme)
      //Industry = select & Programme = all & Nationality = all
      case (selectedIndustry !== 'all' && selectedProgramme === 'all' && selectedNationality === 'all'):

        return profiles.filter(profiles => profiles.metaData.I === selectedIndustry) 
      //Industry = select & Programme = select & Nationality = select
      case (selectedIndustry !== 'all' && selectedProgramme !== 'all' && selectedNationality !== 'all'):

        return profiles.filter(profiles => profiles.metaData.I === selectedIndustry
     && profiles.metaData.P === selectedProgramme && profiles.metaData.N === selectedNationality)

      default:
        return profiles
    }
    
    const props = this.props
    a.forEach(function(filterBy){
      const filterValue = props[filterBy]
      if (filterValue === 'all') {
       return profiles
      }
      else {
         profiles = profiles.filter(function(item){
          return item[filterBy] === filterValue
        })
      }
    })

    
  }*/

  render() {
    const { selectedIndustry, selectedYear, selectedProgramme, profiles, receiveIndustry, receiveNextPageInfo, receiveFacetsInfo} = this.props
      console.log(this.props.receiveFacetsInfo)

    return (
      <div className="student-profiles-search">
        <div className="student-profiles-search__filters">
          <PickerIdustry value={selectedIndustry}
                    onChange={this.handleChangeIndus}
                    options={this.facetsIndustry()} />
          <PickerYear value={selectedYear}
                    onChange={this.handleChangeYear}
                    options={this.facetsYear()} />
          <PickerProgramme value={selectedProgramme}
                    onChange={this.handleChangeProg}
                    options={this.facetsProgramme()} />
        </div>
        
        <Profiles profiles={profiles} sIndustry={selectedIndustry} />
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
