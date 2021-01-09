//상태값 변경: 원래있던 state와 action 합치기
import {
  UPDATE_COMMENT,
  MODIFY_COMMENT,
  DELETE_COMMENT,
} from "../_actions/commentAction";

export default function (state = {}, action) {
  switch (action.type) {
    case UPDATE_COMMENT:
      return { ...state, comment: action.payload };
      break;

    case MODIFY_COMMENT:
      return { ...state, comment: action.payload };
      break;

    case DELETE_COMMENT:
      return { ...state, comment: action.payload };
      break;

    default:
      return state;
  }
}