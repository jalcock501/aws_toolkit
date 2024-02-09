import './css/DropDown.css'

export const TTLDropDown = ({onChange}) => {
    return (
            <select className="TTLDropDown" onChange={onChange}>
                <option value="0">TTL</option>
                <option value="0">burn on read</option>
                <option value="300">5 minutes</option>
                <option value="600">10 minutes</option>
                <option value="900">15 minutes</option>
                <option value="1800">30 minutes</option>
                <option value="3600">1 hour</option>
                <option value="21600">6 hours</option>
                <option value="43200">12 hours</option>
                <option value="86400">1 day</option>
                <option value="604800">1 week</option>
            </select>
    )
}