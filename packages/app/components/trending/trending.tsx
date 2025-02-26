import { useCallback } from "react";
import { useWindowDimensions, Platform } from "react-native";

import type { ListRenderItemInfo } from "@shopify/flash-list";

import { InfiniteScrollList } from "@showtime-xyz/universal.infinite-scroll-list";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { EmptyPlaceholder } from "app/components/empty-placeholder";
import { ErrorBoundary } from "app/components/error-boundary";
import {
  TrendingItem,
  TrendingSkeletonItem,
} from "app/components/trending/trending-item";
import { useTrendingNFTS } from "app/hooks/api-hooks";
import { useHeaderHeight } from "app/lib/react-navigation/elements";
import { NFT } from "app/types";

import { breakpoints } from "design-system/theme";

const Header = () => {
  const headerHeight = useHeaderHeight();
  return (
    <>
      <View
        style={{
          height: Platform.select({
            ios: headerHeight + 8,
            default: 8,
          }),
        }}
      />
      <View tw="hidden flex-row justify-between bg-white pb-4 pt-6 dark:bg-black md:flex">
        <Text tw="font-bold text-gray-900 dark:text-white md:text-xl">
          Trending
        </Text>
      </View>
    </>
  );
};

const keyExtractor = (item: NFT) => `${item.nft_id}`;
export const Trending = () => {
  const { height: screenHeight, width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];

  const { data: list, isLoading } = useTrendingNFTS({});

  const numColumns = isMdWidth ? 3 : 2;

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<NFT & { loading?: boolean }>) => {
      const marginLeft = isMdWidth ? 0 : index % numColumns === 0 ? 0 : 12;
      return (
        <TrendingItem
          nft={item}
          index={index}
          tw="mb-6"
          style={{ marginLeft: marginLeft }}
          numColumns={numColumns}
        />
      );
    },
    [isMdWidth, numColumns]
  );

  const getItemType = useCallback(
    (_: NFT, index: number) => {
      const marginLeft = isMdWidth ? 0 : index % numColumns === 0 ? 0 : 8;
      if (marginLeft) {
        return "right";
      }
      return "left";
    },
    [isMdWidth, numColumns]
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View tw="mx-auto w-full max-w-screen-xl justify-center md:px-0">
          {new Array(4).fill(0).map((_, index) => (
            <View
              tw="mb-6 w-full flex-row justify-between"
              key={index.toString()}
            >
              <TrendingSkeletonItem numColumns={numColumns} tw="flex-1" />
              <TrendingSkeletonItem
                numColumns={numColumns}
                tw="ml-3 flex-1 md:ml-0"
              />
              {isMdWidth && (
                <TrendingSkeletonItem numColumns={numColumns} tw="flex-1" />
              )}
            </View>
          ))}
        </View>
      );
    }
    return (
      <EmptyPlaceholder title={"No drops, yet."} tw="h-[50vh]" hideLoginBtn />
    );
  }, [isLoading, isMdWidth, numColumns]);

  return (
    <View tw="min-h-screen w-full bg-white dark:bg-black">
      <View tw="md:max-w-screen-content mx-auto w-full">
        <ErrorBoundary>
          <InfiniteScrollList
            useWindowScroll
            data={list}
            preserveScrollPosition
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            renderItem={renderItem}
            drawDistance={500}
            getItemType={getItemType}
            style={{
              height: Platform.select({
                web: undefined,
                default: screenHeight,
              }),
            }}
            contentContainerStyle={{
              paddingHorizontal: 16,
            }}
            overscan={12}
            containerTw="px-4 md:px-0"
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={Header}
            estimatedItemSize={275}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};
