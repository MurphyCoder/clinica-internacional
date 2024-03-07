import AgoraRTC, {
  useJoin,
  useLocalScreenTrack,
  usePublish,
  useTrackEvent,
} from "agora-rtc-react";
import { useEffect, useRef } from "react";

export const ShareScreenComponent: React.FC<{
  setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
  AppID: string;
}> = ({ setScreenSharing, channelName, AppID }) => {
  const screenShareClient = useRef(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  const { screenTrack, isLoading, error } = useLocalScreenTrack(
    true,
    {},
    "disable",
    screenShareClient.current
  );

  useJoin(
    {
      appid: AppID,
      channel: channelName,
      token: null,
      uid: 0, // This is the user id, set to 0 to let Agora assign one
    },
    true,
    screenShareClient.current
  );
  useTrackEvent(screenTrack, "track-ended", () => {
    setScreenSharing(false);
  });
  useEffect(() => {
    if (error) setScreenSharing(false);
  }, [error, setScreenSharing]);

  usePublish([screenTrack], screenTrack !== null, screenShareClient.current);

  if (isLoading) {
    return <p>Sharing screen...</p>;
  }
  return <></>;
};
