export default function SearchBar({ checkboxLabel }) {
  return (
    <search className="search-bar">
      <input type="search" placeholder="Пошук у меню" />
      <label>
        <input type="checkbox" /> {checkboxLabel}
      </label>
    </search>
  )
}
