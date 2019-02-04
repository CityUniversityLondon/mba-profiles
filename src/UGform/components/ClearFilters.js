import React from 'react'
import { connect } from 'react-redux'
import { selectSType, selectNationality, selectProgramme } from '../actions'
import qs from 'qs';
import { withRouter } from "react-router-dom";
import FaClose from 'react-icons/lib/fa/close';


class ClearFilters extends React.Component {

	handleClick (e, i){
			e.preventDefault();
			if (i === 0) {
				const h = this.props.location.search
    			const parsed = qs.parse(h, { ignoreQueryPrefix: true })
    			parsed.stype = 'all'
    			const stringfiy = qs.stringify(parsed)
    		
    			this.props.history.push('?'+stringfiy)
				this.props.dispatch(selectSType('all'))
			}
			if (i === 1) {
				const h = this.props.location.search
    			const parsed = qs.parse(h, { ignoreQueryPrefix: true })
    			parsed.nationality = 'all'
    			const stringfiy = qs.stringify(parsed)
    			this.props.history.push('?'+stringfiy)
				this.props.dispatch(selectNationality('all'))
			}
			if (i === 2) {
				const h = this.props.location.search
    			const parsed = qs.parse(h, { ignoreQueryPrefix: true })
    			parsed.programme = 'all'
    			const stringfiy = qs.stringify(parsed)
    			this.props.history.push('?'+stringfiy)
				this.props.dispatch(selectProgramme('all'))
			}
		}
	render(){
		const { selectedSType, selectedNationality, selectedProgramme } = this.props
		let f = [selectedSType, selectedNationality, selectedProgramme]
		return(
				<div className="student-profiles-search__filters-wrap">
					<strong>Active filters:</strong>
					{
						f.map((filter,i) => {
							if(filter !== 'all'){
							return (								
								
									<a key={i} data-filter={i} onClick={e => this.handleClick(e, i)}><span>{filter}<FaClose/></span></a>
								
								)
							}
						})
					}
				</div>
			)
	}
}


const mapStateToProps = (state) => {
	const { selectedSType, selectedProgramme, selectedNationality } = state

	return{
		selectedSType,
		selectedProgramme,
		selectedNationality
	}
}

export default withRouter(connect(mapStateToProps)(ClearFilters))