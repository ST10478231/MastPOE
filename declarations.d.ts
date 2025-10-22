// Ambient module declarations for modules without bundled types

// react-native-picker -- basic typing to silence TS until proper types are added
declare module '@react-native-picker/picker' {
  import * as React from 'react';

  // Picker is a React component that also exposes a static `Item`
  // subcomponent used as `<Picker.Item ... />` inside JSX.
  export const Picker: React.ForwardRefExoticComponent<any> & { Item: React.ComponentType<any> };

  export default Picker;
}
