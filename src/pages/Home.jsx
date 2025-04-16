import Carousel from '../components/Carousel'
import SpotifyPlaylist from '../components/SpotifyPlaylist'
import WhatsAppButton from '../components/WhatsAppButton'

const Home = () => {
  const carouselImages = [
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller2_myzau9.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216296/taller4_bbctcv.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216293/taller3_m65xxt.jpg',
    'https://res.cloudinary.com/dtnkj0wdx/image/upload/t_resize/v1744216292/taller1_lcxjxg.jpg',
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