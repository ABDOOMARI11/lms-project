import React, { FC, useEffect, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

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

  useEffect(() => {
    if (videoId) {
      const player = new Plyr(`#player`);
    }
  }, [videoId]);

  return (
    <div style={{ position: "relative",overflow: "hidden" }}>
      {videoId && (
        <div
          id="player"
          data-plyr-provider="youtube"
          data-plyr-embed-id={videoId}
          style={{ pointerEvents: "none" }} // This line prevents right-click on the iframe
          onContextMenu={(e) => e.preventDefault()} // Disable right-click context menu
        ></div>
      )}
    </div>
  );
};

export default CoursePlayer;
