"use client";

import { MouseEvent, useState, useEffect } from "react";
import {
  formatDuration,
  formatUploaded,
  formatViewsLikes,
} from "@/app/utils/utils";
import { Submission } from "@/app/api";
import SaveButton from "./SaveButton";
import ChatterChip from "./ChatterChip";
import VideoSkeleton from "@/app/_shared/VideoSkeleton";
import "./styles.css";

type VideoProps = {
  isActive: boolean;
  submission: Submission;
  handleMuteChatter: (user: string) => void;
  handleSelectVideo: (submissionId: number) => void;
  handleClickSave: (title: string, message: string) => void;
};

export default function Video({
  isActive,
  submission,
  handleMuteChatter,
  handleSelectVideo,
  handleClickSave,
}: VideoProps) {
  const { sender, submissionId, video, isMuted } = submission!;
  const {
    id,
    code,
    thumbnailUrl,
    title,
    viewCount,
    likeCount,
    uploadedAt,
    duration,
    channelName,
    channelId,
    isLiked,
  } = video!;

  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setIframeLoaded(isActive);
  }, [isActive]);

  const handleClickThumbnail = (event: MouseEvent) => {
    event.preventDefault();
    handleSelectVideo(submissionId);
  };

  const handleLoad = () => {
    setIframeLoaded(true);
  };

  const onClickSave = (saved: boolean) => {
    handleClickSave(title, `has been ${saved ? "" : "un"}liked`);
  };

  if (isMuted) return <VideoSkeleton />;
  return (
    <div className="sm:w-1/2 xl:w-1/3 h-full flex-col inline-flex justify-start items-start gap-1 p-2">
      <div className={`w-full height-100 pb-[56.25%] relative`}>
        {isActive && iframeLoaded && (
          <iframe
            className="h-auto w-full aspect-video rounded-xl absolute top-0 left-0"
            onLoad={handleLoad}
            src={`https://www.youtube.com/embed/${code}?&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share"
            style={{ zIndex: iframeLoaded ? 1 : -1 }}
          />
        )}
        <div className="cursor-pointer absolute top-0 left-0 w-full h-auto">
          <img
            src={thumbnailUrl}
            className="w-full rounded-xl"
            onClick={(e) => handleClickThumbnail(e)}
            alt="YouTube video thumbnail"
          />
          <div className="absolute bottom-2 right-2 px-3 py-1 bg-black rounded-full">
            <p className="text-white text-base lg:text-large 2xl:text-xl font-medium ">
              {formatDuration(duration)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col self-stretch">
        <p className="self-stretch text-black text-base lg:text-lg 2xl:text-xl font-bold">
          {title}
        </p>
        <a
          target="_blank"
          href={`https://www.youtube.com/channel/${channelId}`}
          className="self-stretch text-gray-500 hover:text-gray-600 duration-150 text-md lg:text-base 2xl:text-lg font-medium"
        >
          {channelName}
        </a>
        <div className="inline-flex justify-start items-center self-stretch gap-2">
          <div className="text-gray-500 text-sm lg:text-md 2xl:text-base">
            {formatViewsLikes(viewCount) + " views"}
          </div>
          <div className="text-gray-500 text-sm lg:text-md 2xl:text-base">
            •
          </div>
          <div className="text-gray-500 text-sm lg:text-md 2xl:text-base">
            {formatViewsLikes(likeCount) + " likes"}
          </div>
          <div className="text-gray-500 text-sm lg:text-md 2xl:text-base">
            •
          </div>
          <div className="text-gray-500 text-sm lg:text-md 2xl:text-base">
            {formatUploaded(uploadedAt) + " ago"}
          </div>
        </div>
        <div className="inline-flex justify-between items-center self-stretch pt-2">
          <ChatterChip onClickMute={handleMuteChatter} sender={sender} />
          <SaveButton onClickSave={onClickSave} id={id} isLiked={isLiked} />
        </div>
      </div>
    </div>
  );
}
