import {
  createStateHook,
  createActionsHook,
  createEffectsHook,
  createReactionHook
} from 'overmind-react';
import { state } from './overmind/state';
import * as actions from './overmind/actions';

export const config = {
  state,
  actions
};

export const useAppState = createStateHook();
export const useActions = createActionsHook();
export const useEffects = createEffectsHook();
export const useReaction = createReactionHook();
