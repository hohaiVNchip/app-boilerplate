/* eslint-disable no-alert */
/* eslint-disable no-case-declarations */
/* eslint-disable no-plusplus */
/*
 *
 * ListBook reducer
 *
 */
import produce from 'immer';
import {
  LOAD_LISTBOOK,
  LOAD_LISTBOOK_SUCCESS,
  LOAD_LISTBOOK_ERROR,
} from './constants';

export const initialState = {
  listBook: [],
  linkParams: {
    limit: 10,
    offset: 0,
    errorMessage: '',
  },
  statusFlags: {
    isLoadMore: false,
    isCallApi: false,
    isLoading: false,
    isButton: false,
  },
};

/* eslint-disable default-case, no-param-reassign */
const listBookReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case LOAD_LISTBOOK:
        draft.statusFlags.isLoading = true;
        if (action.isLoadMore === false) {
          draft.linkParams.offset = initialState.linkParams.offset;
        } else {
          // cho màn loadmore quay
          draft.statusFlags.isLoadMore = true;
        }
        break;

      case LOAD_LISTBOOK_SUCCESS:
        const data = action.listBook;
        let list = [];

        if (action.listBook.length > 0) {
          draft.linkParams.offset =
            state.linkParams.offset + action.listBook.length;
        }

        if (action.listBook.length === draft.linkParams.limit) {
          // set lại isLoadMore để tắt xoay
          draft.statusFlags.isLoadMore = false;
        } else if (action.listBook.length < draft.linkParams.limit) {
          // 2 trường hợp dưới này là số lượng data lấy về không đủ, set lại bằng true cho xoay
          draft.statusFlags.isLoadMore = true;
          draft.statusFlags.isButton = true;
        } else {
          draft.statusFlags.isLoadMore = true;
          draft.statusFlags.isButton = true;
        }

        if (action.isLoadMore === false) {
          list = data;
        } else {
          list = [...state.listBook, ...data];
          // draft.statusFlags.isLoadMore = false;
        }

        draft.listBook = list;

        break;

      case LOAD_LISTBOOK_ERROR:
        draft.linkParams.offset = state.linkParams.offset;
        if (action.isLoadMore === false) {
          draft.listReport = initialState.listReport;
        } else {
          draft.statusFlags.isLoadMore = false;
          alert('Gọi API thất bại !');
        }
        break;
    }
  });

export default listBookReducer;
