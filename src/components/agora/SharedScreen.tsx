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
  isSharingEnabled: boolean;
}> = ({ setScreenSharing, channelName, AppID, isSharingEnabled }) => {
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
    return <p>Compartiendo pantall...</p>;
  }

  if (error) {
    return <p>Error al compartir pantalla</p>;
  }

  if (isSharingEnabled) {
    return (
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <button
          onClick={() => {
            setScreenSharing(false);
          }}
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
        >
          Dejar de compartir
        </button>
      </div>
    );
  }

  if (!isSharingEnabled || !screenTrack) {
    return null; // No mostrar nada si la pantalla no se está compartiendo o si no hay pista de pantalla
  }

  return <></>;
};
