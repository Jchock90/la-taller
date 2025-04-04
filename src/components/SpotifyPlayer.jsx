const SpotifyPlayer = ({ url }) => {
    return (
      <div className="bg-black p-6 rounded-lg shadow-xl">
        <h3 className="text-white text-xl font-bold mb-4">La playlist de La Taller</h3>
        <iframe
          src={`https://open.spotify.com/embed/playlist/${url.split('/').pop()}`}
          width="100%"
          height="380"
          frameBorder="0"
          allowtransparency="true"
          allow="encrypted-media"
          className="rounded-md"
        ></iframe>
      </div>
    );
  };
  
  export default SpotifyPlayer;