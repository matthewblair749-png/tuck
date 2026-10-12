/**
 * The only place the app imports icons from. Phosphor, Regular weight for UI,
 * Fill for active states. Icons are deep-imported one by one so the bundle
 * only carries the glyphs Tuck actually uses.
 */
import type { Icon } from 'phosphor-react-native';

import { ArrowsClockwiseIcon } from 'phosphor-react-native/src/icons/ArrowsClockwise';
import { BasketIcon } from 'phosphor-react-native/src/icons/Basket';
import { BroomIcon } from 'phosphor-react-native/src/icons/Broom';
import { CalendarBlankIcon } from 'phosphor-react-native/src/icons/CalendarBlank';
import { CaretRightIcon } from 'phosphor-react-native/src/icons/CaretRight';
import { CheckIcon } from 'phosphor-react-native/src/icons/Check';
import { DotsThreeIcon } from 'phosphor-react-native/src/icons/DotsThree';
import { ForkKnifeIcon } from 'phosphor-react-native/src/icons/ForkKnife';
import { HouseSimpleIcon } from 'phosphor-react-native/src/icons/HouseSimple';
import { MicrophoneIcon } from 'phosphor-react-native/src/icons/Microphone';
import { ShoppingBagIcon } from 'phosphor-react-native/src/icons/ShoppingBag';
import { SquaresFourIcon } from 'phosphor-react-native/src/icons/SquaresFour';
import { TShirtIcon } from 'phosphor-react-native/src/icons/TShirt';
import { UserCircleIcon } from 'phosphor-react-native/src/icons/UserCircle';
import { XIcon } from 'phosphor-react-native/src/icons/X';

import type { Category } from './tokens';

export type { Icon, IconWeight } from 'phosphor-react-native';

export const icons = {
  today: HouseSimpleIcon,
  week: SquaresFourIcon,
  groceries: BasketIcon,
  you: UserCircleIcon,
  mic: MicrophoneIcon,
  close: XIcon,
  check: CheckIcon,
  more: DotsThreeIcon,
  chevron: CaretRightIcon,
  refresh: ArrowsClockwiseIcon,
} satisfies Record<string, Icon>;

export const categoryIcons: Record<Category, Icon> = {
  meal: ForkKnifeIcon,
  laundry: TShirtIcon,
  errand: ShoppingBagIcon,
  chore: BroomIcon,
  fixed: CalendarBlankIcon,
};

export const categoryLabels: Record<Category, string> = {
  meal: 'Meal',
  laundry: 'Laundry',
  errand: 'Errand',
  chore: 'Chore',
  fixed: 'Calendar',
};
