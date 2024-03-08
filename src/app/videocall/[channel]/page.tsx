import CallAgora from "@/components/agora/CallAgora";

const ChannelPage = ({ params }: { params: { channel: string } }) => {
  return (
    <div>
      ChannelPag: {params.channel} {process.env.PUBLIC_AGORA_APP_ID}
      <CallAgora
        channelName={params.channel}
        appId={
          process.env.PUBLIC_AGORA_APP_ID?.toString() ||
          "1234567890abcdef1234567890abcdef"
        }
      />
    </div>
  );
};

export default ChannelPage;
