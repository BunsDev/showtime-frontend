import React, { useCallback, ComponentType } from "react";
import { View, ViewProps } from "react-native";

import {
  FlashList,
  FlashListProps,
  ListRenderItemInfo,
  CellContainer,
} from "@shopify/flash-list";
import { ScrollView } from "react-native-gesture-handler";

// Here for reference: https://github.com/software-mansion/react-native-reanimated/pull/3948
// this has to be done like so to fix momentum scroll end not firing for Android
const ScrollViewWithRef = React.forwardRef((props, ref) => (
  <ScrollView {...props} ref={ref} onMomentumScrollEnd={() => {}} />
)) as typeof ScrollView;

ScrollViewWithRef.displayName = "ScrollViewWithRef";

export { CellContainer, FlashList };
export type InfiniteScrollListProps<T> = FlashListProps<T> & {
  index?: number;
  /**
   * Grid layout item view props, only valid when numColumns > 1
   * @default undefined
   */
  gridItemProps?: ViewProps | null;
  // override this type, avoid some style code that cause the web to be re-rendered.
  ListHeaderComponent?: ComponentType<{
    context?: unknown;
  }>;
  ListFooterComponent?: ComponentType<{
    context?: unknown;
  }>;

  preserveScrollPosition?: boolean;
  useWindowScroll?: boolean;
};

function FlashListComponent<T>(
  {
    style,
    renderItem: propRenderItem,
    numColumns,
    gridItemProps,
    ...rest
  }: InfiniteScrollListProps<T>,
  ref: any
) {
  const renderItem = useCallback(
    (props: ListRenderItemInfo<T>) => {
      if (!propRenderItem) return null;
      if (gridItemProps && numColumns && numColumns > 1) {
        return <View {...gridItemProps}>{propRenderItem(props)}</View>;
      } else {
        return propRenderItem(props);
      }
    },
    [gridItemProps, numColumns, propRenderItem]
  );
  if (style) {
    return (
      <View style={[{ height: "100%" }, style]}>
        <FlashList
          renderScrollComponent={ScrollViewWithRef}
          {...rest}
          numColumns={numColumns}
          ref={ref}
          renderItem={renderItem}
        />
      </View>
    );
  } else {
    return (
      <FlashList
        renderScrollComponent={ScrollViewWithRef}
        {...rest}
        numColumns={numColumns}
        renderItem={renderItem}
        ref={ref}
      />
    );
  }
}

export const InfiniteScrollList = React.forwardRef(FlashListComponent) as <T>(
  props: InfiniteScrollListProps<T> & {
    ref?: React.Ref<FlashList<T>>;
    useWindowScroll?: boolean;
    preserveScrollPosition?: boolean;
    overscan?: number;
    /**
     * web only
     */
    containerTw?: string;
  }
) => React.ReactElement;
