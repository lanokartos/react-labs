import { menu } from './data.js'
import SearchBar from './components/SearchBar.jsx'
import MenuTable from './components/MenuTable.jsx'

export default function App() {
  return (
    <main className="app">
      <h1>Меню кав'ярні</h1>
      <SearchBar searchText="Пошук у меню" checkboxLabel="Лише в наявності" />
      <MenuTable text1="Позиція" text2="Ціна" menu={menu} />
    </main>
  )
}
