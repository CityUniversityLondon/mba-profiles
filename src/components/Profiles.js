import React from 'react'
import PropTypes from 'prop-types'
import FaUser from 'react-icons/lib/fa/user';

const Profiles = ({profiles, sIndustry}) =>(

		<div className='student-profiles'>
			{
				profiles
				.map((profile,i) => 
					<div className='student-profiles__profile' key={i}>
						<div className="student-profiles__profile__img">
							{
								profile.metaData.K ? 
									<a href={profile.liveUrl}><img src={profile.metaData.K} alt={profile.title}/></a>
									:
									<a href={profile.liveUrl}><FaUser/></a>
							}
						</div>
						<div className="student-profiles__profile__details">
							<div className="student-profiles__profile__details__title"><a href={profile.liveUrl}>{profile.title}</a></div>
							{
								profile.metaData.I ? 
									<p><span className="filterCat">Industry:</span> <span className="firstLetterCap">{profile.metaData.I}</span></p>
									:
									null
							}
							{
								profile.metaData.P ? 
									<p><span className="filterCat">Programme:</span> <span className="firstLetterCap">{profile.metaData.P}</span></p>
									:
									null
							}
							{
								profile.metaData.N ? 
									<p><span className="filterCat">Nationality:</span> <span className="firstLetterCap">{profile.metaData.N}</span></p>
									:
									null
							}
						</div>
					</div>
					)
			}
		</div>	
	)

Profiles.propTypes = {
  profiles: PropTypes.array.isRequired
}

export default Profiles