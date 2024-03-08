import CallAgora from "@/components/agora/CallAgora";

const ChannelPage = ({ params }: { params: { channel: string } }) => {
  return (
    <div>
      <div className="flex items-center justify-center pt-5">
        <h1 className="text-primary-500 text-xl font-bold">
          Reunión: {params.channel}
        </h1>
      </div>

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
