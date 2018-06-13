import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Profiles = ({profiles, sIndustry}) =>(

		<div className='student-profiles'>
			{
				profiles
				.map((profile,i) => 
					<div className='student-profiles__profile' key={i}>
						<div className="student-profiles__profile__img">
							<a href={profile.liveUrl}><img src={profile.metaData.K} alt={profile.title}/></a>
						</div>
						<div className="student-profiles__profile__details">
							<div className="student-profiles__profile__details__title"><a href={profile.liveUrl}>{profile.title}</a></div>
							<p>Industry: {profile.metaData.I}</p>
							<p>Nationality: {profile.metaData.N}</p>
							<p>Programme: {profile.metaData.P}</p>
						</div>
					</div>
					)
			}
		</div>	
	)

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired
}

const mapStateToProps = state => {
		const { selectedIndustry } = state
		return {
			selectedIndustry
		}
	}

export default Profiles