import { withModalScreen } from "@showtime-xyz/universal.modal-screen";

import { CreateDropSteps } from "app/components/drop/create-drop-steps/create-drop-steps";

export const DropScreen = withModalScreen(CreateDropSteps, {
  title: "Create",
  matchingPathname: "/drop",
  matchingQueryParam: "dropModal",
  tw: "w-full",
  snapPoints: ["78%", "100%"],
  useNativeModal: false,
  headerShown: false,
});
