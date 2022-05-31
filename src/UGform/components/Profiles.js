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
								profile.listMetaData.K ? 
									<a href={profile.liveUrl}><img src={profile.listMetaData.K[0]} alt={profile.title}/></a>
									:
									<a href={profile.liveUrl}><FaUser/></a>
							}
						</div>
						<div className="student-profiles__profile__details">
							<div className="student-profiles__profile__details__title"><a href={profile.liveUrl}>{profile.title}</a></div>
							{
								profile.listMetaData.I ? 
									<p><span className="filterCat">Industry:</span> <span className="firstLetterCap">{profile.listMetaData.I[0]}</span></p>
									:
									null
							}
							{
								profile.listMetaData.P ? 
									<p><span className="filterCat">Programme:</span> <span className="firstLetterCap">{profile.listMetaData.P[0]}</span></p>
									:
									null
							}
							{
								profile.listMetaData.N ? 
									<p><span className="filterCat">Nationality:</span> <span className="firstLetterCap">{profile.listMetaData.N[0].replace(';','/')}</span></p>
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