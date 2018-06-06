import React from 'react'
import PropTypes from 'prop-types'

const PickerNationality = ({ value, onChange, options }) => (
  <div>
    <label className="sr-only">Nationality</label>
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

PickerNationality.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PickerNationality
