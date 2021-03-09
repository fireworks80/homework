import { createAction, handleActions } from 'redux-actions';
import { list } from '../request';

const GET_LIST = 'list/GET_LIST';
const GET_LIST_SUCCESS = 'list/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'list/GET_LIST_FAILURE';

const APPEND_LIST = 'list/APPEND_LIST';
const APPEND_LIST_SUCCESS = 'list/APPEND_LIST_SUCCESS';
const APPEND_LIST_FAILURE = 'list/APPEND_LIST_FAILURE';

const DELETED_ITEM = 'list/DELETED_ITEM';

export const getList = (pageNum) => async (dispatch) => {
  dispatch({ type: GET_LIST });

  try {
    const response = await list.fetch(pageNum);
    dispatch({ type: GET_LIST_SUCCESS, payload: { list: response, page: pageNum } });
  } catch (err) {
    dispatch({ type: GET_LIST_FAILURE, payload: err });
  }
};

export const deletedItem = createAction(DELETED_ITEM, (item) => item);

const initialState = {
  list: [],
  page: 1,
  deletedItems: [],
};

export default handleActions(
  {
    [GET_LIST_SUCCESS]: (state, { payload: { list, page } }) => ({
      ...state,
      list: state.list.concat(list),
      page,
    }),
    [DELETED_ITEM]: (state, { payload }) => ({
      ...state,
      deletedItems: state.deletedItems.concat(payload),
    }),
  },
  initialState
);
