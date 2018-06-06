import React from 'react'
import PropTypes from 'prop-types'



const PickerIdustry = ({ value, onChange, options }) => (
  <div>
    <label className='sr-only'>Industry</label>
    <select onChange={e => onChange(e.target.value)}
            value={value}>
      {options.map((option, i) =>
        <option value={option} key={i}>
          {option}
        </option>)
      }
    </select>
  </div>
)

PickerIdustry.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PickerIdustry
