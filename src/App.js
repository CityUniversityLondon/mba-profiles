import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchProfileIfNeeded, loadMore, invalidateProfiles, selectIndustry,
 selectNationality, selectProgramme, getIndusrty, receiveProfiles, nextPageInfo } from './actions'
import Profiles from './components/Profiles'
import PickerIdustry from './components/PickerIdustry'
import PickerNationality from './components/PickerNationality'
import PickerProgramme from './components/PickerProgramme'
import PropTypes from 'prop-types'
import Students from './studentJson'

class App extends Component {
  
  static propTypes = {
    selectedIndustry: PropTypes.string.isRequired,
    selectedNationality: PropTypes.string.isRequired,
    selectedProgramme: PropTypes.string.isRequired,
    profiles: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  }

  componentWillMount(){
    const { dispatch } = this.props
    fetch(`https://reqres.in/api/users`)
    .then(response => response.json())
    .then(json => dispatch(getIndusrty(['3','4','5'])))
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

  handleChangeIndus = nextIndus => {
    this.props.dispatch(selectIndustry(nextIndus))
  }

  handleChangeNat = nextNat => {
    this.props.dispatch(selectNationality(nextNat))
  }

  handleChangeProg = nextProg => {
    this.props.dispatch(selectProgramme(nextProg))
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
      return a
  }

  facetsProgramme = facets => {
    const i = this.getFacets(Students)
    const a = []
    i.forEach( e => {
      if(e.name === 'Programme')
        e.options.forEach( el => a.push(el.v)) 
    })
      return a
  }

  filterProfiles = profiles => {
    const { selectedIndustry, selectedProgramme, selectedNationality } = this.props
    console.log(selectedProgramme)
    return profiles.filter(profiles => profiles.metaData.I === selectedIndustry
     && profiles.metaData.P === selectedProgramme && profiles.metaData.N === selectedNationality)
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

const mapStateToProps = state => {
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


export default connect(mapStateToProps)(App);
