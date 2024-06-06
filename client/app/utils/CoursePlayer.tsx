import React, { FC, useEffect, useState } from "react";

type Props = {
  videoUrl: string; 
};

const CoursePlayer: FC<Props> = ({ videoUrl }) => {
  const [videoId, setVideoId] = useState<string>(""); 

  useEffect(() => {
    const getVideoIdFromUrl = (url: string) => {
      const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
      const match = url?.match(videoIdRegex);
      return match ? match[1] : "";
    };

    const id = getVideoIdFromUrl(videoUrl);
    setVideoId(id);
  }, [videoUrl]);

  return (
    <div style={{ position: "relative", paddingTop: "56.25%", overflow: "hidden" }} >
      {videoId && ( 
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
          className="border-orange-500"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default CoursePlayer;
