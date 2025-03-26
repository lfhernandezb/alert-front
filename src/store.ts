import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
}

const changeState = (state = initialState, action: { type: string; payload?: Partial<typeof initialState> }) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action }
    default:
      return state
  }
}

const store = createStore(changeState)
export default store