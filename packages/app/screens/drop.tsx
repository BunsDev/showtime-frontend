import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { Drop } from "app/components/drop";

const DropModal = () => {
  return <Drop />;
};

export const DropScreen = withModalScreen(DropModal, {
  title: "Choose your drop type",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full lg:w-[800px] web:lg:pb-14",
  disableBackdropPress: true,
  web_height: `max-h-[100vh] md:max-h-[82vh]`,
  snapPoints: ["100%"],
});
