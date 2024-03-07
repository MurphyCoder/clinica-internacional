"use client";
import { useState, useEffect } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
} from "agora-rtc-react";

function CallAgora(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  const [isMuted, setIsMuted] = useState(false);

  return (
    <AgoraRTCProvider client={client}>
      <Videos
        channelName={props.channelName}
        AppID={props.appId}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
      />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
        {/* Botones para activar desactivar microfono, camara y compartir pantalla */}
        <div className="flex justify-center z-40">
          <button
            className="px-5 py-3 text-base font-medium text-center text-white bg-blue-400 rounded-lg hover:bg-blue-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
            onClick={async () => {
              const screenTrack = await AgoraRTC.createScreenVideoTrack(
                {
                  encoderConfig: "1080p_1",
                },
                "auto"
              );
              client.localTracks.forEach((track) => {
                if (track.trackMediaType === "video") {
                  track.setEnabled(false);
                }
              });
              client.publish(screenTrack);
            }}
          >
            Share Screen
          </button>
          <button
            className="px-5 py-3 text-base font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
            onClick={() => {
              setIsMuted(!isMuted);
            }}
          >
            {isMuted ? "Unmute" : "Mute"}
          </button>
          <button
            className="px-5 py-3 text-base font-medium text-center text-white bg-green-400 rounded-lg hover:bg-green-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
            onClick={() => {
              client.localTracks.forEach((track) => {
                if (track.trackMediaType === "video") {
                  track.setEnabled(!track.isPlaying);
                }
              });
            }}
          >
            Camera
          </button>
        </div>
      </div>
    </AgoraRTCProvider>
  );
}

function Videos(props: {
  channelName: string;
  AppID: string;
  isMuted: boolean;
  setIsMuted: (value: boolean) => void;
}) {
  const { AppID, channelName, isMuted, setIsMuted } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  console.log("🚀 ~ Videos ~ remoteUsers:", remoteUsers);
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  console.log("🚀 ~ Videos ~ audioTracks:", audioTracks);

  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });

  // Controla la reproducción del audio local basado en el estado de isMuted
  useEffect(() => {
    if (localMicrophoneTrack) {
      if (isMuted) {
        localMicrophoneTrack.setEnabled(false); // Desactiva el audio local
        setIsMuted(true);
      } else {
        localMicrophoneTrack.setEnabled(true); // Activa el audio local
        setIsMuted(false);
      }
    }
  }, [isMuted, localMicrophoneTrack]);

  // Reproduce los audio tracks remotos
  useEffect(() => {
    audioTracks.forEach((track) => {
      track.play();
    });
  }, [audioTracks]);

  const deviceLoading = isLoadingMic || isLoadingCam;
  if (deviceLoading)
    return (
      <div className="flex flex-col items-center pt-40">Loading devices...</div>
    );

  const numUsers = remoteUsers.length + 1;
  let numCols = 1;
  let numRows = 1;
  switch (numUsers) {
    case 1:
      numCols = 1;
      numRows = 1;
      break;
    case 2:
      numCols = 2;
      numRows = 1;
      break;
    case 3:
      numCols = 3;
      numRows = 1;
      break;
    case 4:
      numCols = 2;
      numRows = 2;
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col justify-between w-full h-screen p-1">
      <div
        className={`grid grid-cols-${numCols} grid-rows-${numRows} gap-1 flex-1`}
      >
        <LocalVideoTrack
          track={localCameraTrack}
          play={true}
          className="w-full h-full"
        />

        {/* Aquí puedes mostrar un indicador visual del estado del audio */}
        <div>{isMuted ? "Microphone Muted" : "Microphone Unmuted"}</div>

        {remoteUsers.map((user) => (
          <div key={user.uid}>
            <RemoteUser user={user} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default CallAgora;
