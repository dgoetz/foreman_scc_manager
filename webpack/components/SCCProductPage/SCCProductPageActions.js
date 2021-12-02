import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { foremanUrl } from 'foremanReact/common/helpers';

export const fetchProducts = (scc_account_id) => async (dispatch) => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator('SCC_PRODUCT_LIST');
  const url = foremanUrl(`/api/scc_accounts/${scc_account_id}/scc_products`);

  dispatch({
    type: REQUEST,
    payload: { scc_account_id },
  });
  try {
    const { data } = await API.get(url);
    return dispatch({
      type: SUCCESS,
      payload: {
        scc_account_id,
        data,
      },
    });
  } catch (error) {
    return dispatch({
      type: FAILURE,
      payload: {
        scc_account_id,
        error,
      },
    });
  }
};
