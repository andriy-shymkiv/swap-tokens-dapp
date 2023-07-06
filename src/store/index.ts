import { CombinedState, combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { ToolkitStore } from '@reduxjs/toolkit/dist/configureStore';
import appSlice, { AppState } from './appSlice';

type RootReducer = Reducer<CombinedState<{ app: AppState }>>;

const rootReducer: RootReducer = combineReducers({
  app: appSlice,
});

const setupStore = (): { store: ToolkitStore } => {
  const store = configureStore({ reducer: rootReducer });

  return { store };
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['store']['dispatch'];

export const { store } = setupStore();
