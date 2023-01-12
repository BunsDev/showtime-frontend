import { useCallback, useRef, useState } from "react";

export function useControlledState<T>(
  value: T,
  defaultValue: T,
  onChange?: (value: T, ...args: any[]) => void
): [T, (value: T, ...args: any[]) => void] {
  let [stateValue, setStateValue] = useState(value || defaultValue);
  let ref = useRef(value !== undefined);
  let wasControlled = ref.current;
  let isControlled = value !== undefined;
  let stateRef = useRef(stateValue);
  if (wasControlled !== isControlled) {
    console.warn(
      `WARN: A component changed from ${
        wasControlled ? "controlled" : "uncontrolled"
      } to ${isControlled ? "controlled" : "uncontrolled"}.`
    );
  }

  ref.current = isControlled;

  let setValue = useCallback(
    (value: any, ...args: any) => {
      let onChangeCaller = (value: any, ...onChangeArgs: any) => {
        if (onChange) {
          if (!Object.is(stateRef.current, value)) {
            onChange(value, ...onChangeArgs);
          }
        }
        if (!isControlled) {
          stateRef.current = value;
        }
      };

      if (typeof value === "function") {
        console.warn(
          "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320"
        );
        let updateFunction = (oldValue: any, ...functionArgs: any) => {
          let interceptedValue = value(
            isControlled ? stateRef.current : oldValue,
            ...functionArgs
          );
          onChangeCaller(interceptedValue, ...args);
          if (!isControlled) {
            return interceptedValue;
          }
          return oldValue;
        };
        setStateValue(updateFunction);
      } else {
        if (!isControlled) {
          setStateValue(value);
        }
        onChangeCaller(value, ...args);
      }
    },
    [isControlled, onChange]
  );

  if (isControlled) {
    stateRef.current = value;
  } else {
    value = stateValue;
  }

  return [value, setValue];
}
