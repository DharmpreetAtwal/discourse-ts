import { FC } from "react";
import { MessageTag } from "../../interfaces/group/groupTypes";

export const GroupMessageTag: FC<MessageTag> = ({ sender, msg }) => {
  return (
    <>
      {sender.uid && (
        <div
          key={msg.id}
          className="flex items-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-purple-200/50"
        >
          {/* Sender Profile Picture */}
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-300 shadow-md"
              src={sender.photoURL}
              alt={sender.displayName}
            />
          </div>

          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Sender Name and Timestamp */}
            <div className="flex items-baseline gap-2 mb-1 flex-wrap">
              <h4 className="font-bold text-gray-800 text-base">
                {sender.displayName}
              </h4>
              <span className="text-xs text-gray-500 font-medium">
                {new Date(msg.createdAt.toDate()).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' • '}
                {new Date(msg.createdAt.toDate()).toLocaleDateString([], {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>

            {/* Message Text */}
            <p className="text-gray-700 text-base break-words leading-relaxed">
              {msg.message}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
