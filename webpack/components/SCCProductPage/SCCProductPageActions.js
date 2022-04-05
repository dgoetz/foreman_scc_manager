import {
  API_OPERATIONS,
  APIActions,
  get,
  put,
  post,
  actionTypeGenerator,
} from 'foremanReact/redux/API';
import { foremanUrl } from 'foremanReact/common/helpers';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import { SCCPRODUCTPAGE_SUBSCRIBE } from './SCCProductPageConstants';

export const subscribeProductsAction = (sccAccountId, sccProductIds) =>
  put({
    type: API_OPERATIONS.PUT,
    key: `subscribe_key${sccAccountId.toString()}${sccProductIds.toString()}`,
    url: `/api/scc_accounts/${sccAccountId}/bulk_subscribe`,
    params: { scc_subscribe_product_ids: sccProductIds },
    successToast: () => __('Subscription task started successfully.'),
    errorToast: (error) => __('Starting the subscription task failed.'),
  });

export const subscribeProductsWithReposAction = (
  sccAccountId,
  sccProductData,
  handleSubscription
) =>
  put({
    type: API_OPERATIONS.PUT,
    key: `subscribe_key${sccAccountId.toString()}${sccProductData.toString()}`,
    url: `/api/scc_accounts/${sccAccountId}/bulk_subscribe_with_repos`,
    params: { scc_product_data: sccProductData },
    successToast: (response) =>
      sprintf(
        __('Subscription task %s started successfully.'),
        response.data.id
      ),
    errorToast: (error) => __('Starting the subscription task failed.'),
    handleSuccess: (response) => handleSubscription(response.data.id),
  });

export const syncSccAccountAction = (sccAccountId) =>
  put({
    type: API_OPERATIONS.PUT,
    key: `syncSccAccountKey${sccAccountId.toString()}`,
    url: `/api/scc_accounts/${sccAccountId}/sync`,
    successToast: () => __('Sync task started.'),
    errorToast: (error) => __('Failed to add task to queue.'),
  });
