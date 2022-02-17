import {
  API_OPERATIONS,
  APIActions,
  get,
  put,
  post,
  actionTypeGenerator,
} from 'foremanReact/redux/API';
// import { API, actionTypeGenerator } from 'foremanReact/redux/API';
import { foremanUrl } from 'foremanReact/common/helpers';
import { SCCPRODUCTPAGE_SUBSCRIBE } from './SCCProductPageConstants';
import { translate as __ } from 'foremanReact/common/I18n';

export const subscribeProductsAction = (sccAccountId, sccProductIds) =>
  put({
    type: API_OPERATIONS.PUT,
    key: `subscribe_key${sccAccountId.to_s}${sccProductIds.to_s}`,
    url: `/api/scc_accounts/${sccAccountId}/bulk_subscribe`,
    params: { scc_subscribe_product_ids: sccProductIds },
    successToast: () => __('Subscription task started successfully.'),
    errorToast: (error) => __('Starting the subscription task failed.'),
  });

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
