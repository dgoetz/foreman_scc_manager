import { API_OPERATIONS, put } from 'foremanReact/redux/API';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';

export const subscribeProductsWithReposAction = (
  sccAccountId,
  sccProductData,
  handleSubscription
) =>
  put({
    type: API_OPERATIONS.PUT,
    key: `subscribe_key_${sccAccountId}_${sccProductData[0].scc_product_id}_${sccProductData[0].repository_list}`,
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
    key: `syncSccAccountKey_${sccAccountId}`,
    url: `/api/scc_accounts/${sccAccountId}/sync`,
    successToast: () => __('Sync task started.'),
    errorToast: (error) => __('Failed to add task to queue.'),
  });
