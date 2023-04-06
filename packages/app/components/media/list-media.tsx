import { useMemo, RefObject } from "react";
import { Platform } from "react-native";

import { Video as ExpoVideo } from "expo-av";

import { Image, ResizeMode } from "@showtime-xyz/universal.image";

import { withMemoAndColorScheme } from "app/components/memo-with-theme";
import { CreatorEditionResponse } from "app/hooks/use-creator-collection-detail";
import type { NFT } from "app/types";
import { getMediaUrl } from "app/utilities";

import { ListVideo } from "design-system/list-video";

type Props = {
  item?: NFT & { loading?: boolean };
  tw?: string;
  resizeMode?: ResizeMode;
  isMuted?: boolean;
  edition?: CreatorEditionResponse;
  videoRef?: RefObject<ExpoVideo>;
};

function ListMediaImpl({ item, resizeMode: propResizeMode }: Props) {
  const resizeMode = propResizeMode ?? "cover";

  const mediaUri = useMemo(
    () =>
      item?.loading
        ? item?.source_url
        : getMediaUrl({ nft: item, stillPreview: false }),
    [item]
  );

  const mediaStillPreviewUri = useMemo(
    () => getMediaUrl({ nft: item, stillPreview: true }),
    [item]
  );

  return (
    <>
      {item?.mime_type?.startsWith("image") &&
      item?.mime_type !== "image/gif" ? (
        <Image
          source={{
            uri: mediaUri,
          }}
          recyclingKey={mediaUri}
          blurhash={item?.blurhash}
          data-test-id={Platform.select({ web: "nft-card-media" })}
          resizeMode={resizeMode}
          alt={item?.token_name}
          style={{ height: "100%", width: "100%" }}
        />
      ) : null}

      {item?.mime_type?.startsWith("video") ||
      item?.mime_type === "image/gif" ? (
        <ListVideo
          source={{
            uri: mediaUri,
          }}
          posterSource={{
            uri: mediaStillPreviewUri,
          }}
          blurhash={item?.blurhash}
          isMuted={true}
          resizeMode={resizeMode as any}
        />
      ) : null}
    </>
  );
}

export const ListMedia = withMemoAndColorScheme<typeof ListMediaImpl, Props>(
  ListMediaImpl
);
