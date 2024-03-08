"use client";
import { useEffect, useState } from "react";
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

import {
  MdScreenShare,
  MdStopScreenShare,
  MdCallEnd,
  MdOutlineMicNone,
  MdOutlineMicOff,
  MdOutlineVideocam,
  MdOutlineVideocamOff,
  MdOutlinePersonOff,
  MdLogout,
} from "react-icons/md";
import { Container } from "../shared/Container";
import { ShareScreenComponent } from "./SharedScreen";
import Link from "next/link";
import Image from "next/image";
import LoadingScreen from "../shared/LoadingScreen";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
// Redux
import { useDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth";
import appFirebase from "@/utils/credentials_firebase";
import { getAuth } from "firebase/auth";

function CallAgora(props: { appId: string; channelName: string }) {
  const client = useRTCClient(
    AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }),
  );

  return (
    <AgoraRTCProvider client={client}>
      <Videos channelName={props.channelName} AppID={props.appId} />
    </AgoraRTCProvider>
  );
}

function Videos(props: { channelName: string; AppID: string }) {
  const auth = getAuth(appFirebase);
  const { AppID, channelName } = props;
  const { isLoading: isLoadingMic, localMicrophoneTrack } =
    useLocalMicrophoneTrack();
  const { isLoading: isLoadingCam, localCameraTrack } = useLocalCameraTrack();
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);
  const [isMuteVideo, setMuteVideo] = useState(false);
  const [isMuteAudio, setMuteAudio] = useState(false);
  const [isSharingEnabled, setScreenSharing] = useState(false); // sirve para compartir pantalla local
  const router = useRouter();
  const dispatch = useDispatch();
  // seleccionar el video que queremos en la pantalla grande
  const [selectedUidVideo, setSelectedUidVideo] = useState(0);

  // asignamos el primer usuario que se conecte como el usuario seleccionado
  useEffect(() => {
    if (remoteUsers.length > 0) {
      setSelectedUidVideo(remoteUsers[0].uid as number);
    } else {
      setSelectedUidVideo(0);
    }
  }, [remoteUsers]);

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
      <div className="flex h-screen w-full flex-col items-center  pb-10">
        <LoadingScreen />
      </div>
    );

  remoteUsers.length > 0 && console.log("remoteUsers", remoteUsers);

  const isActiveRemoteVideo = remoteUsers.find(
    (user) => user.uid === selectedUidVideo,
  )?.hasVideo;
  const isActiveRemoteAudio = remoteUsers.find(
    (user) => user.uid === selectedUidVideo,
  )?.hasAudio;

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

  const handleLogout = async () => {
    await auth.signOut();
    dispatch(logout());
    Cookies.remove("authTokensEmail");
    router.push("/login");
  };

  return (
    <div className="h-screen bg-white">
      {isSharingEnabled && (
        <ShareScreenComponent
          setScreenSharing={setScreenSharing}
          channelName={channelName}
          AppID={AppID}
          isSharingEnabled={isSharingEnabled}
        />
      )}

      <Container className="py-4">
        <div className="relative my-10 flex h-[70vh] w-full flex-col items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 via-cyan-500 to-gray-500 p-1">
          <div className="h-full w-full rounded-lg border-2 shadow-md">
            <RemoteUser
              user={
                remoteUsers.find((user) => user.uid === selectedUidVideo) ||
                remoteUsers[0]
              }
              key={
                remoteUsers.find((user) => user.uid === selectedUidVideo)
                  ?.uid || remoteUsers[0]?.uid
              }
              className="h-full w-full rounded-lg border-2 shadow-md"
            />

            {!isActiveRemoteVideo && (
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-800 bg-opacity-50">
                <MdOutlineVideocamOff className="text-4xl text-white" />
              </div>
            )}
          </div>

          {/* Parte inferior izquierda nombre remoto usuario */}
          <div className="absolute bottom-0 left-0 m-4 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2 shadow-sm">
            {isActiveRemoteAudio ? (
              <MdOutlineMicNone className="mx-1 text-sm text-red-500" />
            ) : (
              <MdOutlineMicOff className="mx-1 text-sm text-white" />
            )}

            <span className="relative mr-2 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
            </span>
            <p className="text-[10px] text-white">
              User {selectedUidVideo || 0}
            </p>
          </div>

          {/* Video Local parte inferior derecha*/}
          <div
            className={`absolute bottom-0 right-0 rounded-xl border-4 shadow-md transition-all duration-500 ${remoteUsers.length === 0 ? "flex h-full w-full p-0" : "m-4 h-36 w-36"}`}
          >
            {!isMuteVideo ? (
              <div className={`container h-full w-full rounded-xl`}>
                <LocalVideoTrack track={localCameraTrack} play={true} />
              </div>
            ) : (
              <div className="container flex h-full w-full items-center justify-center rounded-xl bg-gray-800 ">
                <MdOutlinePersonOff className="text-4xl text-white" />
              </div>
            )}

            <div className="absolute bottom-0 right-0 ">
              <div className="mb-4 mr-2 flex items-center justify-center rounded-full bg-gray-800 bg-opacity-50 px-2 py-1">
                <div>
                  {isMuteAudio ? (
                    <MdOutlineMicOff className="mx-1 text-sm text-white" />
                  ) : (
                    <MdOutlineMicNone className="mx-1 text-sm text-red-500" />
                  )}
                </div>
                <div className="flex flex-row items-center">
                  <span className="relative mr-2 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-[10px] text-white">You</p>
                </div>
              </div>
            </div>
          </div>

          {/* Si tengo mas de 2 usuarios colocarlos en una grilla y que se ordene en un cuadrado con bordes blancos separados y sus nombres de usuario */}
          {remoteUsers.length > 1 && (
            <div className="absolute right-0 top-0 w-full pt-4">
              <div className="flex h-full w-full flex-wrap justify-end gap-2 overflow-x-auto overflow-y-auto rounded-lg  px-4 pt-2">
                {/* filtraremos  que  el usuario seleccionado no se muestre en la grilla  */}
                {remoteUsers
                  .filter((user) => user.uid !== selectedUidVideo)
                  .map((user) => (
                    <div
                      key={user.uid}
                      className="relative h-32 w-32 rounded-xl border-4 shadow-md"
                      onClick={() => setSelectedUidVideo(user.uid as number)}
                    >
                      <RemoteUser
                        user={user}
                        key={user.uid}
                        className="h-full w-full rounded-xl"
                      />
                      <div className="absolute bottom-0 right-0 flex items-center rounded-full bg-gray-800 bg-opacity-50 p-2">
                        <span className="relative mr-2 flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                        </span>
                        <p className="text-[10px] text-white">{user.uid}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Botones de control */}
        <div className="flex flex-col justify-between space-x-4 space-y-3 pb-4 sm:flex-row">
          <Image
            src="/assets/logo.png"
            alt="Agora Logo"
            width={140}
            height={40}
            className="hidden justify-start object-contain sm:flex"
          />
          <div className="flex flex-row items-center justify-center space-x-4">
            <button
              onClick={toggleMuteVideo}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isMuteVideo ? <MdOutlineVideocamOff /> : <MdOutlineVideocam />}
            </button>

            <button
              onClick={toggleMuteAudio}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isMuteAudio ? <MdOutlineMicOff /> : <MdOutlineMicNone />}
            </button>

            <button
              onClick={handleToggleScreenSharing}
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-gray-500 text-2xl text-white hover:bg-gray-600 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
            >
              {isSharingEnabled ? <MdStopScreenShare /> : <MdScreenShare />}
            </button>

            <Link
              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-red-400 text-2xl text-white hover:bg-red-500 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              href="/videocall"
            >
              <MdCallEnd />
            </Link>
          </div>
          {/* Botones de control */}

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500 p-4 text-sm text-white"
          >
            Cerrar Sesión <MdLogout className="ml-2 inline-block text-2xl" />
          </button>
        </div>
      </Container>
    </div>
  );
}

export default CallAgora;
