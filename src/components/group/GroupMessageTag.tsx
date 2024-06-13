import { FC } from "react";
import { MessageTag } from "../../interfaces/types";

export const GroupMessageTag: FC<MessageTag> = ({ sender, msg }) => {
  return (
    <>
      {sender.uid && (
        <div
          key={msg.id}
          className="flex flex-row w-auto h-14 bg-amber-500 m-2 p-1 items-center justify-between rounded-3xl "
        >
          <div className="flex flex-row h-5/6 items-center justify-center text-xl">
            <img className="h-full rounded-2xl mx-2" src={sender.photoURL} />
            <p> {sender.displayName} </p>
          </div>

          <div className="text-lg">{msg.message}</div>

          <div>
            <p> {msg.createdAt.toDate().toString()} </p>
          </div>
        </div>
      )}
    </>
  );
};
