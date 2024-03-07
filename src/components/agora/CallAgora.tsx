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

import { CiMicrophoneOff, CiMicrophoneOn } from "react-icons/ci";
import { MdScreenShare, MdStopScreenShare } from "react-icons/md";
import { Container } from "../shared/Container";
import { ShareScreenComponent } from "./SharedScreen";

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
        {/* <a
          className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
          href="/"
        >
          End Call
        </a> */}
      </div>
    </AgoraRTCProvider>
  );
}

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
    localCameraTrack
      ?.setEnabled(isMuteVideo)
      .then(() => setMuteVideo((prev) => !prev))
      .catch((error) => console.error(error));
  };

  const toggleMuteAudio = () => {
    localMicrophoneTrack
      ?.setEnabled(isMuteAudio)
      .then(() => {
        setMuteAudio((prev) => !prev);
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="bg-slate-200 h-screen">
      {isSharingEnabled && (
        <>
          <h1>Aca debe de mostrarse</h1>
          <ShareScreenComponent
            setScreenSharing={setScreenSharing}
            channelName={channelName}
            AppID={AppID}
            isSharingEnabled={isSharingEnabled}
          />
        </>
      )}

      <Container className="py-4">
        <div className="bg-cyan-100 w-full h-[70vh] my-10 rounded-lg flex justify-center items-center relative">
          {isSharingEnabled ? (
            <div
              className="
              w-full h-full rounded-lg shadow-md
            "
            >
              <h1>
                <p>Sharing aca mandamos la iamgen del video...</p>
              </h1>
            </div>
          ) : (
            <RemoteUser
              user={remoteUsers[0]}
              key={remoteUsers[0]?.uid}
              className="w-full h-full rounded-lg shadow-md"
            />
          )}

          {/* parte inferior derecha el usuario local */}
          <div className="absolute bottom-0 right-0  w-40 h-40  bg-transparent rounded-sm p-4">
            <LocalVideoTrack track={localCameraTrack} play={true} />

            <div className="flex justify-center items-center">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <p className="text-white text-sm ml-2">You</p>
            </div>
          </div>

          <div className="fixed z-10 bottom-0 left-0 right-0 flex justify-center pb-4">
            <a
              className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
              href="/"
            >
              End Call
            </a>

            <button
              onClick={toggleMuteVideo}
              className="w-20 h-20 rounded-full bg-red-400 hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isMuteVideo ? "Unmute Video" : "Mute Video"}
            </button>

            <button
              onClick={toggleMuteAudio}
              className="px-5 py-3 text-base font-medium text-center text-white bg-red-400 rounded-lg hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900 w-40"
            >
              {isMuteAudio ? (
                <CiMicrophoneOff className="w-12 h-12 text-sm" />
              ) : (
                <CiMicrophoneOn className="w-12 h-12 text-sm" />
              )}
              {isMuteAudio ? "Unmute Audio" : "Mute Audio"}
            </button>

            <button onClick={handleToggleScreenSharing}>
              {isSharingEnabled ? (
                <MdStopScreenShare className="w-12 h-12 text-sm" />
              ) : (
                <MdScreenShare className="w-12 h-12 text-sm" />
              )}
              {isSharingEnabled ? "Stop Sharing" : "Start Sharing"}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default CallAgora;
