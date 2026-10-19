import Nav from './components/Nav'
import Hero from './components/Hero'
import SkiddedFrom from './components/SkiddedFrom'
import Philosophy from './components/Philosophy'
import Showcase from './components/Showcase'
import Archive from './components/Archive'
import Closing from './components/Closing'
import PageRail from './components/PageRail'

export default function App() {
  return (
    <div className="shell">
      <Nav />
      <PageRail />
      <main>
        <Hero />
        <SkiddedFrom />
        <Philosophy />
        <Showcase />
        <Archive />
        <Closing />
      </main>
    </div>
  )
}
