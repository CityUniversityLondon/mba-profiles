import React from 'react'
import PropTypes from 'prop-types'

const PickerIndustry = ({ value, onChange, options }) => (
  <div className="filter--box filter--box--industry">
    <label className='sr-only'>Student type</label>
    <select onChange={e => onChange(e.target.value)} value={value}>
      {
        options.map((option, i) =>

          <option value={i===0? 'all' : option} key={i}>
            {option}
          </option>

        )
      }
    </select>
  </div>
)

PickerIndustry.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PickerIndustry
