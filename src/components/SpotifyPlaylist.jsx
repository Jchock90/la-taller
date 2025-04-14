const SpotifyPlaylist = () => {
    return (
      <section className="py-12 bg-indigo-50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-indigo-800">
            Mi playlist de inspiración
          </h2>
          <div className="max-w-2xl mx-auto">
            <iframe
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DX4WYpdgoIcn6"
              width="100%"
              height="380"
              frameBorder="0"
              allow="encrypted-media"
              className="rounded-lg shadow-lg"
              title="Spotify Playlist"
            ></iframe>
          </div>
        </div>
      </section>
    )
  }
  
  export default SpotifyPlaylist