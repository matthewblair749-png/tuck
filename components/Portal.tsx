import { Fragment, useId, useLayoutEffect, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { create } from 'zustand';

interface PortalState {
  order: string[];
  nodes: Record<string, ReactNode>;
  mount: (key: string, node: ReactNode) => void;
  unmount: (key: string) => void;
}

const usePortalStore = create<PortalState>((set) => ({
  order: [],
  nodes: {},
  mount: (key, node) =>
    set((s) => ({
      order: s.order.includes(key) ? s.order : [...s.order, key],
      nodes: { ...s.nodes, [key]: node },
    })),
  unmount: (key) =>
    set((s) => {
      const nodes = { ...s.nodes };
      delete nodes[key];
      return { order: s.order.filter((k) => k !== key), nodes };
    }),
}));

/**
 * Renders children into the app-level overlay host, above all screens and
 * outside the blur target, so sheets can blur the app on Android too.
 * The host sits inside every app provider, so theme and stores still work.
 */
export function Portal({ children }: { children: ReactNode }) {
  const key = useId();
  const mount = usePortalStore((s) => s.mount);
  const unmount = usePortalStore((s) => s.unmount);

  useLayoutEffect(() => {
    mount(key, children);
  }, [key, children, mount]);

  useLayoutEffect(() => () => unmount(key), [key, unmount]);

  return null;
}

export function PortalHost() {
  const order = usePortalStore((s) => s.order);
  const nodes = usePortalStore((s) => s.nodes);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {order.map((key) => (
        <Fragment key={key}>{nodes[key]}</Fragment>
      ))}
    </View>
  );
}
