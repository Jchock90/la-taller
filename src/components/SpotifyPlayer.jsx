import { motion } from 'framer-motion';

const SpotifyPlayer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="w-full flex justify-center bg-red"
    >
      <iframe
        src="https://open.spotify.com/embed/playlist/41DWUFcZTx1GbNDIydf6AZ?si=5feaf13154da41bd"
        width="100%"
        height="380"
        frameBorder="0"
        allow="encrypted-media"
        className="rounded-lg max-w-2xl"
        title="Spotify Player"
      ></iframe>
    </motion.div>
  );
};

export default SpotifyPlayer;