import { Universities, Courses, Skills } from "../../../constants/enums";


export default function StudentFilters({ filters, onFilterChange }) {

  return (
    <div className="bg-gray-800 p-4 rounded-lg grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* University Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">University</label>
        <select
          value={filters.university}
          onChange={(e) => onFilterChange({...filters, university: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
        >
          <option value="all">All</option>
          {Universities.map((uni) => (
            <option key={uni} value={uni}>{uni}</option>
          ))}
        </select>
      </div>

      {/* Course Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Course</label>
        <select
          value={filters.course}
          onChange={(e) => onFilterChange({...filters, course: e.target.value})}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
        >
          <option value="all">All</option>
          {Courses.map((course) => (
            <option key={course} value={course}>{course}</option>
          ))}
        </select>
      </div>

      {/* Skills Filter (Multi-select) */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Skills</label>
        <select
          multiple
          value={filters.skills}
          onChange={(e) => onFilterChange({
            ...filters, 
            skills: Array.from(e.target.selectedOptions, option => option.value)
          })}
          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-[42px] min-h-fit"
        >
          {Skills.map((skill) => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>
      </div>

    </div>
  );
}