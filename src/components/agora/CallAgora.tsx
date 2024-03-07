"use client";
import { useEffect, useRef, useState } from "react";
import AgoraRTC, {
  AgoraRTCProvider,
  LocalVideoTrack,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  useLocalScreenTrack,
  usePublish,
  useRTCClient,
  useRemoteAudioTracks,
  useRemoteUsers,
  useTrackEvent,
} from "agora-rtc-react";

function CallAgora(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" })
  );
  // const devices = AgoraRTC.getDevices();
  // console.log("devices", devices);

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
      <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
        <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a>
      </div>
    </AgoraRTCProvider>
  );
}

const ShareScreenComponent: React.FC<{
  setScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setScreenSharing }) => {
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
      appid: "8d0e6c0588194991af086560049f5bea",
      channel: "miachis",
      token: null,
      uid: 0,
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

function Videos(props: { channelName: string; AppID: string }) {
  const { AppID, channelName } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const [isMuteAudio, setMuteAudio] = useState(false);
  const [isSharingEnabled, setScreenSharing] = useState(false);

  const handleToggleScreenSharing = () => {
    setScreenSharing((previous) => !previous);
  };
  usePublish([localMicrophoneTrack, localCameraTrack]);
  useJoin({
    appid: AppID,
    channel: channelName,
    token: null,
  });

  audioTracks.map((track) => track.play());
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

  const toggleMuteVideo = () => {
    localCameraTrack?.setEnabled(!isMuteVideo);
    setMuteVideo(!isMuteVideo);
  };

  const toggleMuteAudio = () => {
    localMicrophoneTrack?.setEnabled(!isMuteAudio);
    setMuteAudio(!isMuteAudio);
  };

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
        {/* Desactivar y Activar  video
         */}
        <button onClick={toggleMuteVideo}>
          {isMuteVideo ? "Unmute Video" : "Mute Video"}
        </button>

        {/* 
          Desactivar y Activar audio      
        */}
        <button
          onClick={toggleMuteAudio}
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
        >
          {isMuteAudio ? "Unmute Audio" : "Mute Audio"}
        </button>

        <button onClick={handleToggleScreenSharing}>
          {isSharingEnabled ? "Stop Sharing" : "Start Sharing"}
        </button>

        {isSharingEnabled && (
          <ShareScreenComponent setScreenSharing={setScreenSharing} />
        )}

        {remoteUsers.map((user) => (
          <RemoteUser user={user} key={user.uid} />
        ))}
      </div>
    </div>
  );
}

export default CallAgora;
