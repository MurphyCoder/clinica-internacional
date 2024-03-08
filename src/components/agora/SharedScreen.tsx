import AgoraRTC, {
  useJoin,
  useLocalScreenTrack,
  usePublish,
  useTrackEvent,
} from "agora-rtc-react";
import { useEffect, useRef } from "react";
import { Container } from "../shared/Container";

export const ShareScreenComponent: React.FC<{
  setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
  AppID: string;
  isSharingEnabled: boolean;
}> = ({ setScreenSharing, channelName, AppID, isSharingEnabled }) => {
  const screenShareClient = useRef(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );
  const { screenTrack, isLoading, error } = useLocalScreenTrack(
    true,
    {},
    "disable",
    screenShareClient.current,
  );

  useJoin(
    {
      appid: AppID,
      channel: channelName,
      token: null,
      uid: 0, // This is the user id, set to 0 to let Agora assign one
    },
    true,
    screenShareClient.current,
  );
  useTrackEvent(screenTrack, "track-ended", () => {
    setScreenSharing(false);
  });
  useEffect(() => {
    if (error) setScreenSharing(false);
  }, [error, setScreenSharing]);

  usePublish([screenTrack], screenTrack !== null, screenShareClient.current);

  if (isLoading) {
    return (
      <Container>
        <div className="flex w-full items-center justify-center ">
          <svg
            fill="none"
            className="h-6 w-6 animate-spin"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
              fill="currentColor"
              fill-rule="evenodd"
            />
          </svg>
          <p className="text-sm text-gray-700">Compartiendo pantalla...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return <p>Error al compartir pantalla</p>;
  }

  if (!isSharingEnabled || !screenTrack) {
    return null; // No mostrar nada si la pantalla no se está compartiendo o si no hay pista de pantalla
  }

  return <></>;
};
