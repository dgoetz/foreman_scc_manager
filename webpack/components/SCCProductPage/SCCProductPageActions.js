import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { foremanUrl } from 'foremanReact/common/helpers';
import { SCCPRODUCTPAGE_SUBSCRIBE } from './SCCProductPageConstants';

export const subscribeProductsAction =
  (sccAccountId, sccProductIds) => async (dispatch) => {
    const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator(
      SCCPRODUCTPAGE_SUBSCRIBE
    );
    dispatch({
      type: REQUEST,
      payload: { sccProductIds },
    });
    try {
      const url = foremanUrl(
        `/api/scc_accounts/${sccAccountId}/bulk_subscribe`
      );
      const { data } = await API.put(url, {
        scc_subscribe_product_ids: sccProductIds,
      });
      return dispatch({
        type: SUCCESS,
        payload: { sccAccountId },
        response: data,
      });
    } catch (error) {
      return dispatch({
        type: FAILURE,
        payload: { sccAccountId, error },
      });
    }
  };

export const fetchProducts = (sccAccountId) => async (dispatch) => {
  const { REQUEST, SUCCESS, FAILURE } = actionTypeGenerator('SCC_PRODUCT_LIST');
  const url = foremanUrl(`/api/scc_accounts/${scc_account_id}/scc_products`);

  dispatch({
    type: REQUEST,
    payload: { sccAccountId },
  });
  try {
    const { data } = await API.get(url);
    return dispatch({
      type: SUCCESS,
      payload: {
        sccAccountId,
        data,
      },
    });
  } catch (error) {
    return dispatch({
      type: FAILURE,
      payload: {
        sccAccountId,
        error,
      },
    });
  }
};
