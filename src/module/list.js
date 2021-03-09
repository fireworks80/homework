import { createAction, handleActions } from 'redux-actions';
import { list } from '../request';

const GET_LIST = 'list/GET_LIST';
const GET_LIST_SUCCESS = 'list/GET_LIST_SUCCESS';
const GET_LIST_FAILURE = 'list/GET_LIST_FAILURE';

const getList = (pageNum) => async (dispatch) => {
  dispatch({ type: GET_LIST });

  try {
    const response = await list.fetch(pageNum);
    dispatch({ type: GET_LIST_SUCCESS, payload: { list: response, page: pageNum } });
  } catch (err) {
    dispatch({ type: GET_LIST_FAILURE, payload: err });
  }
};

const initialState = {
  list: [],
  page: 1,
};

export default handleActions(
  {
    [GET_LIST_SUCCESS]: (state, { payload: { list, page } }) => ({
      list,
      page,
    }),
  },
  initialState
);
