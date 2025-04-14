import Carousel from '../components/Carousel'
import SpotifyPlaylist from '../components/SpotifyPlaylist'
import WhatsAppButton from '../components/WhatsAppButton'

const Home = () => {
  const carouselImages = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  ]

  return (
    <div>
      <Carousel images={carouselImages} />
      <SpotifyPlaylist />
      <WhatsAppButton />
    </div>
  )
}

export default Home