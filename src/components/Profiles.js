import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const Profiles = ({profiles, sIndustry}) =>(

		<div className='profiles'>
			{
				profiles
				.map((profile,i) => 
					<div className='profiles__profile' key={i}>
						<div className="profiles__profile__img">
						</div>
						<div className="profiles__profile__details">
							name: <a href={profile.liveUrl}>{profile.title}</a>
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