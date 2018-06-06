import React from 'react'
import PropTypes from 'prop-types'

const PickerProgramme = ({ value, onChange, options }) => (
  <div>
    <label className='sr-only'>Programme</label>
    <select onChange={e => onChange(e.target.value)}
            value={value}>
      {options.map(option =>
        <option value={option} key={option}>
          {option}
        </option>)
      }
    </select>
  </div>
)

PickerProgramme.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PickerProgramme
