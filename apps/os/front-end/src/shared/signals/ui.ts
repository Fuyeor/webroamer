// @/shared/signals/ui.ts
import { Signal } from 'signal-polyfill';

// 管理系统开始菜单的显示状态
export const isStartMenuOpen = new Signal.State(false);

export const toggleStartMenu = () => {
  isStartMenuOpen.set(!isStartMenuOpen.get());
};
