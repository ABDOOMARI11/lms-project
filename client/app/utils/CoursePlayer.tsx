import React, { FC, useEffect, useState } from "react";

type Props = {
  videoUrl: string; // Modification : changer videoId en videoUrl
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState<string>(""); // Nouvel état pour stocker l'identifiant de la vidéo

  useEffect(() => {
    // Extraire l'identifiant de la vidéo de l'URL
    const getVideoIdFromUrl = (url: string) => {
      const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url.match(videoIdRegex);
      return match ? match[1] : "";
    };

    // Récupérer l'identifiant de la vidéo à partir de l'URL
    const id = getVideoIdFromUrl(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }}>
      {videoId && ( // Utiliser videoId à la place de videoUrl pour l'URL de l'iframe
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            border: 0,
          }}
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
