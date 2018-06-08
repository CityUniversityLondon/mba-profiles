import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import { fetchProfileIfNeeded, loadMore, invalidateProfiles, selectIndustry,
 selectNationality, selectProgramme, getIndusrty, receiveProfiles, nextPageInfo } from './actions'
import Profiles from './components/Profiles'
import PickerIdustry from './components/PickerIdustry'
import PickerNationality from './components/PickerNationality'
import PickerProgramme from './components/PickerProgramme'
import PropTypes from 'prop-types'
import Students from './studentJson'
import queryString from 'query-string'




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
    const { dispatch } = this.props
    fetch(`https://reqres.in/api/users`)
    .then(response => response.json())
    .then(json => dispatch(getIndusrty(['3','4','5'])))

    const parsed = queryString.parse(this.props.history.location.search)
    console.log(parsed)
    
    if(parsed.industry != undefined){this.props.dispatch(selectIndustry(parsed.industry))}
      
    if(parsed.nationality != undefined){this.props.dispatch(selectNationality(parsed.nationality))}
      
    if(parsed.programme != undefined){this.props.dispatch(selectProgramme(parsed.programme))}  
  }

  componentDidMount() {
    const { dispatch, selectedIndustry, selectedNationality, selectedProgramme } = this.props
    dispatch(fetchProfileIfNeeded( selectedIndustry, selectedNationality, selectedProgramme ))
    
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.selectedIndustry !== this.props.selectedIndustry) || 
      (nextProps.selectedNationality !== this.props.selectedNationality) || 
      (nextProps.selectedProgramme !== this.props.selectedProgramme)) {
      const { dispatch, selectedIndustry, selectedNationality, selectedProgramme } = nextProps
      dispatch(fetchProfileIfNeeded( selectedIndustry, selectedNationality, selectedProgramme ))
    }
  }

  getHistory = () =>{
    const h = this.props.location.search
    const parsed = queryString.parse(h)
    console.log(parsed)
    return parsed
  }

  setHistory = parseHistory =>{
    this.props.history.push(parseHistory)
  }

  handleChangeIndus = nextIndus => {
    this.props.dispatch(selectIndustry(nextIndus))
    const h = this.getHistory()
    h.industry = nextIndus
    const stringfiy = queryString.stringify(h)
    this.props.history.push('?'+stringfiy)
  }

  handleChangeNat = nextNat => {
    this.props.dispatch(selectNationality(nextNat))
    const h = this.getHistory()
    h.nationality = nextNat
    const stringfiy = queryString.stringify(h)
    this.props.history.push('?'+stringfiy)
    
  }

  handleChangeProg = nextProg => {
    this.props.dispatch(selectProgramme(nextProg))
    const h = this.getHistory()
    h.programme = nextProg
    const stringfiy = queryString.stringify(h)
    this.props.history.push('?'+stringfiy)
  }
  
  loadMore = () => {
    const { dispatch, selectedIndustry, selectedNationality, selectedProgramme, receiveNextPageInfo } = this.props
    dispatch(loadMore( selectedIndustry, selectedNationality, selectedProgramme, receiveNextPageInfo ))
  }

  getFacets = Students => {
    const a = Students.facets.map(child => child)
    return a
  }

  facetsIndustry = facets => {
   const i = this.getFacets(Students)
   const a = []
   i.forEach(e => {
    if(e.name === 'Industry' )
      e.options.forEach( el => a.push(el.v))
  })
   a.unshift('all')
    return a
  }

  facetsNationality = facets => {
    const i = this.getFacets(Students)
    const a = []
    i.forEach( e => {
      if(e.name === 'Nationality')
        e.options.forEach( el => a.push(el.v)) 
    })
    a.unshift('all')
      return a
  }

  facetsProgramme = facets => {
    const i = this.getFacets(Students)
    const a = []
    i.forEach( e => {
      if(e.name === 'Programme')
        e.options.forEach( el => a.push(el.v)) 
    })
    a.unshift('all')
      return a
  }

  filterProfiles = profiles => {
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
    /*const a = ['selectedIndustry', 'selectedProgramme', 'selectedNationality']
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
    })*/

  }

  render() {
    const { selectedIndustry, selectedNationality, selectedProgramme, profiles, receiveIndustry, receiveNextPageInfo } = this.props
    const s = this.facetsIndustry()

    console.log(profiles)
    return (
      <div>
      <PickerIdustry value={selectedIndustry}
                onChange={this.handleChangeIndus}
                options={this.facetsIndustry()} />
      <PickerNationality value={selectedNationality}
                onChange={this.handleChangeNat}
                options={this.facetsNationality()} />
      <PickerProgramme value={selectedProgramme}
                onChange={this.handleChangeProg}
                options={this.facetsProgramme()} />

        <Profiles profiles={this.filterProfiles(profiles)} sIndustry={selectedIndustry} />
        {receiveNextPageInfo.totalPages > 1 ? 
          <div className="loadMoreButtonContainer"><button data-page={profiles.profileByF} 
          onClick={this.loadMore}>Load more</button></div> : 
          <button type='button' disabled>Load more</button>}

        
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const { selectedIndustry, selectedNationality, selectedProgramme, profileByF, receiveIndustry, receiveNextPageInfo } = state
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
    receiveNextPageInfo
  } 
}


export default connect(mapStateToProps)(MainPage);
