import React from 'react'
import PropTypes from 'prop-types'

const PickerYear = ({ value, onChange, options }) => (
  <div className="filter--box filter--box--nationality">
    <label className="sr-only">Year</label>
    <select onChange={e => onChange(e.target.value)} value={value}>
      {
        options.map(( option, i ) =>
          <option value={i===0? 'all' : option} key={option}>
            {option}
          </option>)
      }
    </select>
  </div>
)

PickerYear.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default PickerYear
